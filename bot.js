const fs = require('fs');
const Discord = require('discord.js');
//const bnssrcTrackIDs = JSON.parse(fs.readFileSync('./bnssrctrack.json', 'utf8'));
//const whitelistuserIDs = JSON.parse(fs.readFileSync('./user-whitelist.json', 'utf8'));
const songqueue = new Map();
var path = require('path')

//ext_file_list = recFindByExt('/mypath','ext')
var bot = new Discord.Client();
bot.loggedIn = false;
bot.config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
//console.log (bot.config.developer);
module.exports.bot = bot;
let restartBot = require('./insiderthings/restartbot.js');
restartBot.execute(bot, null, null);
if (!bot.loggedIn){
	bot.login(bot.config.token);
	bot.loggedIn = true;
}

//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//const insiderCommandFiles = fs.readdirSync('./insiderthings').filter(file => file.endsWith('.js'));

//read guild list
/*
fs.readFile('./guilds.json', 'utf8', function readFileCallback(err, data){
	if (err){
		console.log(err);
	} else {
		obj = JSON.parse(data); //now it an object
		//console.log(obj);
		bot.guildList = obj;
		//console.log('got here');
	}
});
*/

bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.user.username + ' - (' + bot.user.id + ')');
	//bot.user.setActivity('Carols', { type: 'PLAYING' });
	bot.queue.push(['updateguildlist', undefined, undefined]);
	//bot.user.setAvatar('./assets/bot_profile_pics/christmas.jpg');
	bot.reloadCommands();
	bot.loop();
});

bot.on('message', message => {
    // Our bot needs to know if it will execute a command
	// It will listen for messages that will start with `!`
	bot.guildList = JSON.parse(fs.readFileSync('./guilds.json','utf8'));
	let thisGuild = undefined;
	bot.guildList.forEach(guild => {if (message.guild != null) if (guild.guildID == message.guild.id) thisGuild = guild; });
	if (thisGuild == undefined){
		thisGuild = {"guildID" : "n", "prefix": "cactus "};
	}
	//console.log(thisGuild);
	if (message.author.id === bot.user.id) return;
	if (bot.userBlacklist.indexOf(message.author.id) != -1) return;
	if (!message.content.startsWith(thisGuild.prefix)) {
		//console.log(message.content.toLowerCase());
		if (message.content.toLowerCase() == 'cactus prefix'){
			bot.queue.push(['prefix', message, []]);
			return;
		}
		if (message.content.toLowerCase().includes("cactus")) {
			if (message.content.toLowerCase().includes("play despacito")){
				message.reply("you are omega gay.");
			} else {
				message.channel.send("Did i hear my name? OmO");
			}
			return;
		}
		return;
	}
	//console.log(`${bot.config.developer}, ${message.author.id}`);
	if (bot.config.developer && (message.author.id != "169525036305219585" && message.author.id != bot.user.id))
		return message.reply(" i am currently working on new features so i cannot help you at the moment!");
	if (bot.whitelistmode == true){
		//delete require.cache[require.resolve('./user-whitelist.json')];
		//const whitelistuserIDs = require('./user-whitelist.json');
		if (bot.userWhitelist.indexOf(message.author.id) == -1) return message.channel.send('Bot is in whitelist mode!');
	}
	let args = undefined;
	//console.log(message.content.startsWith(thisGuild.prefix));
	args = message.content.slice(thisGuild.prefix.length).split(/ +/)
	const command = args.shift().toLowerCase();
	//console.log(command);
	//console.log(args);
	if (command === '') {
		const AkariHug = bot.emojis.find(emoji => emoji.name === 'AkariHug');
		message.channel.send('<@' + message.author.id + '>, how may i help? ' + AkariHug.toString());
		return;
	}

	if (thisGuild.prefix == "null") return;
	
	if (!bot.commands.has(command)) {
		//for (command in bot.commands) message.channel.send(`${command.name}`);
		if (message.author.id == '169525036305219585')
			if (bot.insidercommands.has(command))
				return bot.queue.push([command, message, args]);
		return message.channel.send('<@' + message.author.id + '>, i did not understand your command!');
	}

	bot.queue.push([command, message, args]);
});

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

