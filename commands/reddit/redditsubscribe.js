module.exports = {
    name: 'redditsubscribe',
    description: 'Subscribes to a subbreddit\'s feed (posts will be posted in the channel the command is used in)',
    usage: `redditsubscribe <subreddit>`,
    help: `**subreddit** : name of the subreddit`,
    execute(bot, message, args){

        //.hasPermission('ADMINISTRATOR')
        if (!bot.adminOrMeCheck(message)) return message.reply("you are not allowed to use this command!");

        if (args[0] == undefined || args[0] == null || args[0] == "") return message.channel.send("No subreddit provided")
        if (args[0].startsWith("r/",0)) args[0] = args[0].slice(2);
        const subreddit = args[0].toLowerCase();

        if (bot.checkIfSubredditExists(subreddit)){
            //sub exists already
            //check if already subscribed
            const subchannel = bot.checkIfAlreadySubscribed(subreddit, message.guildId)
            if (subchannel != 0){
                return message.channel.send(`Your serever is already subscribed to posts from r/${subreddit} in the channel <#${subchannel}>`);
            } else {
                if (bot.addRedditWatch(subreddit, message.guildId, message.channelId)){
                    return message.channel.send(`Your have successfuly subscribed to r/${subreddit} and will receive notifications in <#${message.channelId}>`)
                } else {
                    return message.channel.send(`Bot has run into a funky error, please contact Charmie🌵#5423`)
                }
            }
        } else {
            //check if exists, add
            try {
                const request = require('sync-request');
                const url = `https://www.reddit.com/r/${subreddit}/new/.json?sort=new&raw_json=1`
                const getRequest = request('GET', encodeURI(url))
                const getRequestResponseUTF8 = getRequest.getBody('utf8')
                const jsonResponse = JSON.parse(getRequestResponseUTF8)
                if (jsonResponse.error == "404") return message.channel.send(`Unable to find r/${subreddit}. If you believe this to be an error, please contact Charmie🌵#5423`)
            } catch (error) {
                //if not found
                console.log(error)
                return message.channel.send(`Unable to find r/${subreddit}. If you believe this to be an error, please contact Charmie🌵#5423`)
            }
            //if found
            bot.addSubreddit(subreddit);
            if (bot.addRedditWatch(subreddit, message.guildId, message.channelId)){
                return message.channel.send(`Your have successfuly subscribed to r/${subreddit} and will receive notifications in <#${message.channelId}>`)
            } else {
                return message.channel.send(`Bot has run into a funky error, please contact Charmie🌵#5423`)
            }
        }

        //https://www.reddit.com/r/aredditthatdefinitelydoesntexistffsdoco/new/.json?sort=new&raw_json=1
        //{"message": "Not Found", "error": 404}
    }
}
