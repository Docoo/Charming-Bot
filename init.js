var path = require('path')
const fs = require('fs');
const Discord = require('discord.js');
var bot = require('./bot.js').bot;
const countdown = require('./commands/util/countdown.js');

// Initialize Discord Bot
async function initBot(bot, message){
	const fs = require('fs');
	bot.whitelistmode = false;
	//bot.queue = new Map();
	if (bot.startupTime == undefined){
		let date = new Date();
		bot.startupTime = date;
        bot.lastMinute = date.getMinutes()-1;
        bot.lastHour = date.getHours()-1;
	}
	if (bot.dontberetarded == undefined){
		console._log_old = console.log;
		console.log = function(msg){
			let date2 = new Date();
            const bot = require('./bot.js').bot;
            // console._log_old(bot.loggedIn)
			if (bot.loggedIn){
				//send to my logging channel
				logguild = bot.guilds.resolve('247831161013796865');
				logchannel = logguild.channels.resolve('642485408722190336');
				logchannel.send(`[${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}]\n\`\`\`${msg}\`\`\``);
			}
			console._log_old(`[${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}]\n`+msg);
		}
		bot.dontberetarded = 'blight'; //worthy mention
	} else {
		//fuckoff
	}

	bot.queue = [];
    bot.loopIdentifier = initIdentifier();
	bot.bnsrecendlock = false;
	bot.musicQueue = new Map();
	bot.guildList = JSON.parse(fs.readFileSync('./configs/guilds.json','utf8'));
	bot.bnsrecruitments = JSON.parse(fs.readFileSync('./configs/recruitments.json', 'utf8'));
	bot.lockedbnsrecruitments = new Map();
	bot.bnsremovedreactions = [];
	bot.dailyGuildQuiz = JSON.parse(fs.readFileSync('./configs/dailyGuildQuiz.json', 'utf8'));
	bot.bnsitems = JSON.parse(fs.readFileSync('./configs/bnsitems.json', 'utf8'));
	bot.userWhitelist = JSON.parse(fs.readFileSync('./configs/user-whitelist.json', 'utf8'));
	bot.userBlacklist = JSON.parse(fs.readFileSync('./configs/user-blacklist.json', 'utf8'));
	bot.guildBlacklist = JSON.parse(fs.readFileSync('./configs/guild-blacklist.json', 'utf8'));
	bot.loop = loop;
	bot.bdoStuff = bdoStuff;
	bot.reloadCommands = reloadCommands;
	bot.guildUpdate = updateGuildList;
	bot.updateGuildList = updateGuildList;
	bot.updateBnsRecruitments = updateBnsRecruitments;
	bot.updateGuildQuiz = updateGuildQuiz;
	bot.getClassIcon = getClassIcon;
    bot.getEmoteById = getEmoteById;
    bot.getEmoteByName = getEmoteByName;
    bot.reactWeeklyTracker = reactWeeklyTracker;
    bot.initWeeklyTracker = initWeeklyTracker;
    bot.weeklyTrackers = JSON.parse(fs.readFileSync('./configs/weekly-trackers.json', 'utf8'));
    bot.updateWeeklyTrackers = updateWeeklyTrackers;
    bot.getWeeklyEmotesIdList = getWeeklyEmotesIdList;
    bot.getWeeklyTrackerById = getWeeklyTrackerById;
    bot.updateOneWeeklyTracker = updateOneWeeklyTracker;
	bot.backup_file = backup_file;
	bot.backup_now = backup_now;
	bot.sum = sum;
    bot.wait = wait;
    bot.sleep = wait
    bot.cycleTime = 86400; //in seconds; 86,400 = 24 * 3,600 (one day)
	bot.countdowns = JSON.parse(fs.readFileSync('./configs/countdowns.json', 'utf8'));
    bot.updateCountdowns = updateCountdowns;
    bot.removeCountdown = removeCountdown;
    bot.processCountdowns = processCountdowns;
    bot.sortCountdowns = sortCountdowns;
    bot.updateCountdownMessages = updateCountdownMessages;
    bot.endCountdown = endCountdown;
    bot.convertTZ = convertTZ;
    bot.timedEvents = timedEvents;
    bot.everyoneTagList = [];
    bot.addEveryoneTagToWatchlist = addEveryoneTagToWatchlist;
    bot.everyoneTagSpamCheck = everyoneTagSpamCheck;
    bot.everyoneTagSpamMute = everyoneTagSpamMute;
    bot.cleanEveryoneTagSpamList = cleanEveryoneTagSpamList;
    bot.eraseGuild = eraseGuild;
    bot.redditWatchList = JSON.parse(fs.readFileSync('./configs/redditWatches.json','utf8'));
    bot.updateAllReditWatches = updateAllReditWatches;
    bot.addSubreddit = addSubreddit;
    bot.addRedditWatch = addRedditWatch;
    bot.checkIfSubredditExists = checkIfSubredditExists;
    bot.checkIfAlreadySubscribed = checkIfAlreadySubscribed;
    bot.removeRedditWatch = removeRedditWatch;
    bot.removeInactiveSubs = removeInactiveSubs;
    bot.bnsServerStatus = null
    bot.bnsServerChecker = bnsServerChecker;
    bot.bnsNotifyMaintenance = bnsNotifyMaintenance
    bot.bnsServerStatusUpdate = bnsServerStatusUpdate

	bot.unicodeEmoji = ['ðŸ¤‘', '🤑', '1️⃣', '2️⃣', '3️⃣', '❤️', '🧡', '💚', '💙', '💜', '🖤', '🤎', '🤍', '💝', '💖', '💗', '💓', '💞', '💕', '❣️', '💔', '💟', '🍆', '⚡'];

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
        ARC: 'ARC',
        AST: 'AST'
	}
	bot.gameRoles = {
		sb: 'sb',
		bb: 'bb',
		tank: 'tank',
		ac: 'ac'
	}

    if (message != null){
		message.channel.send("Restart complete!");
	} else {
		const restarted = JSON.parse(fs.readFileSync('./configs/restart.json', 'utf8'));
		if (restarted.restart == true){
			if (!bot.loggedIn){
				await bot.login(bot.config.token);
                bot.loggedIn = true;
			}
			//await bot.wait(3000);
			//console.log(bot.guilds.cache);
			let guild = bot.guilds.cache.get(restarted.guild);
			//console.log(guild);
			let channel = guild.channels.cache.get(restarted.channel);
			channel.send("Restart complete!");
			restarted.restart = false;
			restarted.guild = null;
			restarted.channel = null;
			json = JSON.stringify(restarted, null, 4)
			fs.writeFileSync('./configs/restart.json', json, 'utf8');
		}
	}
    bot.reloadCommands();
    bot.loop(bot.loopIdentifier);
	return bot;
}

