const pdfParse = require("pdf-parse")
const interviewReportModel = require('../models/interviewReport.model')
const { generateInterviewReport, generateResumePdf } = require('../services/ai.service')

async function generateInterviewReportController(req, res) {
    
    const { selfDescription, jobDescription } = req.body;

    if(!jobDescription) {
        return res.status(400).json({
            message: "Job description is required"
        })
    }

    if(!req.file && !selfDescription) {
        return res.status(400).json({
            message: "Please provide either a resume or a self description"
        })
    }

    let resumeContent = ""
    if(req.file) {
        const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        resumeContent = parsed.text
    }

    const interviewReportByAI = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent,
        selfDescription,
        jobDescription,
        ...interviewReportByAI
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })
}


async function getInterviewReportById(req, res) {
    const { interviewid } = req.params

    const interviewReport = await interviewReportModel.findById(interviewid)

    if (!interviewReport) {
        return res.status(404).json({
            message: 'Interview Report not found'
        })
    }

    res.status(200).json({
        message: 'Interview Report fetched successfully',
        interviewReport
    })


}

async function getAllInterviewReports(req, res) {
    const InterviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        InterviewReports
    })
}

async function generateResumePDFController(req, res) {
    const { interviewid } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewid);

    if (!interviewReport) {
        return res.status(404).json({
            message: 'Interview report not found'
        })
    }

    const { resume, selfDescription, jobDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewid}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterviewReportController, getInterviewReportById, getAllInterviewReports, generateResumePDFController }