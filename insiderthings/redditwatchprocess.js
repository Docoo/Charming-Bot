module.exports = {
    name: 'redditwatchprocess',
    description: 'Processes reddit watches',
    usage: `you shouldn't be able to use this, so don't`,
    help: `may god help you if you got here, i can't`,
    execute(bot, nothing1, nothing2){
        const request = require('sync-request')
                
        for (const redditWatch of bot.redditWatchList){
            //check if new post for each subreddit
            try {
                const url = `https://www.reddit.com/r/${redditWatch.subreddit}/new/.json?sort=new&raw_json=1`
                const getRequest = request('GET', encodeURI(url))
                const getRequestResponseUTF8 = getRequest.getBody('utf8')
                const jsonResponse = JSON.parse(getRequestResponseUTF8)
                const postList = jsonResponse.data.children;

                //v1 - last post id based (fucked when 1 post gets deleted)
                // if (redditWatch.lastPosted == 0){
                //     //post only last
                //     const lastpost = postList[0].data
                //     redditWatch.lastPosted = lastpost.id
                //     const embedToSend = makeEmbedFromPost(lastpost)
                //     for (const watch of redditWatch.watches){
                //         const server = bot.guilds.resolve(watch.serverID)
                //         const channel = server.channels.resolve(watch.channelID)
                //         if (lastpost.post_hint == "image") channel.send({ embeds: [embedToSend] });
                //     }
                // } else {
                    //start counting how many to post
                    // let count = 0;
                    // let counting = true;
                    // for (const post of postList){
                    //     if (post.data.id != redditWatch.lastPosted){
                    //         if (counting) count++;
                    //     } else {
                    //         counting = false;
                    //     }
                    // }
                    // //post them after
                    // while (count > 0){
                    //     count--
                    //     const lastpost = postList[count].data
                    //     if (count == 0) redditWatch.lastPosted = lastpost.id
                    //     const embedToSend = makeEmbedFromPost(lastpost)
                    //     for (const watch of redditWatch.watches){
                    //         const server = bot.guilds.resolve(watch.serverID)
                    //         const channel = server.channels.resolve(watch.channelID)
                    //         if (lastpost.post_hint == "image") channel.send({ embeds: [embedToSend] });
                    //     }
                    // }
                // }

                //v2 - list based (keeps last 50 ids)
                if (redditWatch.lastPosted.length == 0){
                    //first parse, takes all ids but only sends newest post
                    count = 25
                    while (count > 0){
                        count--
                        const lastpost = postList[count].data
                        if (redditWatch.lastPosted.indexOf(lastpost.id) == -1){
                            redditWatch.lastPosted.push(lastpost.id)
                            if (redditWatch.lastPosted.length > 50) redditWatch.lastPosted.shift()
                            const embedToSend = makeEmbedFromPost(lastpost)
                            for (const watch of redditWatch.watches){
                                const server = bot.guilds.resolve(watch.serverID)
                                const channel = server.channels.resolve(watch.channelID)
                                if (lastpost.post_hint == "image" && count == 0) channel.send({ embeds: [embedToSend] });
                            }
                        }
                    }
                } else {
                    //sends everything new
                    count = 25
                    while (count > 0){
                        count--
                        const lastpost = postList[count].data
                        if (redditWatch.lastPosted.indexOf(lastpost.id) == -1){
                            redditWatch.lastPosted.push(lastpost.id)
                            if (redditWatch.lastPosted.length > 50) redditWatch.lastPosted.shift()
                            const embedToSend = makeEmbedFromPost(lastpost)
                            for (const watch of redditWatch.watches){
                                const server = bot.guilds.resolve(watch.serverID)
                                const channel = server.channels.resolve(watch.channelID)
                                if (lastpost.post_hint == "image") channel.send({ embeds: [embedToSend] });
                            }
                        }
                    }
                }
            } catch (error) {
                console.log(`Ran into problems checking for new posts on r/${redditWatch.subreddit}`)
                console.log(error)
            }
        }
        bot.updateAllReditWatches();
    }
}

function makeEmbedFromPost(post){
    const Discord = require('discord.js')
    return new Discord.EmbedBuilder().setTitle(post.title).setDescription(post.subreddit_name_prefixed).setImage(post.url).setURL(`https://www.reddit.com${post.permalink}`)
}
