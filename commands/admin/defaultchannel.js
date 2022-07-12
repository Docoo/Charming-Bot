module.exports = {
    name: 'defaultchannel',
    description: `Sets the current channel as default for alerts.`,
    usage: `defaultchannel`,
    help: `If this command is used in the default channel, alerts will be disabled.`,
    async execute(bot, message, args){
        //.hasPermission('ADMINISTRATOR')
        if ((!message.member.permissions.has('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        for (let thisGuild of bot.guildList){
            if (thisGuild.guildID == message.channel.guild.id){
                if (thisGuild.defaultChannel == message.channel.id){
                    thisGuild.defaultChannel = undefined;
                    thisGuild.autoQuizUpdate = false;
                    bot.updateGuildList();
                    message.channel.send('Successfully disabled alerts!');
                } else {
                    thisGuild.defaultChannel = message.channel.id;
                    bot.updateGuildList();
                    message.channel.send('Alerts are now enabled on this channel!');
                }
            }
        }
    }
}