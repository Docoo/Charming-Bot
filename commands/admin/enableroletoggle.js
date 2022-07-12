module.exports = {
    name: 'enableroletoggle',
    description: `Enables role toggling for a specified mesage.`,
    usage: `enableroletoggle <messageid>`,
    help: `**messageid** : the ID of the message you want to enable the toggle on
            \tyou can obtain this by right-clicking on a message and selecting the "Copy ID" option`,
    async execute(bot, message, args){
        if ((!message.member.permissions.has('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        if (args[0] == undefined) return message.channel.send("No message id specified!");

        let thisGuild = undefined;
        for (index in bot.guildList) {
            botguild = bot.guildList[index];
            if (botguild.guildID == message.guildId) thisGuild = botguild;
        }
        if (thisGuild == undefined) return message.channel.send("This server is not in the database yet!");
        
        message.guild.channels.cache.forEach(channel => {
            if (channel.type == "GUILD_TEXT"){
                channel.messages.fetch(args[0])
                    .then(fetchedMessage => {
                        let found = false;
                        for (index in thisGuild.roleWatches) {
                            watch = thisGuild.roleWatches[index];
                            if (watch.msgID == args[0]) found = true;
                        }
                        if (found) {
                            if (thisGuild.roleToggles == undefined)
                                thisGuild.roleToggles = [];
                            thisGuild.roleToggles.push(args[0]);
                            bot.guildUpdate();
                            return message.channel.send("Success!");
                        }
                    })
                    .catch(error => {});
            }
        });

    }
}