module.exports = {
    name: 'getservermembers',
    description: 'Get list of members of a server',
    async execute(bot, message, args){
        let guildID = args[0];
        let guild = bot.guilds.cache.get(guildID);
        //console.log(guild);
        const memberIDs = guild.members.keys();
        console.log(memberIDs);
        let counter = 0;
        let messageToSend = ``;
        for (let memberID of memberIDs){
            counter++;
            let onemember = guild.members.get(memberID);
            messageToSend += `**ID:** ${onemember.user.id}, **Username:** ${onemember.user.username}, **Nickname:** ${onemember.nickname}\n`;
            if (counter == 25){
                counter = 0;
                await message.channel.send(messageToSend);
                messageToSend = ``;
            }
        }
        message.channel.send(messageToSend);
        console.log(counter);
        //let onememberid = memberIDs.next().value;
        //console.log(guild.members.get(onememberid));
        message.channel.send("List complete!");
        return 0;
    }
}