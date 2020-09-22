const _ = require('lodash');

const moment = require('moment');
const fetch = require('node-fetch')
const baseURL = `http://sinhvien.tlu.edu.vn:8099` 
const RSSParser = require('rss-parser');
const randomEmoji = require('random-unicode-emoji');

exports.getTodayLessons = (courseSubjects) => {
    const semester = _.get(
        courseSubjects,
        "0.courseSubject.semesterSubject.semester"
    );
    let todayLessons = [];
    _.forEach(courseSubjects, (subject) => {
        const { courseSubject, subjectName } = subject;
        _.forEach(courseSubject.timetables, (timetable) => {
            const startLearnTime = moment(semester.startDate).add(
                timetable.fromWeek - 1,
                "weeks"
            );
            const rangeLearnTime =
                (timetable.toWeek - timetable.fromWeek + 1) * 7 - 1;
            for (let i = 0; i < rangeLearnTime; i++) {
                const currentDate = startLearnTime.clone().add(i - 1, "days").startOf('days');
                if (currentDate.weekday() + 1 === timetable.weekIndex && currentDate.isSame(moment().startOf('day'))) {
                    const { startHour, endHour, room } = timetable;
                    const content = `${startHour.startString} - ${endHour.endString} | ${subjectName} | ${room.name} `
                    todayLessons.push({
                        subjectName,
                        startHour,
                        endHour,
                        room,
                        content
                    })
                }
            }
        });
    });
    return (_.sortBy(todayLessons, 'startHour.indexNumber'))
};

exports.getCourseSubjects = async (username, password) => {
    /* Login account */
    const { access_token } = await fetch(baseURL + "/education/oauth/token", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9,vi;q=0.8",
            "content-type": "application/x-www-form-urlencoded"
        },
        "referrer": baseURL,
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": `client_id=education_client&grant_type=password&username=${username}&password=${password}&client_secret=password`,
        "method": "POST",
        "mode": "cors"
    }).then(res => res.json())

    /* Get curren semeser */
    const { id } = await fetch(baseURL + "/education/api/semester/semester_info", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token
        }
    }).then(res => res.json())


    /* Return course Subject */
    return await fetch(baseURL + "/education/api/StudentCourseSubject/studentLoginUser/" + id, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token
        }
    }).then(res => res.json())
}

exports.getNews = async () => {
    const rssParser = new RSSParser();
    let news = await rssParser.parseURL('https://vnexpress.net/rss/tin-noi-bat.rss');
    const regex = /<img src="(.*?)" >/gm;
    _.map(news.items, (_new) => {
        _new.imageURL = _.get(regex.exec(_new.content), '1', 'https://source.unsplash.com/random')
    })
    return news.items
}

/* Middleware handle error */
exports.asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        // throw err
        res.jsonp({ err: true, msg: err.message }).status(400)
    })
}

exports.randEmoji = () => {
    return randomEmoji.random({count: 1})[0]
}