module.exports.initBot = initBot;

async function loop(newIdentifier){
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}
	let count = -1;
    let identifier = newIdentifier;
	while (identifier == bot.loopIdentifier){
        bot.botInstanceID = require('./bot.js').botInstanceID;
		if (bot.queue.length == 0){
			//logger.info('Waiting');
			await sleep(1000);
			count++;
			date = new Date();
            //every minute
			if (count % 60 == 0){
                if (bot.lastMinute == date.getMinutes()){
                    console.log(`[${bot.botInstanceID}:${identifier}]Serviced same minute twice`)
                } else {
                    bot.bnsremovedreactions = [];
                    bot.processCountdowns();
                    bot.timedEvents();
                    bot.cleanEveryoneTagSpamList();
                    bot.bnsServerChecker();
                    //console.log(`It is now ${date.getHours()}:${date.getMinutes()}`)
                    bot.lastMinute = date.getMinutes();
                }
			}
            // every hour
            if (count % 3600 == 0){
                if (bot.lastHour == date.getHours()){
                    console.log(`[${bot.botInstanceID}:${identifier}]Serviced same hour twice`)
                } else {
                    console.log(`[${bot.botInstanceID}:${identifier}]Hourly sanity check!`)
                            
                    // if (date.getHours() == 4 && bot.lastBnsStalk != date.getDay()){
                    //     bot.lastBnsStalk = date.getDay();
                    //     await bot.insidercommands.get('autobnsstalk').execute(bot);
                    // }
                    bot.lastHour = date.getHours();
                }
			}
			if (count > bot.cycleTime){
				count = 0;
				console.log(`cleaning recruitments`);
				await bot.insidercommands.get('autobnsend').execute(bot);
				console.log(`moving on`);
				console.log(`Starting file backup`);
				bot.backup_now();
			}
			//await bdoStuff(count);
		} else {
            const silencedCommandsList = ["bnsreactionapplyV2", "rolereactionapply", "rolereactionunapply", "bnsreactionunapplyV2"]
            if (!silencedCommandsList.includes(bot.queue[0][0]))
			    console.log(`[${bot.botInstanceID}:${identifier}]Processing command`);
			let currentCommand = bot.queue.shift();
			try {
				//bot.commands.get(command).execute(bot, message, args);
                if (!silencedCommandsList.includes(currentCommand[0]))
				    console.log(`executing ${currentCommand[0]} with arguments ${currentCommand[1]}, ${currentCommand[2]}`);
				if (bot.commands.has(currentCommand[0]))
					bot.commands.get(currentCommand[0]).execute(bot, currentCommand[1], currentCommand[2]);
				if (bot.insidercommands.has(currentCommand[0]))
					bot.insidercommands.get(currentCommand[0]).execute(bot, currentCommand[1], currentCommand[2]);
                if (!silencedCommandsList.includes(currentCommand[0]))
                    console.log(`moving on`);
			} catch (error) {
				console.error(error);
				//await currentCommand[1].reply('there was an error trying to execute that command!');
			}
		}
	}
    console.log(`Ended loop with identifier ${identifier}`);
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
	fs.writeFileSync('./configs/guilds.json', json, 'utf8');
	bot.guildList = JSON.parse(fs.readFileSync('./configs/guilds.json'));
}

