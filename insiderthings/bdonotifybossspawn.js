module.exports = {
    name: 'bdonotifybossspawn',
    description: `Notifies all guilds who have the option enabled`,
    async execute(bot, message, args){
        const Discord = require('discord.js');

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
                    console.log("case 1");
                    text = `${boss} will spawn in `;
                    hours = hour - date.getHours();
                    minutes = minute - date.getMinutes();
                    console.log("minutes pre:" + minutes);
                    if (minutes < 0){
                        minutes += 60;
                        hours--;
                    }
                    console.log("minutes post:" + minutes);
                    if (hours > 0) text = text + hours + `hour(s)`;
                    console.log("hours: " + hours);
                    if (text.includes('hour')) text = text + ` and `;
                    text = text + minutes + ` minute(s).`;
                    
                    bot.guildList.forEach(guild2 => {
                        if (guild2.bdochannelid == undefined) {}
                        else {
                            guild = bot.guilds.cache.find(element => element.id == guild2.guildID);
                            channel = guild.channels.find(element => element.id == guild2.bdochannelid);
                            channel.send(guild2.bdomentionrole + text);
                        }
                    });

                } else {
                    console.log("case 2");
                    text = `${boss} will spawn in `;
                    hours = 23 - parseInt(date.getHours());
                    minutes = 60 - parseInt(date.getMinutes());
                    hours = parseInt(hours) + parseInt(hour);
                    minutes = parseInt(minutes) + parseInt(minute);
                    if (minutes > 60) {
                        minutes = parseInt(minutes) - 60;
                        hours = parseInt(hours) + 1;
                    }
                    if (hours > 0) text = text + hours + `hour(s)`;
                    console.log("hours: " + hours);
                    if (text.includes('hour')) text = text + ` and `;
                    text = text + minutes + ` minute(s).`;
                    console.log("minutes:" + minutes);
                    bot.guildList.forEach(guild2 => {
                        if (guild2.bdochannelid == undefined) {}
                        else {
                            guild = bot.guilds.cache.find(element => element.id == guild2.guildID);
                            channel = guild.channels.find(element => element.id == guild2.bdochannelid);
                            channel.send(guild2.bdomentionrole + text);
                        }
                    });

                }
            })
            .catch(error => {
                console.error('Search failed:', error)
            });
        return 0;
    }
}