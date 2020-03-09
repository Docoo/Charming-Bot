module.exports = {
    name: 'disableroletoggle',
    description: `Disables role toggling on a specified message.`,
    usage: `disableroletoggle <messageid>`,
    help: `**messageid** : the ID of the message you want to remove the toggle from
            \tyou can obtain this by right-clicking on a message and selecting the "Copy ID" option`,
    async execute(bot, message, args){
        if ((!message.member.hasPermission('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        if (args[0] == undefined) return message.channel.send("No message id specified!");

        let thisGuild = undefined;
        for (index in bot.guildList) {
            botguild = bot.guildList[index];
            if (botguild.guildID == message.guild.id) thisGuild = botguild;
        }
        if (thisGuild == undefined) return message.channel.send("This server is not in the database yet!");
        
        message.guild.channels.forEach(channel => {
            if (channel.type == "text"){
                channel.fetchMessage(args[0])
                    .then(fetchedMessage => {
                        let found = false;
                        for (index in thisGuild.roleWatches) {
                            watch = thisGuild.roleWatches[index];
                            if (watch.msgID == args[0]) found = true;
                        }
                        if (found) {
                            if (thisGuild.roleToggles == undefined)
                                thisGuild.roleToggles = [];
                            if (index = thisGuild.roleToggles.indexOf(args[0]) > -1){
                                thisGuild.roleToggles.splice(index,1);
                                bot.guildUpdate();
                                return message.channel.send("Success!");
                            } else return message.channel.send("This message is not set as a toggle!");
                        }
                    })
                    .catch(error => {});
            }
        });

    }
}