function updateBnsRecruitments(){
	json = JSON.stringify(bot.bnsrecruitments, null, 4);
	fs.writeFileSync('./configs/recruitments.json', json, 'utf8')
	bot.bnsrecruitments = JSON.parse(fs.readFileSync('./configs/recruitments.json', 'utf8'));
}

function updateGuildQuiz(){
	json = JSON.stringify(bot.dailyGuildQuiz, null, 4);
	fs.writeFileSync('./configs/dailyGuildQuiz.json', json, 'utf8')
	bot.dailyGuildQuiz = JSON.parse(fs.readFileSync('./configs/dailyGuildQuiz.json', 'utf8'));
}

function getClassIcon(charClass){
	if (charClass == 'BD') return bot.emojis.resolve("580815008372359238");
	if (charClass == 'BM') return bot.emojis.resolve("580815008397656084");
	if (charClass == 'DES') return bot.emojis.resolve("580815008469090318");
	if (charClass == 'FM') return bot.emojis.resolve("580815008342999051");
	if (charClass == 'GUN') return bot.emojis.resolve("580815008414433290");
	if (charClass == 'KFM') return bot.emojis.resolve("580815008468828171");
	if (charClass == 'SF') return bot.emojis.resolve("580815008389136385");
	if (charClass == 'SIN') return bot.emojis.resolve("580815008393330708");
	if (charClass == 'SUM') return bot.emojis.resolve("580815008376684564");
	if (charClass == 'WL') return bot.emojis.resolve("580815008405913630");
	if (charClass == 'WRD') return bot.emojis.resolve("580815008422690839");
	if (charClass == 'ARC') return bot.emojis.resolve("624282245024186388");
	if (charClass == 'AST') return bot.emojis.resolve("759455403175444531");
	return null;
}

function getEmoteById(id){
    //console.log(id)
    //console.dir(bot.emojis.resolve(id))
    return bot.emojis.resolve(id)
}

function getEmoteByName(name){
    return bot.emojis.cache.find(emoji => emoji.name == name);
}

function reactWeeklyTracker(trackerMessage){
    trackerMessage.react(bot.getEmoteById("911415406550450269")).then(message => {
        trackerMessage.react(bot.getEmoteById("911415406865039361")).then (message => {
            trackerMessage.react(bot.getEmoteById("911415407007649792")).then(message => {
                trackerMessage.react(bot.getEmoteById("911415406986661898")).then(message => {
                    trackerMessage.react(bot.getEmoteById("911415407053778954"));
                })
            })
        })
    })
}

