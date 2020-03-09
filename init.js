var path = require('path')
const fs = require('fs');
const Discord = require('discord.js');
var bot = require('./bot.js').bot;

// Initialize Discord Bot
async function initBot(bot, message){
	const fs = require('fs');
	bot.whitelistmode = false;
	//bot.queue = new Map();
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
				logchannel = logguild.channels.get('642485408722190336');
				logchannel.send(`[${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}]\n\`\`\`${msg}\`\`\``);
			}
			console._log_old(`[${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}]\n`+msg);
		}
		bot.dontberetarded = 'blight'; //worthy mention
	} else {
		//fuckoff
	}

	bot.queue = [];
	bot.bnsrecendlock = false;
	bot.musicQueue = new Map();
	bot.guildList = JSON.parse(fs.readFileSync('./guilds.json','utf8'));
	bot.bnsrecruitments = JSON.parse(fs.readFileSync('./recruitments.json', 'utf8'));
	bot.lockedbnsrecruitments = new Map();
	bot.bnsremovedreactions = [];
	bot.dailyGuildQuiz = JSON.parse(fs.readFileSync('./dailyGuildQuiz.json', 'utf8'));
	bot.bnsitems = JSON.parse(fs.readFileSync('./bnsitems.json', 'utf8'));
	bot.userWhitelist = JSON.parse(fs.readFileSync('./user-whitelist.json', 'utf8'));
	bot.userBlacklist = JSON.parse(fs.readFileSync('./user-blacklist.json', 'utf8'));
	bot.loop = loop;
	bot.bdoStuff = bdoStuff;
	bot.reloadCommands = reloadCommands;
	bot.guildUpdate = updateGuildList;
	bot.updateGuildList = updateGuildList;
	bot.updateBnsRecruitments = updateBnsRecruitments;
	bot.updateGuildQuiz = updateGuildQuiz;
	bot.getClassIcon = getClassIcon;
	bot.backup_file = backup_file;
	bot.backup_now = backup_now;
	bot.sum = sum;
	bot.wait = wait;

	bot.unicodeEmoji = ['ðŸ¤‘', '🤑'];

	bot.gameClasses = {
		BD: 'BD',
		BM: 'BM',
		DES: 'DES',
		FM: 'FM',
		GUN: 'GUN',
		KFM: 'KFM',
		SF: 'SF',
		SIN: 'SIN',
		SUM: 'SUM',
		WL: 'WL',
		WRD: 'WRD',
		ARC: 'ARC'
	}
	bot.gameRoles = {
		sb: 'sb',
		bb: 'bb',
		tank: 'tank',
		ac: 'ac'
	}


	bot.test2 = "twst2works!!!!!";
	if (message != null){
		message.channel.send("Restart complete!");
	} else {
		const restarted = JSON.parse(fs.readFileSync('./restart.json', 'utf8'));
		if (restarted.restart == true){
			if (!bot.loggedIn){
				await bot.login(bot.config.token);
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
			fs.writeFileSync('./restart.json', json, 'utf8');
		}
	}
	return bot;
}

module.exports.initBot = initBot;

async function loop(){
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}
	let count = -1;
	while (true){
		if (bot.queue.length == 0){
			//logger.info('Waiting');
			await sleep(1000);
			count++;
			if (count % 60 == 0){
				bot.bnsremovedreactions = [];
			}
			if (count % 3600 == 0){
				count = 0;
				console.log(`cleaning recruitments`);
				await bot.insidercommands.get('autobnsend').execute(bot);
				console.log(`moving on`);
				console.log(`Starting file backup`);
				bot.backup_now();
			}
			date = new Date();
			if (date.getHours() == 4 && bot.lastBnsStalk != date.getDay()){
				bot.lastBnsStalk = date.getDay();
				await bot.insidercommands.get('autobnsstalk').execute(bot);
			}
			//await bdoStuff(count);
		} else {
			console.log('Processing command');
			let currentCommand = bot.queue.shift();
			try {
				//bot.commands.get(command).execute(bot, message, args);
				console.log(`executing ${currentCommand[0]} with arguments ${currentCommand[1]}, ${currentCommand[2]}`);
				if (bot.commands.has(currentCommand[0]))
					bot.commands.get(currentCommand[0]).execute(bot, currentCommand[1], currentCommand[2]);
				if (bot.insidercommands.has(currentCommand[0]))
					bot.insidercommands.get(currentCommand[0]).execute(bot, currentCommand[1], currentCommand[2]);
				console.log(`moving on`);
			} catch (error) {
				console.error(error);
				//await currentCommand[1].reply('there was an error trying to execute that command!');
			}
		}
	}
}

