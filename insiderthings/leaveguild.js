module.exports = {
    name: 'leaveguild',
    description: 'leaves a server',
    async execute(bot, message, args){
        let guildID = args[0];
        let guild = bot.guilds.cache.get(guildID);
        message.channel.send(`Leaving guild **${guild.name}** of owner **${guild.owner.user.username}** with id **${guild.id}**!`);
        guild.leave();
        var i = 0;
        size = bot.bnsrecruitments.length;
        while (i < size) {
            //console.log(i);
            let aRec = bot.bnsrecruitments[i];
            if (aRec.server_id == guildID){
                bot.bnsrecruitments.splice(i, 1);
                console.log(`Removed recruitment with ID ${aRec.message_id} for being in the left server. (#${i})`);
                i--;
                size--;
            }
            i++;
        }
        bot.updateBnsRecruitments();
        return 0;
    }
}