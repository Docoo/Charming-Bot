module.exports = {
    name: 'hardreset',
    description: 'Reset bot entirely',
    async execute(bot, message, args){
        let restarted = {};
        restarted.restart = true;
        restarted.guild = message.channel.guild.id;
        restarted.channel = message.channel.id;
        const fs = require('fs');
        let json = JSON.stringify(restarted, null, 4);
        fs.writeFileSync('./restart.json', json, 'utf8');
        await message.channel.send('Good night!');
        process.exit(0);
    }
}