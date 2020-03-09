module.exports = {
    name: 'reloadcommands',
    description: 'Reloads commands.',
    async execute(bot, message, args){
        try{
            bot.reloadCommands();
            message.channel.send("Reload complete!");
            bot.oldCommands = undefined;
            bot.oldInsiderCommands = undefined;
            return 0;
        } catch (error) {
            console.log(error);
            message.channel.send("Error while reloading!");
            bot.commands = bot.oldCommands;
            bot.insidercommands = bot.oldInsiderCommands;
            return 1;
        }
    }
}