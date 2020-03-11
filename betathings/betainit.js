module.exports.initBot = initBot;
const fs = require('fs');
const path = require('path');

// Initialize Discord Bot
async function initBot(bot, message){
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

	bot.recFindByExt = recFindByExt;
	bot.reloadCommands = reloadCommands;

	try{
		bot.reloadCommands(bot);
		bot.oldCommands = undefined;
		console.log("reloaded without errors")
	} catch (error){
		console.log("init error: " + error);
		bot.commands = bot.oldCommands;
		bot.oldCommands = undefined;
		console.log("reloaded with errors")
	}

	return bot;
}

function recFindByExt(base,ext,files,result) 
{
    files = files || fs.readdirSync(base) 
    result = result || [] 

    files.forEach( 
        function (file) {
            var newbase = path.join(base,file)
            if ( fs.statSync(newbase).isDirectory() )
            {
                result = recFindByExt(newbase,ext,fs.readdirSync(newbase),result)
            }
            else
            {
                if ( file.substr(-1*(ext.length+1)) == '.' + ext )
                {
                    result.push(newbase)
                } 
            }
        }
    )
    return result
}

function reloadCommands(bot){
	bot.oldCommands = bot.commands;
	bot.commands = new Map();
	const commandFiles = recFindByExt('./betacommands','js');
	for (const file of commandFiles) {
		file2 = './../' + file.split('\\').join('/');
		delete require.cache[require.resolve(`${file2}`)];
		const command = require(`${file2}`);
		bot.commands.set(command.name, command);
	}
	delete require.cache[require.resolve("./betarestart")];
	bot.commands.set("restart", require("./betarestart"));
}