module.exports.initBot = initBot;

// Initialize Discord Bot
async function initBot(bot, message){
	const fs = require('fs');
	bot.whitelistmode = false;
	if (bot.startupTime == undefined){
		let date = new Date();
		bot.startupTime = date;
	}
	if (bot.dontberetarded == undefined){
		console._log_old = console.log;
		console.log = function(msg){
			let date2 = new Date();
			if (bot.loggedIn){
				//send to my logging channel
				logguild = bot.guilds.get('247831161013796865');
				logchannel = logguild.channels.get('687149197199147038');
				logchannel.send(`[${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}]\n\`\`\`${msg}\`\`\``);
			}
			console._log_old(`[${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}]\n`+msg);
		}
		bot.dontberetarded = 'blight'; //worthy mention
	} else {
		//fuckoff
	}

	if (message != null){
		message.channel.send("Restart complete!");
	} else {
		const restarted = JSON.parse(fs.readFileSync('./betathings/betaRestart.json', 'utf8'));
		if (restarted.restart == true){
			if (!bot.loggedIn){
				await bot.login(bot.authToken.token);
			}
			//await bot.wait(3000);
			//console.log(bot.guilds);
			let guild = bot.guilds.get(restarted.guild);
			//console.log(guild);
			let channel = guild.channels.get(restarted.channel);
			channel.send("Restart complete!");
			restarted.restart = false;
			restarted.guild = null;
			restarted.channel = null;
			json = JSON.stringify(restarted, null, 4)
			fs.writeFileSync('./betaRestart.json', json, 'utf8');
		}
    }
    
    bot.commands = new Map();

    bot.commands.set("restart", require("./betarestart"));

	return bot;
}