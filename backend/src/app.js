const express = require('express')
const app = express();
const cors = require('cors')
const authRoutes = require('./routes/auth.routes') 
const interviewRoutes = require('./routes/interview.routes')
const cookieParser =  require('cookie-parser');

app.use(cors({
    origin:'https://prep-ai-two-eta.vercel.app',
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use('/api/interview',interviewRoutes)

module.exports = app