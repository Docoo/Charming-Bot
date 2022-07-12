module.exports = {
    name: 'bdodisablenotifications',
    description: `Disable boss notifications on the server.`,
    usage: `bdodisablenotifications`,
    help: ``,
    async execute(bot, message, args){
        bot.guildList.forEach(guild => {
            if (guild.guildID == message.guild.id){
                guild.bdochannelid = undefined;
                guild.bdomentionrole = undefined;
            }
        });
        //console.log(bot.guildList);
        json = JSON.stringify(bot.guildList).split(",").join(",\n");
        const fs = require('fs');
        fs.writeFileSync('./configs/guilds.json', json, 'utf8');
        rawdata = fs.readFileSync('./configs/guilds.json', 'utf8');
        bot.guildUpdate();
        message.channel.send("Boss notifications disabled successfully!");
    }
}