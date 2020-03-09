module.exports = {
    name: 'uptime',
    description: `Displays the amount of time the bot has been running for`,
    usage: `uptime`,
    help: `-`,
    async execute(bot, message, args){
        let beginning = bot.startupTime;
        let now = new Date();
        let diff = now - beginning;
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        let minutes = Math.floor(diff % (1000 * 60 * 60) / (1000*60));
        message.channel.send(`Bot has been online for ${days > 0 ? days+' day(s), ' : ''}${hours > 0 ? hours+' hour(s) and ' : ''}${minutes} minutes.`);
    }
}