async function bdoStuff(count){
	if (count % 60 > 0) return;
	date = new Date();
	if (((date.getMinutes() == 30) || (date.getMinutes() == 0)) && (bot.lastbdodate == undefined)){
		bot.lastbdodate = date;
		await bot.insidercommands.get('bdonotifybossspawn').execute(bot, null, null);
		return;
	}
	if (((date.getMinutes() == 30) || (date.getMinutes() == 0)) && (bot.lastbdodate.getMinutes() != date.getMinutes())) {
		bot.lastbdodate = date;
		await bot.insidercommands.get('bdonotifybossspawn').execute(bot, null, null);
	}
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

function reloadCommands(){
	bot.oldCommands = bot.commands;
	bot.oldInsiderCommands = bot.insidercommands;
	bot.commands = new Discord.Collection();
	bot.insidercommands = new Discord.Collection();
	const commandFiles = recFindByExt('./commands','js');
	const insiderCommandFiles = recFindByExt('./insiderthings','js');
	for (const file of commandFiles) {
		file2 = './' + file.split('\\').join('/');
		//console.log(file2);
		delete require.cache[require.resolve(`${file2}`)];
		const command = require(`${file2}`);
		bot.commands.set(command.name, command);
	}
	
	for (const file of insiderCommandFiles) {
		file2 = './' + file;
		delete require.cache[require.resolve(`${file2}`)];
		const command = require(`${file2}`);
		bot.insidercommands.set(command.name, command);
	}
}

function updateGuildList(){
	json = JSON.stringify(bot.guildList, null, 4).split(",").join(",\n");
	fs.writeFileSync('./guilds.json', json, 'utf8');
	bot.guildList = JSON.parse(fs.readFileSync('./guilds.json'));
}

function updateBnsRecruitments(){
	json = JSON.stringify(bot.bnsrecruitments, null, 4);
	fs.writeFileSync('./recruitments.json', json, 'utf8')
	bot.bnsrecruitments = JSON.parse(fs.readFileSync('./recruitments.json', 'utf8'));
}

function updateGuildQuiz(){
	json = JSON.stringify(bot.dailyGuildQuiz, null, 4);
	fs.writeFileSync('./dailyGuildQuiz.json', json, 'utf8')
	bot.dailyGuildQuiz = JSON.parse(fs.readFileSync('./dailyGuildQuiz.json', 'utf8'));
}

function getClassIcon(charClass){
	if (charClass == 'BD') return bot.emojis.find(emoji => emoji.name === "BD");
	if (charClass == 'BM') return bot.emojis.find(emoji => emoji.name === "BM");
	if (charClass == 'DES') return bot.emojis.find(emoji => emoji.name === "DES");
	if (charClass == 'FM') return bot.emojis.find(emoji => emoji.name === "FM");
	if (charClass == 'GUN') return bot.emojis.find(emoji => emoji.name === "GUN");
	if (charClass == 'KFM') return bot.emojis.find(emoji => emoji.name === "KFM");
	if (charClass == 'SF') return bot.emojis.find(emoji => emoji.name === "SF");
	if (charClass == 'SIN') return bot.emojis.find(emoji => emoji.name === "SIN");
	if (charClass == 'SUM') return bot.emojis.find(emoji => emoji.name === "SUM");
	if (charClass == 'WL') return bot.emojis.find(emoji => emoji.name === "WL");
	if (charClass == 'WRD') return bot.emojis.find(emoji => emoji.name === "WRD");
	if (charClass == 'ARC') return bot.emojis.find(emoji => emoji.name === "ARC");
	return null;
}

function sum(theArgs) {
    var i=0;
    var mystring = '';
    while (true){
        if (typeof theArgs[i] === "undefined") break;
        mystring += theArgs[i].toString() + " ";
        i++;
	}
	while (mystring[mystring.length-1] == " ")
		mystring = mystring.substr(0, mystring.length-1);
    return mystring;
}

async function wait(ms){
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}
	await sleep(ms);
}

async function backup_file(file){
	let filename = file.split(".")[0];
	let extension = file.split(".")[1];
	let date = new Date();
	let day = date.getDate().toString();
	let month = date.getMonth();
	month -=- 1;
	month = month.toString();
	let year = date.getFullYear().toString();
	let hour = date.getHours().toString();
	let minutes = date.getMinutes().toString();
	
	//console.log(`day ${day} month ${month} year ${year}`);
	filename = `.\\backups\\` + filename + `_backup_${year.substring(2,4)}${month.length==1? "0"+month : month}${day.length == 1 ? "0"+day : day}_${hour.length==1? "0"+hour : hour}${minutes.length==1? "0"+minutes : minutes}.` + extension;
	filecontent = fs.readFileSync(file, 'utf8');
	fs.writeFileSync(filename, filecontent, 'utf8');
	console.log(`${file} backed up successfully!`);
}

async function backup_now(){
	bot.backup_file('recruitments.json');
	console.log("Files backed up successfully!");
}
