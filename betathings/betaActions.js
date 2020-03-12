module.exports.setStuff = setStuff;

async function setStuff(bot){

    bot.onReadyFunction = async function (evt) {
        console.log('Connected');
        console.log('Logged in as: ');
        console.log(bot.user.username + ' - (' + bot.user.id + ')');
        bot.user.setActivity('a New Start', { type: 'PLAYING' });
        //bot.user.setAvatar('./assets/bot_profile_pics/Hoodie-Neko.jpg');
    }

    bot.onMessageFunction = async function (message) {
        if (message.author.id === bot.user.id) return;
        if (message.content.startsWith("cbb ")) {
            let rawCommand = message.content;
            rawCommand = rawCommand.split(" ");
            rawCommand.shift();
            let command = rawCommand.shift();
            console.log("Processing " + command + " with arguments " + rawCommand);
            if (bot.commands.has(command)){
                bot.commands.get(command).execute(bot, message, rawCommand);
            } else {
                return message.reply("i saw your message!");
            }
        }
        //"169525036305219585" - OG id
    }

    bot.onMessageReactionAddFunction = async function (reaction, user) {
        console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
    }

    bot.onMessageReactionRemoveFunction = async function (reaction, user) {
        console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);
    }

    bot.onGuildCreateFunction = async function (guild) {
        console.log("Joined a new guild: " + guild.name);
    }

    bot.onGuildDeleteFunction = async function (guild) {
        console.log("Left a guild: " + guild.name);
    }
}