module.exports = {
    name: 'createalert',
    description: `Create a repeating alert to remind you something`,
    usage: `createalert <interval> <message>`,
    help: `interval has to be in hours, max 168 (a full week)`,
    async execute(bot, message, args){
        const intervalString = args.shift()
        const intervalInt = intervalString/1
        if (intervalInt == NaN || intervalInt < 1 || intervalInt > 168) return message.channel.send('Invalid interval!')
        const textMessage = bot.sum(args)
        if (textMessage == '' || textMessage == ' ') return message.channel.send('Cannot set an empty message!')
        if (bot.existsChannelAlert(message.guildId, message.channelId)) return message.channel.send('There already exists an alert in this channel! Use "deletealert" to remove it.')
        // console.log(`${message.guildId} ${message.channelId}`)
        bot.createAlert(message.guildId, message.channelId, textMessage, intervalInt, 0, true)
        return message.channel.send('Alert created!')
    }
}