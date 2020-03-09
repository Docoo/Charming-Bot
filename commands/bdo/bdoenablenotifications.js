module.exports = {
    name: 'bdoenablenotifications',
    description: `Enable boss notifications on the current channel.`,
    usage: `bdoenablenotifications [<role>]`,
    help: `**role** : optional - used to tag people. can be the name of the role or a role mention`,
    async execute(bot, message, args){
        let role = "";
        const fs = require('fs');
        if (args[0] == undefined) {}
        else {
            role = args[0];
            if (!role.includes("@")) role = message.guild.roles.find(role => role.name == args[0]);
        }
        let ok = false;
        bot.guildList.forEach(guild => {
            if (guild.guildID == message.guild.id){
                guild.bdochannelid = "" + message.channel.id;
                guild.bdomentionrole = "" + role;
                ok = true;
            }
        });
        if (!ok){
            bot.guildList.push({guildID: `${message.guild.id}`, prefix : `cactus `});
            json = JSON.stringify(bot.guildList).split(",").join(",\n");
		    fs.writeFileSync('./guilds.json', json, 'utf8');
        bot.guildList = JSON.parse(fs.readFileSync('./guilds.json'));
            if (guild.guildID == message.guild.id){
                guild.bdochannelid = "" + message.channel.id;
                guild.bdomentionrole = "" + role;
                ok = true;
            }

        }
        //console.log(bot.guildList);
        json = JSON.stringify(bot.guildList).split(",").join(",\n");
        fs.writeFileSync('./guilds.json', json, 'utf8');
        rawdata = fs.readFileSync('./guilds.json', 'utf8');
        bot.guildUpdate();
        message.channel.send("Boss notifications enabled successfully!");
    }
}