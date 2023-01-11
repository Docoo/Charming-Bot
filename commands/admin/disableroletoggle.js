module.exports = {
    name: 'disableroletoggle',
    description: `Disables role toggling on a specified message.`,
    usage: `disableroletoggle <messageid>`,
    help: `**messageid** : the ID of the message you want to remove the toggle from
            \tyou can obtain this by right-clicking on a message and selecting the "Copy ID" option`,
    async execute(bot, message, args){
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");
        if (args[0] == undefined) return message.channel.send("No message id specified!");

        let thisGuild = undefined;
        for (const botguild of bot.guildList) {
            if (botguild.guildID == message.guild.id) thisGuild = botguild;
        }
        if (thisGuild == undefined) return message.channel.send("This server is not in the database yet!");

        if (thisGuild.roleToggles.includes(args[0])){
            thisGuild.roleToggles.splice(thisGuild.roleToggles.indexOf(args[0]),1);
            bot.guildUpdate();
            return message.channel.send("Success!");
        } else return message.channel.send("This message is not set as a toggle!");

    }
}