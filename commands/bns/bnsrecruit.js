const Discord = require('discord.js');

module.exports = {
    name: "bnsrec",
    description: "Recruit a party for BnS",
    usage: `bnsrecruit <numberOfPeople> <title> [[(<person>, <class> [, <tank>]), ...], <enforceRoleFitting>]
            accepts any amount of pairs of (person, class) to include in the recruitment **OR**
            bnsrecruit <numberOfPeople> <title> <roles>`,
    help: `**numberOfPeople** : amount of spots available for filling by others (including input characters)
            **person** : can be a mention or a user's Discord ID - used for identification
            **class** : the class the user will playing
            **person** and **class** must be input as a pair (one after the other, separated by space)
            multiple pairs can be provided, or none at all (optional parameter)
            **enforceRoleFitting** : optional - must be a 'y' for TRUE or a 'n' for FALSE
            if disabled, apply rule is first come, first served
            if enabled, the bot will reserve spots for buffs and a tank
            if the roles could not be filled at the end of the recruitment, spots are filled by fifo.
            **roles** : any combination of "SB", "BB", "AC" and 'tank' (priority in this order), maximum 2 of each buff and one tank
            using these tags will change recruitment type to find specific buffs (any class with the specific buff)`,
    async execute(bot,message,args){
        if (args.length == 0) return bot.queue.push(['help', message, ['bnsrecruit']]);
        let nrOfPeople = args.shift();
        if (nrOfPeople < 1 || nrOfPeople > 12 || isNaN(nrOfPeople)){ 
            //console.log(nrOfPeople + ", " + isNaN(nrOfPeople));
            return message.channel.send("Invalid party size!");
        }
        //console.log("Number of people: " + nrOfPeople);
        if (args.length == 0) return bot.queue.push(['help', message, ['bnsrecruit']]);
        let title = args.shift();
        let titleTest = message.channel.guild.members.cache.find(member => 
            member.id == title || member.displayName == title || member.user.username == title || title.includes(member.id)
        );
        if (titleTest != null) return message.channel.send("It would seem you forgot to input a title!");
        //console.log("Title: " + title);


        let recruitment = JSON.parse("{}");
        recruitment.sb_count = 0;
        recruitment.bb_count = 0;
        recruitment.ac_count = 0;
        recruitment.stealth_count = 0;
        recruitment.hmb_count = 0;
        recruitment.ice_count = 0;
        recruitment.server_name = message.guild.name;
        recruitment.server_id = message.guild.id;
        recruitment.channel_id = message.channel.id;
        recruitment.message_id = null;
        recruitment.title = title;
        recruitment.nr_max_people = parseInt(nrOfPeople);
        recruitment.nr_taken_spots = 0;
        recruitment.nr_free_spots = parseInt(nrOfPeople);
        recruitment.author = message.author.id;
        recruitment.nr_overflow = 0;
        recruitment.party_one = [];
        recruitment.party_one_sb_id = null;
        recruitment.party_one_bb_id = null;
        recruitment.party_one_ac_id = null;
        recruitment.party_two = [];
        recruitment.party_two_sb_id = null;
        recruitment.party_two_bb_id = null;
        recruitment.party_two_ac_id = null;
        recruitment.overflow = [];
        recruitment.tank_id = null;
        if (args[0] != undefined && args[0].toLowerCase() in bot.gameRoles){
            recruitment.type = 'B';
            recruitment.sb_needed = 0;
            recruitment.bb_needed = 0;
            recruitment.ac_needed = 0;
            recruitment.tank_needed = false;
        } else {
            recruitment.type = 'A';
            if (nrOfPeople > 6)
                recruitment.nr_of_parties = 2
            else
                recruitment.nr_of_parties = 1;
        }
        for (let thisGuild of bot.guildList){
            if (thisGuild.guildID == message.channel.guild.id){
                if (thisGuild.bnsRecNick == false){
                    recruitment.use_nick = false;
                } else {
                    recruitment.use_nick = true;
                }
            }
        }



        let players = [];
        let roles = [];
        let count = 0;
        let tankPlayer = undefined;
        if (recruitment.type == 'A'){
            while (args.length >= 2){
                count++;
                let name = args.shift();
				let myUser = null;
				for (let user of message.channel.guild.members){
					user = user[1];
					//console.log(user.displayName.toLowerCase().length + ", " + user.user.username.toLowerCase().length + ", " + name.toLowerCase().length);
					if (user.displayName.toLowerCase() == name.toLowerCase() || user.user.username.toLowerCase() == name.toLowerCase() || user.id == name){
						myUser = user;
						break;
					}
				}
				if (myUser == null){
					for (let user of message.channel.guild.members){
						user = user[1];
						if (user.displayName.toLowerCase().includes(name.toLowerCase()) || user.user.username.toLowerCase().includes(name.toLowerCase())){
							myUser = user;
							break;
						}
					}
				}
                //let player = message.channel.guild.members.cache.find(member => 
                    //member.id == tempPlayer || member.displayName == tempPlayer || member.user.username == tempPlayer || tempPlayer.includes(member.id)
                //);
                if (myUser == null) {
                    return message.channel.send("Player #" + count + " not found on server!");
                }
                    let tempClass = args.shift();
                if (!(tempClass in bot.gameClasses))
                    return message.channel.send("Player #" + count + " has an invalid class!");
                let temparr = [];
                //console.log(player);
                //console.log(tempClass);
                temparr.push(myUser);
                temparr.push(tempClass);
                players.push(temparr);
                if (args[0] != undefined)
                    if (args[0].toLowerCase() == 'tank'){
                        if (tankPlayer == undefined){
                            tankPlayer = myUser;
                            recruitment.tank_id = tankPlayer.id;
                        }
                        args.shift();
                    }
            }
        } else if (recruitment.type == 'B'){
            while (args.length > 0){
                tempRole = args.shift().toLowerCase();
                if (tempRole in bot.gameRoles){
                    if (tempRole == 'sb') recruitment.sb_needed++;
                    if (tempRole == 'bb') recruitment.bb_needed++;
                    if (tempRole == 'ac') recruitment.ac_needed++;
                    if (tempRole == 'tank') recruitment.tank_needed = true;
                } else return message.channel.send(`${tempRole} is not a valid role!`);
            }
        }
        if (recruitment.tank_needed){
            if (recruitment.sb_needed + recruitment.bb_needed + recruitment.ac_needed <= recruitment.nr_max_people)
                recruitment.tank_is_buff = true
            else
                recruitment.tank_is_buff = false;
        }
        //console.log("Players: " + players.toString());
        let enforceRoleFitting = false;
        let temp = '';
        if (args.length > 0)
            temp = args.shift();
        if (temp == "y")
            enforceRoleFitting = true
        else
            enforceRoleFitting = false;
        //console.log("Enforcement: " + enforceRoleFitting);

        date = new Date();
        if (recruitment.nr_max_people > 6)
            date.setDate(date.getDate()+7)
        else
        date.setDate(date.getDate()+2);
        recruitment.expire = date;
        recruitment.enforceRoles = enforceRoleFitting;
        
        //console.log(recruitment);

        
        

        const Discord = require('discord.js');
        const messageAttachment = new Discord.MessageAttachment().setFile(`./assets/bns_logo.png`);
        newEmbed.setThumbnail('attachment://bns_logo.png');

        if(recruitment.type == 'A'){
            if (recruitment.enforceRoles) {
                if (recruitment.tank_id != null){
                    //find tank and put it in LennyFace
                    for (index in players){
                        tank = players[index][0];
                        tankclass = players[index][1];
                        if (tank.id == recruitment.tank_id){
                            players.splice(index, 1);
                            recruitment.party_one.push([tank.id, tankclass]);
                            recruitment.nr_taken_spots++;
                            recruitment.nr_free_spots--;
                            if (tankclass == 'WRD' || tankclass == 'WL'){
                                recruitment.party_one_sb_id = tank.id;
                                recruitment.sb_count++;
                            }
                            if (tankclass == 'KFM' || tankclass == 'SIN'){
                                recruitment.party_one_bb_id = tank.id;
                                recruitment.bb_count++;
                                if (tankclass == 'SIN'){
                                    recruitment.stealth_count++;
                                }
                            }
                            if (tankclass == 'GUN' || tankclass == 'ARC'){
                                recruitment.party_one_ac_id = tank.id;
                                recruitment.ac_count++;
                            }
                            if (tankclass == 'SIN' || tankclass == 'SUM'){
                                recruitment.stealth_count++;
                            }
                            if (tankclass == 'FM' || tankclass == 'DES'){
                                recruitment.ice_count++;
                            }
                            if (tankclass == 'BM' || tankclass == 'BD'){
                                recruitment.hmb_count++;
                            }
                        }
                    }
                }
                for (index in players){
                    player = players[index][0];
                    playerclass = players[index][1];
                    if (playerclass == 'WL' || playerclass == 'WRD'){
                        if (recruitment.party_one_sb_id == null){
                            recruitment.party_one_sb_id = player.id;
                            recruitment.sb_count++;
                            players.splice(index, 1);
                            recruitment.party_one.push([player.id, playerclass]);
                            recruitment.nr_taken_spots++;
                            recruitment.nr_free_spots--;
                            break;
                        }
                    }
                }
                if (recruitment.nr_of_parties == 2){
                    for (index in players){
                        player = players[index][0];
                        playerclass = players[index][1];
                        if (playerclass == 'WL' || playerclass == 'WRD'){
                            if (recruitment.party_two_sb_id == null){
                                recruitment.party_two_sb_id = player.id;
                                recruitment.sb_count++;
                                players.splice(index, 1);
                                recruitment.party_two.push([player.id, playerclass]);
                                recruitment.nr_taken_spots++;
                                recruitment.nr_free_spots--;
                                break;
                            }
                        }
                    }
                }
                for (index in players){
                    player = players[index][0];
                    playerclass = players[index][1];
                    if (playerclass == 'SIN' || playerclass == 'KFM'){
                        if (recruitment.party_one_bb_id == null){
                            recruitment.party_one_bb_id = player.id;
                            recruitment.bb_count++;
                            players.splice(index, 1);
                            recruitment.party_one.push([player.id, playerclass]);
                            recruitment.nr_taken_spots++;
                            recruitment.nr_free_spots--;
                            if (playerclass == 'SIN'){
                                recruitment.stealth_count++;
                            }
                            break;
                        }
                    }
                }
                if (recruitment.nr_of_parties == 2 && recruitment.nrOfPeople-6 > 1){
                    for (index in players){
                        player = players[index][0];
                        playerclass = players[index][1];
                        if (playerclass == 'SIN' || playerclass == 'KFM'){
                            if (recruitment.party_two_bb_id == null){
                                recruitment.party_two_bb_id = player.id;
                                recruitment.bb_count++;
                                players.splice(index, 1);
                                recruitment.party_two.push([player.id, playerclass]);
                                recruitment.nr_taken_spots++;
                                recruitment.nr_free_spots--;
                                if (playerclass == 'SIN'){
                                    recruitment.stealth_count++;
                                }
                                break;
                            }
                        }
                    }
                }
                for (index in players){
                    player = players[index][0];
                    playerclass = players[index][1];
                    if (playerclass == 'GUN' || playerClass == 'ARC'){
                        if (recruitment.party_one_ac_id == null){
                            recruitment.party_one_ac_id = player.id;
                            recruitment.ac_count++;
                            players.splice(index, 1);
                            recruitment.party_one.push([player.id, playerclass]);
                            recruitment.nr_taken_spots++;
                            recruitment.nr_free_spots--;
                            break;
                        }
                    }
                }
                if (recruitment.nr_of_parties == 2 && recruitment.nrOfPeople-6 > 2){
                    for (index in players){
                        player = players[index][0];
                        playerclass = players[index][1];
                        if (playerclass == 'GUN' || playerClass == 'ARC'){
                            if (recruitment.party_two_ac_id == null){
                                recruitment.party_two_ac_id = player.id;
                                recruitment.ac_count++;
                                players.splice(index, 1);
                                recruitment.party_one.push([player.id, playerclass]);
                                recruitment.nr_taken_spots++;
                                recruitment.nr_free_spots--;
                                break;
                            }
                        }
                    }
                }
                while (players.length > 0){
                    player = players[0][0];
                    playerclass = players[0][1];
                    players.shift();
                    //party1 spot verify
                    count = 6;
                    if (count > recruitment.nr_max_people) count = recruitment.nr_max_people;
                    count = count - recruitment.party_one.length;
                    if (recruitment.tank_id == null) count--;
                    if (recruitment.party_one_sb_id == null) count--;
                    if (recruitment.party_one_bb_id == null) count--;
                    if (recruitment.party_one_ac_id == null) count--;
                    if (count > 0){
                        recruitment.party_one.push([player.id, playerclass]);
                        recruitment.nr_taken_spots++;
                        recruitment.nr_free_spots--;
                        if (playerClass == 'SIN' || 'SUM'){
                            recruitment.stealth_count++;
                        }
                        if (playerClass == 'FM' || 'DES'){
                            recruitment.ice_count++;
                        }
                        if (playerClass == 'BM' || 'BD'){
                            recruitment.hmb_count++;
                        }
                    } else {
                        //party2 spot verify
                        count == recruitment.nr_max_people-6;
                        if (recruitment.party_two_sb_id == null) count--;
                        if (recruitment.party_two_bb_id == null) count--;
                        if (recruitment.party_two_ac_id == null) count--;
                        if (count > 0){
                            recruitment.party_two.push([player.id, playerclass]);
                            recruitment.nr_taken_spots++;
                            recruitment.nr_free_spots--;
                            if (playerClass == 'SIN' || 'SUM'){
                                recruitment.stealth_count++;
                            }
                            if (playerClass == 'FM' || 'DES'){
                                recruitment.ice_count++;
                            }
                            if (playerClass == 'BM' || 'BD'){
                                recruitment.hmb_count++;
                            }
                        } else {
                            //overflow
                            recruitment.overflow.push([player.id, playerclass]);
                            recruitment.nr_overflow++;
                        }
                    }
                }
            } else
            while (players.length > 0){
                temparr = players.shift();
                player = temparr.shift();
                playerClass = temparr.shift();
                //no roles yay
                if (recruitment.nr_free_spots == 0){
                    //overflow nibba
                    recruitment.overflow.push([player.id, playerClass]);
                    recruitment.nr_overflow++;
                } else if (recruitment.party_one.length < 6){
                    //party1 master race
                    recruitment.party_one.push([player.id, playerClass]);
                    if (playerClass == 'WL' || playerClass == 'WRD'){
                        //sb check
                        recruitment.sb_count++;
                        if (recruitment.party_one_sb_id == null)
                            recruitment.party_one_sb_id == player.id;
                    }
                    if (playerClass == 'SIN' || playerClass == 'KFM'){
                        //bb check
                        recruitment.bb_count++;
                        if (recruitment.party_one_bb_id == null)
                            recruitment.party_one_bb_id == player.id;
                    }
                    if (playerClass == 'GUN' || playerClass == 'ARC'){
                        //ac check
                        recruitment.ac_count++;
                        if (recruitment.party_one_ac_id == null)
                            recruitment.party_one_ac_id == player.id;
                    }
                    if (playerClass == 'SIN' || playerClass == 'SUM'){
                        recruitment.stealth_count++;
                    }
                    if (playerClass == 'FM' || playerClass == 'DES'){
                        recruitment.ice_count++;
                    }
                    if (playerClass == 'BM' || playerClass == 'BD'){
                        recruitment.hmb_count++;
                    }
                    recruitment.nr_free_spots--;
                    recruitment.nr_taken_spots++;
                } else {
                    //party2 plebs
                    recruitment.party_two.push([player.id, playerClass]);
                    if (playerClass == 'WL' || playerClass == 'WRD'){
                        //sb check
                        recruitment.sb_count++;
                        if (recruitment.party_two_sb_id == null)
                            recruitment.party_two_sb_id == player.id;
                    }
                    if (playerClass == 'SIN' || playerClass == 'KFM'){
                        //bb check
                        recruitment.bb_count++;
                        if (recruitment.party_two_bb_id == null)
                            recruitment.party_two_bb_id == player.id;
                    }
                    if (playerClass == 'GUN' || playerClass == 'ARC'){
                        //ac check
                        recruitment.ac_count++;
                        if (recruitment.party_two_ac_id == null)
                            recruitment.party_two_ac_id == player.id;
                    }
                    if (playerClass == 'SIN' || playerClass == 'SUM'){
                        recruitment.stealth_count++;
                    }
                    if (playerClass == 'FM' || playerClass == 'DES'){
                        recruitment.ice_count++;
                    }
                    if (playerClass == 'BM' || playerClass == 'BD'){
                        recruitment.hmb_count++;
                    }
                    recruitment.nr_free_spots--;
                    recruitment.nr_taken_spots++;
                }
            }

            tankPlayer = {};
            if (recruitment.tank_id == null){
                tankPlayer.user = {};
                tankPlayer.user.username = '-';
                tankPlayer.displayName = '-';
            } else
                tankPlayer = message.channel.guild.members.cache.find(member => member.id == recruitment.tank_id);


            let party1value = 'Be the first one to apply!';
            let party2value = 'Be the first one to apply!';
            let overflowvalue = '';

            if (recruitment.nr_taken_spots > 0){
                party1value = '';
                count = 6;
                if (recruitment.nr_taken_spots < count) count = recruitment.nr_taken_spots;
                for (let i=0; i<count; i++){
                    //console.log(recruitment.party_one[i]);
                    player = message.channel.guild.members.cache.find(member => member.id == recruitment.party_one[i][0]);
                    let playerClass = recruitment.party_one[i][1];
                    classIcon = bot.getClassIcon(playerClass);
                    party1value = party1value + `\n${classIcon}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }
            }
            if (recruitment.nr_taken_spots > 6){
                party2value = '';
                count = 6;
                if (recruitment.nr_taken_spots - 6 < count) count = recruitment.nr_taken_spots - 6;
                for (let i=0; i<count; i++){
                    player = message.channel.guild.members.cache.find(member => member.id == recruitment.party_two[i][0]);
                    let playerClass = recruitment.party_two[i][1];
                    classIcon = bot.getClassIcon(playerClass);
                    party2value = party2value + `\n${classIcon}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }
            }
            if (recruitment.nr_overflow > 0){
                count = recruitment.nr_overflow;
                for (let i=0; i<count; i++){
                    player = message.channel.guild.members.cache.find(member => member.id == recruitment.overflow[i][0]);
                    let playerClass = recruitment.overflow[i][1];
                    classIcon = bot.getClassIcon(playerClass);
                    overflowvalue = overflowvalue + `\n${classIcon}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }
            }

            newEmbed.setTitle(`People needed for ${title}`)
                .setDescription(`Still needed: ${recruitment.nr_free_spots}`)
                .addField('**Party 1:**', party1value, true)
                .setFooter({text: `SB: ${recruitment.sb_count}/${recruitment.nr_of_parties} • BB: ${recruitment.bb_count}/${recruitment.nr_of_parties} • AC: ${recruitment.ac_count}/${recruitment.nr_of_parties} • Tank: ${recruitment.use_nick == false ? tankPlayer.user.username : tankPlayer.displayName} • HMB: ${recruitment.hmb_count}/${recruitment.nr_of_parties} • STEALTH: ${recruitment.stealth_count}/${recruitment.nr_of_parties} • ICE: ${recruitment.ice_count}/${recruitment.nr_of_parties}`});

            if (party2value != 'Be the first one to apply!') newEmbed.addField('**Party 2:**', party2value, true);
            if (overflowvalue != '') newEmbed.addField('**Overflow:**', overflowvalue, false);

            message.channel.send({
                embeds: [
                    newEmbed
                ],
                files: [
                    messageAttachment
                ]
            }).then(async sentMessage => {
                recruitment.message_id = sentMessage.id;
                if (bot.bnsrecendlock == true){
                    while (bot.bnsrecendlock == true){
                        await bot.wait(1000);
                    }
                    bot.bnsrecendlock = true;
                } else {
                    bot.bnsrecendlock = true;
                }
                bot.bnsrecruitments.push(recruitment);
                bot.updateBnsRecruitments();
                await bot.wait(1000);
                bot.bnsrecendlock = false;


                const BD = message.client.emojis.cache.find(emoji => emoji.name === "BD");
                const BM = message.client.emojis.cache.find(emoji => emoji.name === "BM");
                const DES = message.client.emojis.cache.find(emoji => emoji.name === "DES");
                const FM = message.client.emojis.cache.find(emoji => emoji.name === "FM");
                const GUN = message.client.emojis.cache.find(emoji => emoji.name === "GUN");
                const KFM = message.client.emojis.cache.find(emoji => emoji.name === "KFM");
                const SF = message.client.emojis.cache.find(emoji => emoji.name === "SF");
                const SIN = message.client.emojis.cache.find(emoji => emoji.name === "SIN");
                const SUM = message.client.emojis.cache.find(emoji => emoji.name === "SUM");
                const WL = message.client.emojis.cache.find(emoji => emoji.name === "WL");
                const WRD = message.client.emojis.cache.find(emoji => emoji.name === "WRD");
                const ARC = message.client.emojis.cache.find(emoji => emoji.name === "ARC");
                const AST = message.client.emojis.cache.find(emoji => emoji.name === "AST");
                
                sentMessage.react(BD).then(() => 
                sentMessage.react(BM)).then(() =>
                sentMessage.react(DES)).then(() =>
                sentMessage.react(FM)).then(() =>
                sentMessage.react(GUN)).then(() =>
                sentMessage.react(KFM)).then(() =>
                sentMessage.react(SF)).then(() =>
                sentMessage.react(SIN)).then(() =>
                sentMessage.react(SUM)).then(() =>
                sentMessage.react(WL)).then(() =>
                sentMessage.react(WRD)).then(() => 
                sentMessage.react(ARC)).then(() => 
                sentMessage.react(AST)).then(() => console.log('Type A recruitment created successfully!'));
            });
        } else {
            let sbmessage;
            if (recruitment.sb_needed == 0) sbmessage = 'Not needed'
            else sbmessage = `${recruitment.sb_needed} SB needed`
            let bbmessage;
            if (recruitment.bb_needed == 0) bbmessage = 'Not needed'
            else bbmessage = `${recruitment.bb_needed} BB needed`
            let acmessage;
            if (recruitment.ac_needed == 0) acmessage = 'Not needed'
            else acmessage = `${recruitment.ac_needed} AC needed`
            newEmbed.setTitle(`People needed for ${title}`)
                .setDescription(`Still needed: ${recruitment.nr_free_spots}`)
                .addField(`**Soulburns:**`, sbmessage, false)
                .addField(`**Bluebuffs:**`, bbmessage, false)
                .addField(`**Alphacalls:**`, acmessage, false);
            let tankmessage;
            if (recruitment.tank_is_buff) tankmessage = 'Must have a buff'
            else tankmessage = 'Can be any class';
            if (recruitment.tank_needed && recruitment.tank_id==null)
                newEmbed.addField(`**Tank needed!**`, tankmessage, false);
            message.channel.send({
                embeds: [
                    newEmbed
                ],
                files: [
                    messageAttachment
                ]
            }).then(async sentMessage => {
                recruitment.message_id = sentMessage.id;
                if (bot.bnsrecendlock == true){
                    while (bot.bnsrecendlock == true){
                        await bot.wait(1000);
                    }
                    bot.bnsrecendlock = true;
                } else {
                    bot.bnsrecendlock = true;
                }
                bot.bnsrecruitments.push(recruitment);
                bot.updateBnsRecruitments();
                await bot.wait(1000);
                bot.bnsrecendlock = false;

                if (recruitment.sb_needed > 0){ 
                    sbneeded = true 
                } else {
                    sbneeded = false;
                }

                if (recruitment.bb_needed > 0){ 
                    bbneeded = true 
                } else {
                    bbneeded = false;
                }

                if (recruitment.ac_needed > 0){
                    acneeded = true;
                } else {
                    acneeded = false;
                }

                const BD = message.client.emojis.cache.find(emoji => emoji.name === "BD");
                const BM = message.client.emojis.cache.find(emoji => emoji.name === "BM");
                const DES = message.client.emojis.cache.find(emoji => emoji.name === "DES");
                const FM = message.client.emojis.cache.find(emoji => emoji.name === "FM");
                const GUN = message.client.emojis.cache.find(emoji => emoji.name === "GUN");
                const KFM = message.client.emojis.cache.find(emoji => emoji.name === "KFM");
                const SF = message.client.emojis.cache.find(emoji => emoji.name === "SF");
                const SIN = message.client.emojis.cache.find(emoji => emoji.name === "SIN");
                const SUM = message.client.emojis.cache.find(emoji => emoji.name === "SUM");
                const WL = message.client.emojis.cache.find(emoji => emoji.name === "WL");
                const WRD = message.client.emojis.cache.find(emoji => emoji.name === "WRD");
                const ARC = message.client.emojis.cache.find(emoji => emoji.name === "ARC");
                const AST = message.client.emojis.cache.find(emoji => emoji.name === "AST");

                if (sbneeded){
                    sentMessage.react(WL); 
                    sentMessage.react(WRD);
                }
                if (bbneeded){
                    sentMessage.react(KFM);
                    sentMessage.react(SIN);
                }
                if (recruitment.tank_needed)
                    sentMessage.react(BM);
                if (acneeded){
                    sentMessage.react(GUN);
                    sentMessage.react(ARC);
                }
                console.log('Type B recruitment created successfully!');
                
            });
        }

        return 0;   
    }
}