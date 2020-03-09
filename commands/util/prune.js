module.exports = {
    name: 'deletedis',
    description: 'deletes messages in bulk (maximum 100)',
    usage: `deletedis <number>`,
    help: `**number** : must be between 2 and 100`,
    execute(bot, message, args){
        const amount = parseInt(args[0]);
        if ((!message.member.hasPermission('ADMINISTRATOR')) && (message.author.id != '169525036305219585')){
            return message.reply("you are not allowed to use this command!");
        };
        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        } else if (amount < 2 || amount > 100) {
            return message.reply('you need to input a number between 2 and 100.');
        }

        message.channel.bulkDelete(amount).catch(error => {
            if (error.name == 'DiscordAPIError' && error.code == 50034)
                return message.channel.send("Cannot delete messages older than 14 days! (for now)");
        });
    }
}