function initWeeklyTracker(userID, guildID, channelID, messageID, name, date){
    const tracker = {};
    tracker.userID = userID;
    tracker.guildID = guildID;
    tracker.channelID = channelID;
    tracker.messageID = messageID;
    tracker.name = name;
    tracker.date = date;
    tracker.weeklies = false;
    tracker.bt = false;
    tracker.vt = false;
    tracker.tt = false;
    tracker.et = false;
    bot.weeklyTrackers.push(tracker);
    bot.updateWeeklyTrackers();
}

function getWeeklyEmotesIdList(){
    //weeklies, bt, vt, tt, et
    return ["911415406550450269", "911415406865039361", "911415407007649792", "911415406986661898", "911415407053778954"];
}

function updateWeeklyTrackers(){
    json = JSON.stringify(bot.weeklyTrackers, null, 4);
	fs.writeFileSync('./configs/weekly-trackers.json', json, 'utf8');
	bot.weeklyTrackers = JSON.parse(fs.readFileSync('./configs/weekly-trackers.json', 'utf8'));
}

function getWeeklyTrackerById(trackerID){
    for (aTracker of bot.weeklyTrackers){
        if (aTracker.messageID == trackerID) return aTracker;
    }
    return undefined;
}

function updateOneWeeklyTracker(newWeeklyTracker){
    // for (aTracker of bot.weeklyTrackers){
    //     if (aTracker.messageID == newWeeklyTracker.messageID){
    //         aTracker.weeklies = newWeeklyTracker.weeklies;
    //         aTracker.bt = newWeeklyTracker.bt;
    //         aTracker.vt = newWeeklyTracker.vt;
    //         aTracker.tt = newWeeklyTracker.tt;
    //         aTracker.et = newWeeklyTracker.et;
    //     };
    // }

    //alter current tracker here if needed

    bot.updateWeeklyTrackers();
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
	filename = `./backups/` + filename + `_backup_${year.substring(2,4)}${month.length==1? "0"+month : month}${day.length == 1 ? "0"+day : day}_${hour.length==1? "0"+hour : hour}${minutes.length==1? "0"+minutes : minutes}.` + extension;
	filecontent = fs.readFileSync(file, 'utf8');
	fs.writeFileSync(filename, filecontent, 'utf8');
	console.log(`${file} backed up successfully!`);
}

async function backup_now(){
	bot.backup_file('./configs/recruitments.json');
	bot.backup_file('./configs/countdowns.json');
	console.log("Files backed up successfully!");
}

function updateCountdowns(){
    bot.sortCountdowns();
	json = JSON.stringify(bot.countdowns, null, 4);
	fs.writeFileSync('./configs/countdowns.json', json, 'utf8')
	bot.countdowns = JSON.parse(fs.readFileSync('./configs/countdowns.json', 'utf8'));
}

function removeCountdown(countdown_message_id){
    let removedCountdown;
    for (i in bot.countdowns){
        //console.log(i);
        let aC = bot.countdowns[i];
        if (aC.message_id == countdown_message_id){
            removedCountdown = bot.countdowns.splice(i, 1);
            break;
        }
    }
    bot.updateCountdowns();
    return removedCountdown[0];
}

function processCountdowns(){
    if (bot.countdowns.length == 0) return;
    while (new Date() > new Date(bot.countdowns[0].targetDate)){
        let removedCountdown = bot.removeCountdown(bot.countdowns[0].message_id);
        bot.endCountdown(removedCountdown);
        if (bot.countdowns.length == 0) break;
    }
    bot.updateCountdownMessages();
}

function sortCountdowns(){
    bot.countdowns = bot.countdowns.slice().sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
}

function updateCountdownMessages(){
    let currentDate = new Date();
    for (currentCountdown of bot.countdowns){
        let timeLeft = new Date(new Date(currentCountdown.targetDate)-currentDate);
        const embed = new Discord.MessageEmbed();
        embed.setTitle("**Countdown**")
            .setDescription(`**${timeLeft.getUTCHours()} hours : ${timeLeft.getUTCMinutes()} minutes left**`);
        bot.guilds.cache.get(currentCountdown.server_id).channels.cache.get(currentCountdown.channel_id).messages.fetch(currentCountdown.message_id).then(message => {
            message.edit({embeds: [embed]});
        });
    }
}

