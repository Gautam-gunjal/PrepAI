import axios from "axios"

const api = axios.create({
    baseURL: "https://prepai-xya8.onrender.com",
    withCredentials: true
})


export async function register({ username, email, password }) {

    const res = await api.post("/api/auth/register", { username, email, password })
    return res.data
}

export async function login({ email, password }) {
    const res = await api.post('/api/auth/login', { email, password })
    return res.data;
}

export async function logout() {
    try {
        const res = await api.get('/api/auth/logout')
        return res.data
    } catch (err) {
        console.log(err)
    }
}

export async function getme() {
    try {
        const res = await api.get('/api/auth/get-me')
        return res.data
    } catch (err) {
        console.log(err);

    }
}
