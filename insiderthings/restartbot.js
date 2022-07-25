module.exports = {
    name: "restartbot",
    description: "Restart the bot",
    usage: `restartbot`,
    help: `-`,
    async execute(bot,message,args){
        try{
            delete require.cache[require.resolve('./../init.js')];
        } catch (err) {}
        let init = require('./../init.js');
        bot.loggedIn = false;
        return await init.initBot(bot, message);
    }
}