/*
bot.on('raw', async event => {
	if (!events.hasOwnProperty(event.t)) return
	const { d: data } = event;
	const user = bot.users.get(data.user_id);
	const channel = bot.channels.get(data.channel_id) || await user.createDM();

	if (channel.messages.has(data.message_id)) return;

	const message = await channel.fetchMessage(data.message_id);
	const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
	let reaction = message.reactions.get(emojiKey);
	if (!reaction) {
		// Create an object that can be passed through the event like normal
		const emoji = new Discord.Emoji(bot.guilds.get(data.guild_id), data.emoji);
		reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === bot.user.id);
	}
	bot.emit(events[event.t], reaction, user);
});
*/

bot.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = bot.channels.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.fetchMessage(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.set(packet.d.user_id, bot.users.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            bot.emit('messageReactionAdd', reaction, bot.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            bot.emit('messageReactionRemove', reaction, bot.users.get(packet.d.user_id));
        }
    });
});

bot.on('messageReactionAdd', (reaction, user) => {
	if (bot.userBlacklist.indexOf(user.id) != -1) return;
	if (bot.whitelistmode == true){
		if (bot.userWhitelist.indexOf(user.id) == -1) return;
	}
	console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
	if (bot.config.developer && (user.id != "169525036305219585" && user.id != bot.user.id)) return console.log("Developer mode, returning.");
	//var memberList = reaction.message.content.substring(reaction.message.content.indexOf(`\`\`\`\n`)+4,reaction.message.content.lastIndexOf(`\`\`\``));
	//var trackedIDs = bnssrcTrackIDs.id.toString().split(',');
	//if (user.bot) return;
	//if (trackedIDs.indexOf(reaction.message.id) == -1) return reaction.message.channel.send(reaction.message.id);
	//if (memberList === "Empty list"){
	//	memberList = "";
	//	memberList += reaction.emoji.toString();
	//	memberList += user.username;
	//} else {
	//	memberList += "\n" + `${reaction.emoji}` + user.username;
	//}
	//var messageNewContent = reaction.message.content.substring(0, reaction.message.content.indexOf(`\`\`\`\n`)+3) + memberList + reaction.message.content.substring(reaction.message.content.lastIndexOf(`\`\`\``));
	//reaction.message.edit(messageNewContent);
	if (user.bot) return;
	//if (!(reaction.emoji.name in bot.gameClasses)) {
		bot.queue.push(['rolereactionapply', reaction, user]);
		//return;
	//}
	//bot.queue.push(['reactionapply', reaction, user]);
	bot.queue.push(['bnsreactionapplyV2', reaction, user]);
});

bot.on('messageReactionRemove', (reaction, user) => {
	if (bot.userBlacklist.indexOf(user.id) != -1) return;
	if (bot.whitelistmode == true){
		if (bot.userWhitelist.indexOf(user.id) == -1) return;
	}
	console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);
	if (bot.config.developer && (user.id != "169525036305219585" && user.id != bot.user.id)) return console.log("Developer mode, returning.");
	//var memberList = reaction.message.content.substring(reaction.message.content.indexOf(`\`\`\`\n`)+4,reaction.message.content.lastIndexOf(`\`\`\``));
	if (user.bot) return;
	//if (!(reaction.emoji.name in bot.gameClasses)) {
		bot.queue.push(['rolereactionunapply', reaction, user]);
		//return;
	//}
	//bot.queue.push(['reactionunapply', reaction, user]);
	bot.queue.push(['bnsreactionunapplyV2', reaction, user]);
});

async function wait(ms){
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}
	await sleep(ms);
}

//joined a server
bot.on("guildCreate", guild => {
	if (guild.id == '611826349035749386'){
		return guild.leave();
	}
    console.log("Joined a new guild: " + guild.name);
	bot.queue.push(['updateguildlist', undefined, undefined]);
})

//removed from a server
bot.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);
    //remove from guildArray
})
