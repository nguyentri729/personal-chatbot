const { Chatfuel } = require('chatfuel-api')
const { getCourseSubjects, getTodayLessons, getNews, randEmoji} = require('../helper')
const _ = require('lodash')
const moment = require('moment')
const { asyncMiddleware } = require('../helper')


const today = moment()
const todayDate = `Thứ ${today.day() + 1} - ${today.format('DD/MM/YYYY')}${randEmoji()}`
const chatfuel = new Chatfuel()


exports.getTodayLessons = asyncMiddleware(async (req, res) => {
    const courseSubject = await getCourseSubjects(process.env.DKH_USERNAME, process.env.DKH_PASSWORD)
    const todayLessons = getTodayLessons(courseSubject)

    const content = _.map(todayLessons, 'content').join(`\n- `)
    res.jsonp(chatfuel.addText(`${randEmoji()} Lịch học hôm nay ${todayDate} ${randEmoji()} \n- ${content}`).render())

})

exports.getTodayNews = asyncMiddleware(async (req, res) => {
    const news = await getNews()
    const message = new Chatfuel().addText(`${randEmoji()} BẢN TIN BUỔI SÁNG ${todayDate} ${randEmoji()}`)
    _.forEach(news, (_new) => {
        const buttons = new Chatfuel()
            .addButton('link', _new.link, 'View')
            .render('button');
        message.addGalleryCard(_new.title, _new.imageURL, _new.contentSnippet, buttons)
    })
    res.jsonp(message.addGallery().render())
})