function endCountdown(removedCountdown){
    const embed = new Discord.MessageEmbed();
    embed.setTitle("**Countdown**")
        .setDescription(`**Countdown ended!**`);
    bot.guilds.cache.get(removedCountdown.server_id).channels.cache.get(removedCountdown.channel_id).messages.fetch(removedCountdown.message_id).then(message => {
        message.edit({embeds: [embed]});
    });
}

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

function timedEvents(){
    let date = new Date();

    //LEFT THIS SERVER
    //ruki's countdown
    // if (date.getHours() == 12 && date.getMinutes() == 0){
    //     //6 pm KST
    //     console.log(`got here with date ${date}`)
    //     bot.guilds.cache.get("857148059410628618").channels.cache.get("857158078071701534").messages.fetch("857739650209939466").then(message => {
    //         bot.commands.get("countdown").execute(bot, message, ["6", "0"]);
    //     });
    // }
    //ruki's SF9 announcement
    // if (date.getHours() == 2 && date.getMinutes() == 00){
    //     bot.insidercommands.get("emptychannel").execute(bot, "857148059410628618", "857148060172812345");
    // }
    //ruki's SF9 timer
    // if (date.getHours() == 2 && date.getMinutes() == 00){
    //     bot.insidercommands.get("emptychannel").execute(bot, "857148059410628618", "857158078071701534");
    // }
    //ruki's SF9 done or not
    // if (date.getHours() == 2 && date.getMinutes() == 00){
    //     bot.insidercommands.get("emptychannel").execute(bot, "857148059410628618", "857148060358279198");
    // }

    //bns weekly tracker reset every wednesday at 8 am bot time
    if (date.getDay() == 3 && date.getHours() == 8 && date.getMinutes() == 0){
        bot.insidercommands.get("resetweeklytrackers").execute(bot, null, null);
    }

    //reddit watches every 10 minutes
    if (date.getMinutes()%10 == 0){
        //console.log(`time for reddit stuff`)
        bot.removeInactiveSubs()
        bot.insidercommands.get("redditwatchprocess").execute(bot, null, null);
    }
    
}

function generateIdentifier(oldIdentifier){
    let newIdentifier = Math.floor(Math.random() * 65535);
    while (oldIdentifier == newIdentifier){
        newIdentifier = Math.floor(Math.random() * 65535);
    }
    return newIdentifier;
}

function initIdentifier(){
    if (bot.loopIdentifier != undefined){
        //console.log("old identifier found:" + bot.loopIdentifier);
        return generateIdentifier(bot.loopIdentifier);
    }
    return generateIdentifier(0);
}

function addEveryoneTagToWatchlist(message){
    let date = new Date();
    let entry = {};
    entry.date = date;
    entry.userID = message.author.id;
    entry.serverID = message.guild.id;
    bot.everyoneTagList.push(entry);
    bot.everyoneTagSpamCheck(message.author.id, message.guild.id);
}

function everyoneTagSpamCheck(userID, guildID){
    let counter = 0;
    for (entry of bot.everyoneTagList){
        if (entry.userID == userID && entry.serverID == guildID) counter++;
    }
    if (counter > 1) bot.everyoneTagSpamMute(userID, guildID);
}

function everyoneTagSpamMute(userID, guildID){
    const guild = bot.guilds.cache.get(guildID);
    let thisGuild;
    bot.guildList.forEach(guild => {if (guild.guildID == guildID) thisGuild = guild; });
    const role = guild.roles.get(thisGuild.mutedRoleID);
    const member = guild.members.get(userID);
    member.addRole(role);
    console.log(`Protected ${guild.name} from everyone tag spammer ${member.user.username}`);
}

function cleanEveryoneTagSpamList(){
    let limitDate = new Date(new Date() - 1000*60*5);
    for (entry of bot.everyoneTagList){
        let entryDate = entry.date;
        if (entryDate < limitDate){
            bot.everyoneTagList.splice(bot.everyoneTagList.indexOf(entry), 1);
        }
    }
}

