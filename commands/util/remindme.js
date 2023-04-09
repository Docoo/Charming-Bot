module.exports = {
    name: 'remindme',
    description: `Sends a one time message after specified time`,
    usage: `remindme <hours> <minutes> <message>`,
    help: `max 24 hours and 59 minutes`,
    async execute(bot, message, args){
        const hourString = args.shift()
        const hourInt = hourString/1
        if (hourInt == NaN || hourInt < 0 || intervalInt > 24) return message.channel.send('Invalid hours! Must be between 0 and 24.')
        const minuteString = args.shift()
        const minuteInt = minuteString/1
        if (minuteInt == NaN || minuteInt < 0 || minuteInt > 59) return message.channel.send('Invalid minutes! Must be between 0 and 59.')
        const textMessage = bot.sum(args)
        if (textMessage == '' || textMessage == ' ') return message.channel.send('Cannot set an empty message!')
        if (bot.existsChannelAlert(message.guildId, message.channelId)) return message.channel.send('There already exists an alert/reminder in this channel! Use "deletealert" to remove it.')
        // console.log(`${message.guildId} ${message.channelId}`)
        bot.createAlert(message.guildId, message.channelId, textMessage, hourInt, minuteInt, false)
        return message.channel.send('Reminder created!')
    }
}