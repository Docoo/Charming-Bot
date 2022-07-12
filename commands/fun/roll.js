module.exports = {
    name: 'roll',
    description: 'Roll the dice!',
    usage: `roll <value>`,
    help: `**user** : positive integer, max 35565 (if you need more you have issues)`,
    execute(bot,message,args){
        if (args[0]<1 || args[0]>35565 || isNaN(args[0])) return message.reply("Invalid value");
        if (args[0] == 1) return message.reply("Stop trolling");
        const value = Math.random()*args[0]+1;
        const Discord = require('discord.js');
        message.reply(`You rolled ${value.toFixed(0)}`);
        return 0;
    }
}
