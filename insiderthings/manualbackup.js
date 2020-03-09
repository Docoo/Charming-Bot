module.exports = {
    name: 'manualbackup',
    description: 'Do a backup of a file',
    async execute(bot, message, args){
        if (args[0] != undefined)
            bot.backup_file(args[0]);
        return message.channel.send("Backup complete!");
    }
}