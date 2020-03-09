module.exports = {
    name: "togglewhitelist",
    description: 'Toggles user whitelist on/off.',
    execute(bot, message, args){
        if (bot.whitelistmode){
            bot.whitelistmode = false;
            return message.channel.send('Whitelist mode is now off!');
        } else {
            bot.whitelistmode = true;
            return message.channel.send('Whitelist mode is now on!');
        }
    }
}