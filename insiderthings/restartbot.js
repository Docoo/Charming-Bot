module.exports = {
    name: "restartbot",
    description: "Restart the bot",
    usage: `restartbot`,
    help: `-`,
    execute(bot,message,args){
        try{
            delete require.cache[require.resolve('./../init.js')];
        } catch (err) {}
        let init = require('./../init.js');
        return init.initBot(bot, message);
    }
}