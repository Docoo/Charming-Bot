module.exports = {
    name: 'developer',
    description: 'Toggle developer mode on/off',
    usage: 'developer',
    help: '-',
    async execute(bot, message, args){
        if (bot.config.developer){
            bot.config.developer = false;
            message.channel.send("Developer mode is now off!");
            console.log("Developer mode disabled!");
        } else {
            bot.config.developer = true;
            message.channel.send("Developer mode is now on!");
            console.log("Developer mode enabled!");
        }
        const fs = require('fs');
        fs.writeFileSync('./configs/config.json', JSON.stringify(bot.config, null, 4), 'utf8');
    }
}