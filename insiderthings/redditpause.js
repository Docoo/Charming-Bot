module.exports = {
    name: 'redditpause',
    description: 'Pauses/unpauses reddit updates.',
    async execute(bot, message, args){
        bot.config.redditpause = !(bot.config.redditpause)
        bot.updateConfig()
        redditstatus = bot.config.redditpause ? "paused" : "resumed"
        message.channel.send("Reddit updates " + redditstatus);
        return 0;
    }
}