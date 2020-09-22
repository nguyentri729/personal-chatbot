const schedule = require('node-schedule')
require('dotenv').config()
const { broadcast } = require('chatfuel-api')

const broadcastMessage = (blockId) => {
    console.log('Jobs runiing ' + blockId)
    const options = {
        botId: process.env.CHATFUEL_BOTID,
        blockId,
        token: process.env.CHATFUEL_TOKEN,
        userId: process.env.CHATFUEL_USERID,
    }
    return broadcast(options)
}


exports.runJobs = () => {
    schedule.scheduleJob('0 0 6 * * *', function () {
        broadcastMessage('TodayNews')
        broadcastMessage('TodayLessons')
    });
}