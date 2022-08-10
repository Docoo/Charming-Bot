module.exports = {
    name: "resetweeklytrackers",
    description: "Resets all trackers",
    usage: `resetweeklytrackers`,
    help: `-`,
    execute(bot,arg1,arg2){
        const Discord = require(`discord.js`);
        for (let aWeeklyTracker of bot.weeklyTrackers){
            if (aWeeklyTracker.weeklies == false && aWeeklyTracker.bt == false && aWeeklyTracker.vt == false && aWeeklyTracker.tt == false && aWeeklyTracker.et == false){
                //inactivity
            }
            aWeeklyTracker.weeklies = false;
            aWeeklyTracker.bt = false;
            aWeeklyTracker.vt = false;
            aWeeklyTracker.tt = false;
            aWeeklyTracker.et = false;
            //bot.updateOneWeeklyTracker(aWeeklyTracker);
            const aWeeklyTrackerCopy = JSON.parse(JSON.stringify(aWeeklyTracker));
            guild = bot.guilds.resolve(aWeeklyTrackerCopy.guildID);
            channel = guild.channels.resolve(aWeeklyTrackerCopy.channelID);
            channel.messages.fetch(aWeeklyTrackerCopy.messageID)
                .then((message) => {
                    for (areaction of message.reactions.cache){
                        //console.dir(areaction[1])
                        areaction[1].users.remove(aWeeklyTrackerCopy.userID)
                    }
                    const Discord = require('discord.js');
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Weeklies for ${aWeeklyTrackerCopy.name}`)
                        .addField("**Progress:**",`${bot.getEmoteById("911415406550450269")}Weeklies: ${aWeeklyTrackerCopy.weeklies ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
                        ${bot.getEmoteById("911415406865039361")}BT: ${aWeeklyTrackerCopy.bt ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
                        ${bot.getEmoteById("911415407007649792")}VT/SK: ${aWeeklyTrackerCopy.vt ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
                        ${bot.getEmoteById("911415406986661898")}TT: ${aWeeklyTrackerCopy.tt ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}
                        ${bot.getEmoteById("911415407053778954")}ET: ${aWeeklyTrackerCopy.et ? bot.getEmoteById("911417771517165608") : bot.getEmoteById("911417514683158569")}`)
                        .setTimestamp(new Date(aWeeklyTrackerCopy.date));
                    message.edit({ embeds: [embed] });
                })
                .catch(async error => {
                    console.log(`Error resetting weekly tracker with ID ${aWeeklyTrackerCopy.messageID}!`);
                    console.log(error);
                });
        }
        bot.updateWeeklyTrackers();
    }
}