const { GoogleGenAI } = require('@google/genai')
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require('puppeteer-core')
const chromium = require('chrome-aws-lambda')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(7).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behaviouralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(4).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skills: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "10mm",
            bottom: "10mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pdfBuffer
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `You are an expert resume writer with deep knowledge of ATS systems. 
Generate a professional resume for a candidate with the following details:

                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

STRICT REQUIREMENTS:

ATS RULES:
- Use standard section headings: "Summary", "Experience", "Education", "Skills", "Projects"
- No tables, columns, text boxes or graphics — ATS cannot parse these
- No headers/footers — ATS often ignores them
- Use simple bullet points (•) for listing items
- spell out abbreviations at least once
- Include keywords directly from the job description naturally
- Use standard fonts only: Arial, Calibri, Times New Roman
- No images or icons

HTML RULES:
- Return clean single column layout HTML only
- Inline CSS only — no external stylesheets
- Simple styling — no complex flexbox or grid layouts
- Use <h1> for name, <h2> for section headings, <ul><li> for bullet points
- Font size between 10px-12px for body, 14px-16px for headings
- Black or dark gray text only — no heavy colors
- White background

CONTENT RULES:
- Start with a strong 3-4 line professional summary tailored to the job
- Quantify achievements where possible (e.g. "increased performance by 40%")
- Use action verbs: "Built", "Developed", "Led", "Improved", "Implemented"
- Only include relevant experience and skills matching the job description
- Keep it to 1 page maximum — quality over quantity
- Do not include: photo, age, gender, marital status, nationality
- Do not make up any information not present in the resume or self description

OUTPUT:
Return a JSON object with a single field "html" containing the complete HTML resume.
The HTML should be ready to convert to PDF using puppeteer with no modifications needed.`

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}


async function generateInterviewReport({ resume, jobDescription, selfDescription }) {

    const prompt = `You are a world-class interview coach and talent acquisition expert with 20+ years of experience in technical hiring.

Your task is to deeply analyze the candidate's profile against the job description and generate a highly personalized, actionable interview preparation report.

---
CANDIDATE RESUME:
${resume}

CANDIDATE SELF DESCRIPTION:
${selfDescription}

TARGET JOB DESCRIPTION:
${jobDescription}
---

ANALYSIS INSTRUCTIONS:
- Technical questions must be specific to the job description's tech stack and the candidate's experience level — not generic.
- Behavioural questions must reflect the company's culture and role responsibilities mentioned in the job description.
- Skill gaps must only highlight what is clearly missing compared to the job requirements.
- Preparation plan must be practical, day-by-day, and tailored to close the identified skill gaps before the interview.
- Job title must be extracted directly from the job description.

MATCH SCORE RULES:
- Be STRICT and REALISTIC. Do not inflate the score.
- Penalize heavily for any skill listed as "learning", "basic", or "beginner" if that skill is explicitly required in the job description.
- A candidate with 2-3 missing or weak required skills should NOT score above 75.
- Use this scale strictly:
  * 90-100: Candidate meets ALL requirements with strong proven evidence
  * 75-89:  Candidate meets most requirements with only 1-2 minor gaps
  * 60-74:  Candidate meets core requirements but has notable skill gaps
  * 40-59:  Candidate meets some requirements with significant gaps
  * Below 40: Poor match, multiple major skills missing`

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema, {
                target: "openApi3",
                $refStrategy: "none"
            })

        }

    })

    return JSON.parse(response.text)
}

module.exports = { generateInterviewReport, generateResumePdf }

