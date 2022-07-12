module.exports = {
    name: "bdoworldboss",
    description: "get next world boss that spawns",
    usage: `bdoworldboss`,
    help: ``,
    execute(bot, message, args){
        const Discord = require('discord.js');
        // const request = require('sync-request');
        // let url = "https://bdobosstimer.com/?&server=eu";
        // var res = request('GET', encodeURI(url));
        // data = res.getBody('utf8');
        // console.log(response);

        // console.log('Page loaded!');
        // const cheerio = require('cheerio');
        // let $ = cheerio.load(data);
        // let nextBoss = $('.head.selected');
        // console.log(nextBoss.html());

        // return 0;

        //const Nightmare = require('nightmare');
        //const nightmare = new Nightmare();
        const nightmare = undefined; //removing nightmare due to vulnerabilities
        nightmare
            .goto('https://bdobosstimer.com/?&server=eu')
            .evaluate(() => document.querySelector('.head.selected').outerHTML)
            .end()
            .then(function(data){
                dataArr = data.split('"');
                day = dataArr[5].split('-')[0];
                hour = dataArr[5].split('-')[1].split(':')[0];
                minute = dataArr[5].split('-')[1].split(':')[1];
                boss = dataArr[9];
                day++;
                if (day == 7) day = day-7;
                date = new Date();
                date.setHours(date.getHours()-1);
                if (date.getDay() == day) {
                    text = `${boss} will spawn in `;
                    hours = hour - date.getHours();
                    minutes = minute - date.getMinutes();
                    if (minutes < 0) {
                        minutes += 60;
                        hours--;
                    }
                    if (hours > 0) text = text + hours + `hour(s)`;
                    if (text.includes('hour')) text = text + ` and `;
                    text = text + minutes + ` minutes.`;
                    message.channel.send(text);
                } else {
                    text = `Next boss is ${boss} and will spawn in `;
                    hours = 23 - parseInt(date.getHours());
                    minutes = 60 - parseInt(date.getMinutes());
                    hours = parseInt(hours) + parseInt(hour);
                    minutes = parseInt(minutes) + parseInt(minute);
                    if (minutes > 60) {
                        minutes = parseInt(minutes) - 60;
                        hours = parseInt(hours) + 1;
                    }
                    if (hours > 0) text = text + hours + `hour(s)`;
                    if (text.includes('hour')) text = text + ` and `;
                    text = text + minutes + ` minutes.`;
                    message.channel.send(text);
                }
            })
            .catch(error => {
                console.error('Search failed:', error)
            });
        return 0;
    }
}