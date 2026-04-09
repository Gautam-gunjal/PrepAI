import axios from 'axios';

export const generateInterviewReport = async ({ resumeFile, selfDescription, jobDescription }) => {
    const formData = new FormData()
    formData.append('resume', resumeFile);
    formData.append('selfDescription', selfDescription)
    formData.append('jobDescription', jobDescription)

    const res = await axios.post('http://localhost:3000/api/interview/', formData, { withCredentials: true });
    return res.data;
}

export const getInterviewReportById = async (interviewid) => {

    const res = await axios.get(`http://localhost:3000/api/interview/report/${interviewid}`, { withCredentials: true })
    return res.data;

}

export const getAllInterviewReports = async () => {
    const res = await axios.get('http://localhost:3000/api/interview/', { withCredentials: true })
    return res.data;
}

export async function generateResumePdf(interviewid) {
    const res = await axios.post(`http://localhost:3000/api/interview/resume/pdf/${interviewid}`,null, { withCredentials: true , responseType: "blob" })
    return res.data
}