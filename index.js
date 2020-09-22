const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 1234
const jobs = require('./jobs/misc.server.jobs')
const {getTodayLessons, getTodayNews} = require('./controllers/today.server.controller')

app.get('/today-lessons', getTodayLessons)

app.get('/today-news', getTodayNews)

app.listen(port, () => {
    console.log('Kimochi listing on port ' + port )
})
/* Run Jobs */
jobs.runJobs()
