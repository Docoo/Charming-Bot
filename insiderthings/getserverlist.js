module.exports = {
    name: 'getserverlist',
    description: 'Get list of servers the bot is in',
    async execute(bot, message, args){
        let messageToSend = ``;
        let counter = 0;
        for (let guildEntry of bot.guilds){
            //console.log(guild);
            let guild = guildEntry[1];
            //let owner = guild.members.get(guild.ownerID);
            messageToSend += `**GuildID**: ${guild.id}, **Name**: ${guild.name}, **Owner**: ${guild.owner.user.username}#${guild.owner.user.discriminator}\n`;
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