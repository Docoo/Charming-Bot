module.exports = {
    name: 'bnsmaintenance',
    description: 'Toggles BnS server status notifications',
    usage: `bnsmaintenance`,
    help: `Using it again in the same channel will disable notifications. Using in a different channel changes where you receive messages.`,
    execute(bot, message, args){

        //.hasPermission('ADMINISTRATOR')
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");

        let thisGuild = undefined;
        bot.guildList.forEach(botguild => {
            if (botguild.guildID == message.guildId) thisGuild = botguild;
        });
        if (thisGuild.bnsMaintenanceChannel != message.channelId) {
            thisGuild.bnsMaintenanceChannel = message.channelId
            message.channel.send("BnS server status changes will be posted here")
        } else {
            thisGuild.bnsMaintenanceChannel = null
            message.channel.send("BnS server status changes disabled")
        }
        bot.updateGuildList()

        return 0;
    }
}
