module.exports = {
    name: 'waifugamereminder',
    description: `Detect waifu game drops and remind you 3 hours later`,
    usage: `waifugamereminder <message>`,
    help: `Bot will send the input message 3 hours after a successful drop. Use this command again to disable it.`,
    async execute(bot, message, args){
        var waifuDropMessage = bot.sum(args)
        if (waifuDropMessage == '' || waifuDropMessage == ' ' || waifuDropMessage == undefined) waifuDropMessage = "Time for a new drop!"
        const myGuild = bot.getGuildById(message.guild.id)
        if (myGuild.waifuGameReminder){
            myGuild.waifuGameReminder = false
            myGuild.waifuGameReminderMessage = undefined
            bot.updateGuildList()
            return message.channel.send('Waifu drop reminders disabled.')
        } else {
            myGuild.waifuGameReminder = true
            myGuild.waifuGameReminderMessage = waifuDropMessage
            bot.updateGuildList()
            return message.channel.send('Waifu drop reminders enabled.')
        }
    }
}