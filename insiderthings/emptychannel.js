
module.exports = {
    name: 'emptychannel',
    description: 'deletes all non-pinned messages in channel',
    usage: `emptychannel(bot, guildID, channelID)`,
    help: `may god help you`,
    async execute(bot, guildID, channelID){
        const channel = bot.guilds.cache.get(guildID).channels.cache.get(channelID);
        let notPinned = {};
        notPinned.size = 5;
        while (notPinned.size > 0 || firstLoop){
            firstLoop = false;
            let fetchedMessages = await channel.fetchMessages({ limit: 100 });
            notPinned = fetchedMessages.filter(fetchedMsg => !fetchedMsg.pinned);
            await channel.bulkDelete(notPinned, true).catch(error => {
                if (error.name == 'DiscordAPIError' && error.code == 50034)
                    console.log("Cannot delete messages older than 14 days! (for now)");
                else {
                    console.log(error);
                }
            });
            await bot.wait(1000);
        }
    }
}