module.exports = {
    name: 'leaveguild',
    description: 'leaves a server',
    async execute(bot, message, args){
        let guildID = args[0];
        let guild = bot.guilds.get(guildID);
        message.channel.send(`Leaving guild **${guild.name}** of owner **${guild.owner.user.username}** with id **${guild.id}**!`);
        guild.leave();
        return 0;
    }
}