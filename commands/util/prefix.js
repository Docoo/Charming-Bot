module.exports = {
    name: 'prefix',
    description: `Get/set this server's prefix`,
    usage: `prefix [<prefix>]`,
    help: `**prefix** : optional - group of characters you wish to set as the server's prefix
            \tspaces not allowed! - if no prefix is given, command returns current prefix instead`,
    execute(bot, message, args){
        let thisGuild = undefined;
        fs = require('fs');
	    bot.guildList.forEach(guild => {if (guild.guildID == message.guild.id) thisGuild = guild; });
	    if (thisGuild == undefined){
            //
            bot.updateGuildList();
        }
        if (args[0] == undefined){
            //
            message.channel.send(`This server's custom prefix is "${thisGuild.prefix}"`);
            return 0;
        } else {
            //
            if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to change the prefix!");
            thisGuild.prefix = args[0];
            bot.updateGuildList();
            message.channel.send('Prefix changed successfully!');
            return 0;
        }
    }
}