function eraseGuild(guildID){
    //remove guild settings
    //configs/recruitments.json
    //configs/weekly-trackers.json
    //configs/guilds.json
    //configs/redditWatches.json
    //dailyguildquez.json
    //configs/countdowns.json
    //
    for (guildIndex in bot.guildList){
        if (bot.guildList[guildIndex].guildID == guildID){
            bot.guildList.splice(guildIndex, 1);
            break;
        }
    }
    bot.updateGuildList();
}

function updateAllReditWatches(){
    json = JSON.stringify(bot.redditWatchList, null, 4).split(",").join(",\n");
	fs.writeFileSync('./configs/redditWatches.json', json, 'utf8');
    bot.redditWatchList = JSON.parse(fs.readFileSync('./configs/redditWatches.json','utf8'));
}

function addSubreddit(subreddit){
    for (const redditWatch of bot.redditWatchList){
        if (redditWatch.subreddit == subreddit) return;
    }
    const redditWatch = {};
    redditWatch.subreddit = subreddit;
    redditWatch.watches = [];
    redditWatch.lastPosted = [];
    bot.redditWatchList.push(redditWatch);
    bot.updateAllReditWatches();
}

function addRedditWatch(subreddit, serverID, channelID){
    for (const redditWatch of bot.redditWatchList){
        if (redditWatch.subreddit == subreddit) {
            const serverEntry = {}
            serverEntry.serverID = serverID
            serverEntry.channelID = channelID
            redditWatch.watches.push(serverEntry)
            bot.updateAllReditWatches();
            return true;
        }
    }
    return false;
}

function checkIfSubredditExists(subreddit){
    for (const redditWatch of bot.redditWatchList){
        if (redditWatch.subreddit == subreddit) return true;
    }
    return false;
}

function checkIfAlreadySubscribed(subreddit, serverID){
    for (const redditWatch of bot.redditWatchList){
        if (redditWatch.subreddit == subreddit) {
            for (const serverEntry of redditWatch.watches){
                if (serverEntry.serverID == serverID) return serverEntry.channelID
            }
        }
    }
    return 0;
}

function removeRedditWatch(subreddit, serverID){
    for (const redditWatch of bot.redditWatchList){
        if (redditWatch.subreddit == subreddit) {
            for (const serverEntry of redditWatch.watches){
                if (serverEntry.serverID == serverID){
                    redditWatch.watches.splice(redditWatch.watches.indexOf(serverEntry), 1)
                    bot.updateAllReditWatches()
                }
            }
        }
    }
}

function removeInactiveSubs(){
    for (const redditWatch of bot.redditWatchList){
        if (redditWatch.watches.length == 0){
            bot.redditWatchList.splice(bot.redditWatchList.indexOf(redditWatch), 1)
        }
    }
    bot.updateAllReditWatches()
}

function bnsServerStatusUpdate(status){
    if (status == "error") return console.log(`Error checking bns server status`)
    if (status == null) return console.log(`How the fuck did you give me a null bns server status?!`)
    if (bot.bnsServerStatus != null && bot.bnsServerStatus != status) bnsNotifyMaintenance(status)
    bot.bnsServerStatus = status;
}

function bnsServerChecker(){
    bot.insidercommands.get("bnsmaintenancecheck").execute(bot, null, null)
}

function bnsNotifyMaintenance(onlineStatus){
    let textToSend = "This was supposed to be a BnS server status change notification but Charmie fucked up"
    if (onlineStatus == "online") {
        textToSend = "BnS EU server is now online"
    } else if (onlineStatus == "offline") {
        textToSend = "BnS EU server has gone offline"
    }

    bot.guildList.forEach(botguild => {
        if (botguild.bnsMaintenanceChannel != null){
            try{
                const guild = bot.guilds.resolve(botguild.guildID)
                const channel = guild.channels.resolve(botguild.bnsMaintenanceChannel)
                channel.send(textToSend)
            } catch (err) {
                console.log(`Failed to notify BnS server status change to server with id ${botguild.guildID}`)
                console.log(err)
            }
        }
    });
}