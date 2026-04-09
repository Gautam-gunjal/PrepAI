import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { generateInterviewReport, getInterviewReportById, getAllInterviewReports , generateResumePdf } from "../services/interview.api";
import { useParams } from "react-router-dom";


export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewid } = useParams()

    const { loading, setLoading, report, setReport, reports, setReports , error , setError } = context;

    const generateReport = async ({ resumeFile, selfDescription, jobDescription }) => {
        setLoading(true);
        try {
            const response = await generateInterviewReport({ resumeFile, selfDescription, jobDescription })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            const message = err.response.data.message || 'Something Went Wrong';
            setError(message);
            setTimeout(() => setError(null), 5000) 
            return false
        } finally {
            setLoading(false)
        }

    }

    const getReportById = async (interviewid) => {
        setLoading(true)
        try {
            const res = await getInterviewReportById(interviewid)

            setReport(res.interviewReport)

            return res.interviewReport
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }


    const getReports = async () => {
        setLoading(true);
        try {
            const res = await getAllInterviewReports()
            setReports(res.InterviewReports)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf( interviewReportId )
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (interviewid) {
            getReportById(interviewid)
        } else {
            getReports()
        }

    }, [interviewid])




    return { generateReport, getReportById, getResumePdf, loading, report, reports , error }
}