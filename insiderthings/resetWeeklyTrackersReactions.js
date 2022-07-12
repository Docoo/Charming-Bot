module.exports = {
    name: "resetweeklytrackersreactions",
    description: "Resets the buttons of weekly trackers because i've fucked them somehow",
    usage: `resetweeklytrackersreactions`,
    help: `-`,
    execute(bot,arg1,arg2){
        const Discord = require("Discord.js");
        for (let aWeeklyTracker of bot.weeklyTrackers){
            const aWeeklyTrackerCopy = JSON.parse(JSON.stringify(aWeeklyTracker));
            guild = bot.guilds.cache.get(aWeeklyTrackerCopy.guildID);
            channel = guild.channels.cache.get(aWeeklyTrackerCopy.channelID);
            channel.messages.fetch(aWeeklyTrackerCopy.messageID)
                .then((message) => {
                    message.reactions.removeAll().then((message2) => {
                        bot.reactWeeklyTracker(message2);
                    })
                    .catch(async error => {
                        console.log(`Error reacting to tracker with ID ${aWeeklyTrackerCopy.messageID} for reaction button resetting!`);
                        console.log(error);
                    })
                })
                .catch(async error => {
                    console.log(`Error fetching weekly tracker with ID ${aWeeklyTrackerCopy.messageID} for reaction button resetting!`);
                    console.log(error);
                });
        }
        bot.updateWeeklyTrackers();
    }
}