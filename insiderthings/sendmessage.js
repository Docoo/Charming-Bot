module.exports = {
    name: 'sendmessage',
    description: 'Sends a message to a server\'s default channel',
    async execute(bot, message, args){
        let sendall = false;
        let target = args.shift();
        let msgToSend = sum(args);
        let thisGuild = undefined;
        if (target == "all") {
            sendall = true
        } else {
            for (index in bot.guildList){
                thisGuild = bot.guildList[index];
                if (thisGuild.guildID == target) break;
            }
        }
        if (sendall) {
            //send to all guilds
            for (let thisGuild of bot.guildList){
                if (thisGuild.defaultChannel == undefined){
                    //skip
                } else {
                    guild = bot.guilds.cache.get(thisGuild.guildID);
                    channel = guild.channels.resolve(thisGuild.defaultChannel);
                    //console.log(channel);
                    channel.send(msgToSend + '\n\n_This is a broadcast. You have received this because you have set the current channel as the default channel for alerts. If you no longer wish to receive alerts, use the \"defaultchannel\" command._');
                }
            }
            message.channel.send('Broadcast successful!');
            return 0;
        } else {
            //send to thisGuild
            //console.log(bot.guilds.cache.get(thisGuild.guildID));
            console.log(msgToSend);
            let guildToSendTo = bot.guilds.cache.get(thisGuild.guildID);
            if (thisGuild.defaultChannel == undefined){
                //send to text channel with position 0
                var iter = guildToSendTo.channels[Symbol.iterator]();
                for (let channelToSendTo of iter){
                    channelToSendTo = channelToSendTo[1];
                    //console.log(channelToSendTo);
                    if (channelToSendTo.type == 'text' && channelToSendTo.position == 0) {
                        channelToSendTo.send(msgToSend);
                        message.channel.send('Success!');
                    }
                }
            } else {
                //send to set default channel
                guildToSendTo.channels.cache.get(thisGuild.defaultChannel).send(msgToSend);
                message.channel.send('Success!');
            }
        }
        return 0;
    }
}

function sum(theArgs) {
    var i=0;
    var mystring = '';
    while (true){
        if (typeof theArgs[i] === "undefined") break;
        mystring += theArgs[i].toString() + " ";
        i++;
    }
    return mystring;
}