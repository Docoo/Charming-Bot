module.exports = {
    name: 'redditsubscriptions',
    description: 'Lists all the subreddits this server is subscribed to',
    usage: `redditsubscriptions`,
    help: `really how can i explain it better smh`,
    execute(bot, message, args){

        //.hasPermission('ADMINISTRATOR')
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");

        let subscriptionList = ""

        for (const redditWatch of bot.redditWatchList){
            for (const serverEntry of redditWatch.watches){
                if (serverEntry.serverID == message.guildId){
                    subscriptionList += `**r/${redditWatch.subreddit}** in <#${serverEntry.channelID}>\n`
                }
            }
        }

        const Discord = require("discord.js")
        const messageEmbed = new Discord.EmbedBuilder().setTitle("List of reddit subscriptions").addFields([{ name: `**Subreddit - Channel**`, value: subscriptionList}])
        return message.channel.send({embeds: [messageEmbed]})
    }
}
