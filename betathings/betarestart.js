module.exports = {
    name: "betarestart",
    description: "Restart the bot",
    usage: `betarestart`,
    help: `-`,
    execute(bot,message,args){

        if (message != undefined){
            if (message.author.id != "169525036305219585"){
                return message.reply("sorry, you are too big of a pleb to do that!");
            }
        }

        try{
            delete require.cache[require.resolve('./betainit.js')];
        } catch (err) {}
        let init = require('./betainit.js');
        init.initBot(bot, message);

        try{
            delete require.cache[require.resolve('./betaActions.js')];
        } catch (err) {}
        let actions = require('./betaActions.js');
        actions.setStuff(bot);

        return 0;
    }
}