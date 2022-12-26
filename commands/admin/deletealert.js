module.exports = {
    name: 'deletealert',
    description: `Removes a repeating alert from this channel, if it exists`,
    usage: `deletealert`,
    help: `?`,
    async execute(bot, message, args){
        if (!bot.existsChannelAlert(message.guildId, message.channelId)) return message.channel.send('There is no alert in this channel!')
        bot.removeAlert(message.guildId, message.channelId)
        return message.channel.send('Alert removed!')
    }
}