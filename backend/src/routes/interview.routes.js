const express = require('express');
const interviewRouter = express.Router();
const authMiddleware = require('../middleware/auth.middleware')
const upload = require('../middleware/file.middleware')
const interviewController =  require('../controllers/interviewReport.controller')

interviewRouter.post('/',authMiddleware.authUser,upload.single('resume'),interviewController.generateInterviewReportController)

interviewRouter.get('/report/:interviewid',authMiddleware.authUser,interviewController.getInterviewReportById);

interviewRouter.get('/',authMiddleware.authUser,interviewController.getAllInterviewReports);

interviewRouter.post('/resume/pdf/:interviewid',authMiddleware.authUser,interviewController.generateResumePDFController)

module.exports = interviewRouter;