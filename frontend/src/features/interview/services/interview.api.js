import axios from 'axios';

const api = axios.create({
    baseURL: "https://prepai-xya8.onrender.com",
    withCredentials: true,
})

export const generateInterviewReport = async ({ resumeFile, selfDescription, jobDescription }) => {
    const formData = new FormData()
    formData.append('resume', resumeFile);
    formData.append('selfDescription', selfDescription)
    formData.append('jobDescription', jobDescription)

    const res = await api.post('/api/interview/', formData);
    return res.data;
}

export const getInterviewReportById = async (interviewid) => {

    const res = await api.get(`/api/interview/report/${interviewid}`)
    return res.data;

}

export const getAllInterviewReports = async () => {
    const res = await api.get('/api/interview/')
    return res.data;
}

export async function generateResumePdf(interviewid) {
    const res = await api.post(`/api/interview/resume/pdf/${interviewid}`,null, { responseType: "blob" })
    return res.data
}