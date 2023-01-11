module.exports = {
    name: 'enableroletoggle',
    description: `Enables role toggling for a specified mesage.`,
    usage: `enableroletoggle <messageid>`,
    help: `**messageid** : the ID of the message you want to enable the toggle on
            \tyou can obtain this by right-clicking on a message and selecting the "Copy ID" option`,
    async execute(bot, message, args){
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");
        if (args[0] == undefined) return message.channel.send("No message id specified!");

        let thisGuild = undefined;
        for (const botguild of bot.guildList) {
            if (botguild.guildID == message.guild.id) thisGuild = botguild;
        }
        if (thisGuild == undefined) return message.channel.send("This server is not in the database yet!");
        

        let found = false;
        for (const watch of thisGuild.roleWatches) {
            if (watch.msgID == args[0]) found = true
        }
        if (found) {
            if (thisGuild.roleToggles == undefined)
                thisGuild.roleToggles = [];
            if (thisGuild.roleToggles.includes(args[0]))
                return message.channel.send("Message is already a toggle!")
            thisGuild.roleToggles.push(args[0]);
            bot.guildUpdate();
            return message.channel.send("Success!");
        } else return message.channel.send("There are no role reactions available on that message!")

    }
}