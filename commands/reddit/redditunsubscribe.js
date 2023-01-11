module.exports = {
    name: 'redditunsubscribe',
    description: 'Unsubscribes to a subbreddit\'s feed.',
    usage: `redditunsubscribe <subreddit>`,
    help: `**subreddit** : name of the subreddit`,
    execute(bot, message, args){

        //.hasPermission('ADMINISTRATOR')
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");
        
        if (args[0] == undefined || args[0] == null || args[0] == "") return message.channel.send("No subreddit provided")
        if (args[0].startsWith("r/",0)) args[0] = args[0].slice(2);
        const subreddit = args[0].toLowerCase();
        
        //check if bot knows sub
        if (bot.checkIfSubredditExists(subreddit)){
            //check if actually subbed
            const channelId = bot.checkIfAlreadySubscribed(subreddit, message.guildId);
            if (channelId == 0) {
                //not subbed
                return message.channel.send(`It would appear you are not subscribed to r/${subreddit}`);
            } else {
                //time to unsub
                bot.removeRedditWatch(subreddit, message.guildId);
                return message.channel.send(`Successfuly unsubscribed from r/${subreddit}`);
            }
        } else {
            //not in database, noone ever subbed to it
            message.channel.send(`r/${subreddit} was not found in database, it is unlikely that you are subscribed...`)
        }
    }
}
