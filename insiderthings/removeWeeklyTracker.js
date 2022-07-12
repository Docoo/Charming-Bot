module.exports = {
    name: "removeweeklytracker",
    description: "Removes a tracker",
    usage: `removeweeklytracker <messageID>`,
    help: `messageID - the ID of the discord message that represents the tracker`,
    execute(bot,message,args){
        const Discord = require("Discord.js");

        let myWeeklyTracker;
        for (aWeeklyTracker of bot.weeklyTrackers){
            if (aWeeklyTracker.messageID == args[0]) myWeeklyTracker = aWeeklyTracker;
        }
        guild = bot.guilds.cache.get(myWeeklyTracker.guildID);
        channel = guild.channels.cache.get(myWeeklyTracker.channelID);
        channel.messages.fetch(myWeeklyTracker.messageID).then(message => {
            message.edit("Weekly tracker closed for " + myWeeklyTracker.name);
            message.reactions.removeAll();
        }).catch((reason) => {console.log(`Error changing message with ID ${myWeeklyTracker.messageID}!`); console.log(reason)})
        bot.weeklyTrackers.splice(bot.weeklyTrackers.indexOf(myWeeklyTracker),1);
        bot.updateWeeklyTrackers();

        message.channel.send(`Tracker with id ${args[0]} closed.`);
    }
}