module.exports = {
    name: 'emote',
    description: 'Searches for an emote and posts it.',
    usage: `emote <name>`,
    help: `**name** : the name of the emote you wish to make the bot use`,
    execute(bot, message, args){
        message.channel.send(`${bot.emojis.cache.find(emoji => emoji.name.toLowerCase() == args[0].toLowerCase())}`);
    }
}