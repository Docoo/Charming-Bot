module.exports = {
    name: 'getserverlist',
    description: 'Get list of servers the bot is in',
    async execute(bot, message, args){
        let messageToSend = ``;
        let counter = 0;
        for (let guildEntry of bot.guilds.cache){
            //console.log(guild);
            let guild = guildEntry[1];
            //let owner = guild.members.get(guild.ownerID);
            const owner = guild.members.resolve(guild.ownerId)==null?{a: "value", user: bot.users.resolve(guild.ownerId)}:guild.members.resolve(guild.ownerId)
            messageToSend += `**GuildID**: ${guild.id}, **Name**: ${guild.name}, **Owner**: ${owner==null?guild.ownerId:owner.user.tag}\n`;
            counter++;
            if (counter == 25){
                message.channel.send(messageToSend);
                messageToSend = ``;
                counter = 0;
            }
        }
        message.channel.send(messageToSend);
        return 0;
    }
}