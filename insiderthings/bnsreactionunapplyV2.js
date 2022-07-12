module.exports={
    name: 'bnsreactionunapplyV2',
    description: 'allows a user to unapply from a recruitment post',
    async execute(bot, reaction, user){

        const Discord = require('discord.js');
        const files = [];
        files.push(new Discord.MessageAttachment('./assets/bns_logo.png'))
        let recruitment = undefined;
        for (index in bot.bnsrecruitments){
            rec = bot.bnsrecruitments[index];
            if (rec.message_id == reaction.message.id){
                recruitment = rec;
            }
        }
        if (recruitment == undefined) return 0;
        if (!(reaction.emoji.name.toUpperCase() in bot.gameClasses)) return 0;

        while (recruitment.message_id in bot.lockedbnsrecruitments){
            await sleep(1000);
        };
        bot.lockedbnsrecruitments.set(recruitment.message_id, "locked");
        console.log(bot.bnsremovedreactions);

        let detected = false;
        let position = -1;
        for (let index of bot.bnsremovedreactions){
            if (index[0] == recruitment.message_id &&
                index[1] == user.id &&
                index[2] == reaction.emoji.name.toUpperCase()){
                    detected = true;
                    position = index;
            }
        }
        if (detected){
            console.log('Automatic reaction removal detected!');
            //console.log(bot.bnsremovedreactions);
            bot.bnsremovedreactions.splice(position, 1);
            bot.lockedbnsrecruitments.delete(recruitment.message_id);
            return 1;
        }

        if (recruitment.type == 'B'){
            if (recruitment.party_one_sb_id == user.id){
                recruitment.party_one_sb_id = null;
                recruitment.sb_needed++;
            }
            if (recruitment.party_two_sb_id == user.id){
                recruitment.party_two_sb_id = null;
                recruitment.sb_needed++;
            }
            if (recruitment.party_one_bb_id == user.id){
                recruitment.party_one_bb_id = null;
                recruitment.bb_needed++;
            }
            if (recruitment.party_two_bb_id == user.id){
                recruitment.party_two_bb_id = null;
                recruitment.bb_needed++;
            }
            if (recruitment.party_one_ac_id == user.id){
                recruitment.party_one_ac_id = null; 
                recruitment.ac_needed++;
            }
            if (recruitment.party_two_ac_id == user.id){
                recruitment.party_two_ac_id = null;
                recruitment.ac_needed++;
            }
            if (recruitment.tank_id == user.id){
                recruitment.tank_id = null;
                recruitment.tank_needed = true;
            }

            sbvalue = '';
            bbvalue = '';
            acvalue = '';
            tankvalue = '';
            if (recruitment.party_one_sb_id != null){
                player = reaction.message.guild.members.get(recruitment.party_one_sb_id);
                sbvalue += `\n${recruitment.use_nick == false ? player.user.username : player.displayName}`;
            }
            if (recruitment.party_two_sb_id != null){
                player = reaction.message.guild.members.get(recruitment.party_two_sb_id);
                sbvalue += `\n${recruitment.use_nick == false ? player.user.username : player.displayName}`;
            }
            if (recruitment.sb_needed > 0){
                sbvalue += `\nSoulburn needed!`;
            }
            if (recruitment.party_one_bb_id != null){
                player = reaction.message.guild.members.get(recruitment.party_one_bb_id);
                bbvalue += `\n${recruitment.use_nick == false ? player.user.username : player.displayName}`;
            }
            if (recruitment.party_two_bb_id != null){
                player = reaction.message.guild.members.get(recruitment.party_two_bb_id);
                bbvalue += `\n${recruitment.use_nick == false ? player.user.username : player.displayName}`;
            }
            if (recruitment.bb_needed > 0){
                bbvalue += `\nBluebuff needed!`;
            }
            if (recruitment.party_one_ac_id != null){
                player = reaction.message.guild.members.get(recruitment.party_one_ac_id);
                acvalue += `\n${recruitment.use_nick == false ? player.user.username : player.displayName}`;
            }
            if (recruitment.party_two_ac_id != null){
                player = reaction.message.guild.members.get(recruitment.party_two_ac_id);
                acvalue += `\n${recruitment.use_nick == false ? player.user.username : player.displayName}`;
            }
            if (recruitment.ac_needed > 0){
                acvalue += `\nAlphacall needed!`;
            }
            if (recruitment.tank_needed && recruitment.tank_id != null){
                player = reaction.message.guild.members.get(recruitment.tank_id);
                tankvalue += `${recruitment.use_nick == false ? player.user.username : player.displayName}`;
            } else {
                if (recruitment.tank_needed) tankvalue += `Tank needed!`;
            }
            
            let newEmbed = new Discord.MessageEmbed(reaction.message.embeds[0])
            .setThumbnail('attachment://bns_logo.png');
            if (sbvalue != ''){
                newEmbed.fields[0].value = sbvalue;
            }
            if (bbvalue != ''){
                newEmbed.fields[1].value = bbvalue;
            }
            if (acvalue != ''){
                newEmbed.fields[2].value = acvalue;
            }
            if (tankvalue != ''){
                newEmbed.fields[3].value = tankvalue;
            }
            bot.updateBnsRecruitments();
            bot.lockedbnsrecruitments.delete(recruitment.message_id);
            return reaction.message.edit({embeds: [newEmbed], files: files}).then(message => console.log(`Edited type B embed with id ${message.id}`));

        } else {
            //treat type A reaction removal
            if (recruitment.enforceRoles){
                //type A with enforcement
                let party1value = '';
                let party2value = '';
                let overflowvalue = '';

                let newEmbed = new Discord.MessageEmbed(reaction.message.embeds[0])
                .setThumbnail('attachment://bns_logo.png');
                playerClass = reaction.emoji.name.toUpperCase();
                if (playerClass == 'WAR') playerClass = 'WRD';


                for (index in recruitment.party_one){
                    if (recruitment.party_one[index][0] == user.id){
                        recruitment.party_one.splice(index, 1);
                    }
                }
                for (index in recruitment.party_two){
                    if (recruitment.party_two[index][0] == user.id){
                        recruitment.party_two.splice(index,1);
                    }
                }
                for (index in recruitment.overflow){
                    if (recruitment.overflow[index][0] == user.id){
                        recruitment.overflow.splice(index,1);
                        recruitment.nr_overflow--;
                    }
                }
                let temp_pt1 = recruitment.party_one;
                let temp_pt2 = recruitment.party_two;
                let temp_ovf = recruitment.overflow;
                type_A_recruitment_reset(recruitment);
                for (let index in temp_pt1)
                    place_in_party_by_role(bot, reaction, user, recruitment, temp_pt1[index][1], temp_pt1[index][0]);
                for (let index in temp_pt2)
                    place_in_party_by_role(bot, reaction, user, recruitment, temp_pt2[index][1], temp_pt2[index][0]);
                for (let index in temp_ovf)
                    place_in_party_by_role(bot, reaction, user, recruitment, temp_ovf[index][1], temp_ovf[index][0]);

                for (index in recruitment.party_one){
                    player = reaction.message.guild.members.cache.find(member => member.id == recruitment.party_one[index][0]);
                    playerClassIcon = bot.getClassIcon(recruitment.party_one[index][1]);
                    party1value += `\n${playerClassIcon}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }
                for (index in recruitment.party_two){
                    player = reaction.message.guild.members.cache.find(member => member.id == recruitment.party_two[index][0]);
                    playerClassIcon = bot.getClassIcon(recruitment.party_two[index][1]);
                    party2value += `\n${playerClassIcon}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }
                for (index in recruitment.overflow){
                    player = reaction.message.guild.members.cache.find(member => member.id == recruitment.overflow[index][0]);
                    playerClassIcon = bot.getClassIcon(recruitment.overflow[index][1]);
                    overflowvalue += `\n${playerClassIcon}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }
                if (party1value == '')
                    party1value = 'Be the first one to apply!';    

                newEmbed.fields = [];
                newEmbed.addField('**Party 1:**', party1value, true);
                if (party2value != '')
                    newEmbed.addField('**Party 2:**', party2value, true);
                if (overflowvalue != '')
                    newEmbed.addField('**Overflow:**', overflowvalue, false);
                tankPlayer = {};
                if (recruitment.tank_id == null){
                    tankPlayer.user = {};
                    tankPlayer.user.username = '-';
                    tankPlayer.displayName = '-';
                } else
                    tankPlayer = reaction.message.channel.guild.members.cache.find(member => member.id == recruitment.tank_id);
    
                newEmbed.setDescription(`Still needed: ${recruitment.nr_free_spots}`)
                .setFooter({text: `SB: ${recruitment.sb_count}/${recruitment.nr_of_parties} • BB: ${recruitment.bb_count}/${recruitment.nr_of_parties} • AC: ${recruitment.ac_count}/${recruitment.nr_of_parties} • Tank: ${recruitment.use_nick == false ? tankPlayer.user.username : tankPlayer.displayName} • HMB: ${recruitment.hmb_count}/${recruitment.nr_of_parties} • STEALTH: ${recruitment.stealth_count}/${recruitment.nr_of_parties} • ICE: ${recruitment.ice_count}/${recruitment.nr_of_parties}`});
                bot.updateBnsRecruitments();
                bot.lockedbnsrecruitments.delete(recruitment.message_id);
                reaction.message.edit({embeds: [newEmbed], files: files}).then(message => console.log(`Edited type A embed with enforcement with id ${message.id}`));
                return 0;


            } else {
                //type A without enforcement
                //console.log("debug: ", recruitment);
                for (index in recruitment.party_one){
                    if (recruitment.party_one[index][0] == user.id){
                        oldPlayerClass = recruitment.party_one[index][1];
                        if (oldPlayerClass == 'WRD' || oldPlayerClass == 'WL'){
                            recruitment.sb_count--;
                        }
                        if (oldPlayerClass == 'KFM' || oldPlayerClass == 'SIN'){
                            recruitment.bb_count--;
                        }
                        if (oldPlayerClass == 'GUN' || oldPlayerClass == 'ARC'){
                            recruitment.ac_count--;
                        }
                        if (oldPlayerClass == 'SIN' || oldPlayerClass == 'SUM'){
                            recruitment.stealth_count--;
                        }
                        if (oldPlayerClass == 'FM' || oldPlayerClass == 'DES'){
                            recruitment.ice_count--;
                        }
                        if (oldPlayerClass == 'BM' || oldPlayerClass == 'BD'){
                            recruitment.hmb_count--;
                        }
                        if (recruitment.nr_overflow > 0 || recruitment.overflow.length > 0) {
                            recruitment.party_one[index] = recruitment.overflow.shift();
                            recruitment.nr_overflow--;
                            playerClass = recruitment.party_one[index][1];
                            if (playerClass == 'WRD' || playerClass == 'WL'){
                                recruitment.sb_count++;
                            }
                            if (playerClass == 'KFM' || playerClass == 'SIN'){
                                recruitment.bb_count++;
                            }
                            if (playerClass == 'GUN' || playerClass == 'ARC'){
                                recruitment.ac_count++;
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
                        } else if (recruitment.party_two.length > 0){
                            recruitment.party_one[index] = recruitment.party_two.splice(0,1)[0];
                            recruitment.nr_taken_spots--;
                            recruitment.nr_free_spots++;
                        } else {
                            recruitment.party_one.splice(index,1);
                            recruitment.nr_taken_spots--;
                            recruitment.nr_free_spots++;
                        }
                    }
                }
                for (index in recruitment.party_two){
                    if (recruitment.party_two[index][0] == user.id){
                        oldPlayerClass = recruitment.party_two[index][1];
                        if (oldPlayerClass == 'WRD' || oldPlayerClass == 'WL'){
                            recruitment.sb_count--;
                        }
                        if (oldPlayerClass == 'KFM' || oldPlayerClass == 'SIN'){
                            recruitment.bb_count--;
                        }
                        if (oldPlayerClass == 'GUN' || oldPlayerClass == 'ARC'){
                            recruitment.ac_count--;
                        }
                        if (oldPlayerClass == 'SIN' || oldPlayerClass == 'SUM'){
                            recruitment.stealth_count--;
                        }
                        if (oldPlayerClass == 'FM' || oldPlayerClass == 'DES'){
                            recruitment.ice_count--;
                        }
                        if (oldPlayerClass == 'BM' || oldPlayerClass == 'BD'){
                            recruitment.hmb_count--;
                        }
                        if (recruitment.nr_overflow > 0 || recruitment.overflow.length > 0) {
                            recruitment.party_two[index] = recruitment.overflow.shift();
                            recruitment.nr_overflow--;
                            playerClass = recruitment.party_two[index][1];
                            if (playerClass == 'WRD' || playerClass == 'WL'){
                                recruitment.sb_count++;
                            }
                            if (playerClass == 'KFM' || playerClass == 'SIN'){
                                recruitment.bb_count++;
                            }
                            if (playerClass == 'GUN' || playerClass == 'ARC'){
                                recruitment.ac_count++;
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
                        } else {
                            recruitment.party_two.splice(index,1);
                            recruitment.nr_taken_spots--;
                            recruitment.nr_free_spots++;
                        }
                    }
                }
                for (index in recruitment.overflow){
                    if (recruitment.overflow[index][0] == user.id){
                        recruitment.overflow.splice(index,1);
                        recruitment.nr_overflow--;
                    }
                }

                let party1value = '';
                let party2value = '';
                let overflowvalue = '';

                let newEmbed = new Discord.MessageEmbed(reaction.message.embeds[0])
                .setThumbnail('attachment://bns_logo.png');
                //console.log(recruitment.party_one);
                for (index in recruitment.party_one){
                    //console.log(index, ", ", recruitment.party_one[index]);
                    player = reaction.message.guild.members.get(recruitment.party_one[index][0]);
                    playerClass = bot.getClassIcon(recruitment.party_one[index][1]);
                    party1value += `\n${playerClass}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }
                for (index in recruitment.party_two){
                    player = reaction.message.guild.members.cache.find(member => member.id == recruitment.party_two[index][0]);
                    playerClass = bot.getClassIcon(recruitment.party_two[index][1]);
                    party2value += `\n${playerClass}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }
                for (index in recruitment.overflow){
                    player = reaction.message.guild.members.cache.find(member => member.id == recruitment.overflow[index][0]);
                    playerClass = bot.getClassIcon(recruitment.overflow[index][1]);
                    overflowvalue += `\n${playerClass}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }

                newEmbed.fields = [];
                if (party1value == '')
                    newEmbed.addField('**Party 1:**', 'Be the first one to apply!', true)
                else
                    newEmbed.addField('**Party 1:**', party1value, true);
                if (party2value != '')
                    newEmbed.addField('**Party 2:**', party2value, true);
                if (overflowvalue != '')
                    newEmbed.addField('**Overflow:**', overflowvalue, true);

                tankPlayer = {};
                if (recruitment.tank_id == null){
                    tankPlayer.user = {};
                    tankPlayer.user.username = '-';
                    tankPlayer.displayName = '-';
                } else
                    tankPlayer = reaction.message.channel.guild.members.cache.find(member => member.id == recruitment.tank_id);
    
                newEmbed.setDescription(`Still needed: ${recruitment.nr_free_spots}`)
                .setFooter({text: `SB: ${recruitment.sb_count}/${recruitment.nr_of_parties} • BB: ${recruitment.bb_count}/${recruitment.nr_of_parties} • AC: ${recruitment.ac_count}/${recruitment.nr_of_parties} • Tank: ${recruitment.use_nick == false ? tankPlayer.user.username : tankPlayer.displayName} • HMB: ${recruitment.hmb_count}/${recruitment.nr_of_parties} • STEALTH: ${recruitment.stealth_count}/${recruitment.nr_of_parties} • ICE: ${recruitment.ice_count}/${recruitment.nr_of_parties}`});
                bot.updateBnsRecruitments();
                bot.lockedbnsrecruitments.delete(recruitment.message_id);
                reaction.message.edit({embeds: [newEmbed], files: files}).then(message => console.log(`Edited type A embed, no enforcement with id ${message.id}`));
                return 0;
            }
        }
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


//place someone in a recruitment with role enforcing
function place_in_party_by_role(bot, reaction, user, recruitment, playerClass, playerID){
    if (recruitment.nr_free_spots == 0){
        console.log(`no free spots`);
        recruitment.overflow.push([playerID, playerClass]);
        recruitment.nr_overflow++;
    }
    else if (recruitment.tank_id == null && (playerClass == 'BM' || playerClass == 'WRD' || playerClass == 'KFM')){
        console.log(`tank`);
        recruitment.tank_id = playerID;
        recruitment.nr_free_spots--;
        recruitment.nr_taken_spots++;
        recruitment.party_one.push([playerID, playerClass]);
        if (playerClass == 'WRD' && recruitment.party_one_sb_id == null){
            recruitment.party_one_sb_id = playerID;
            recruitment.sb_count++;
        }
        if (playerClass == 'KFM' && recruitment.party_one_bb_id == null){
            recruitment.party_one_bb_id = playerID;
            recruitment.bb_count++;
        }
        if (playerClass == 'BM'){
            recruitment.hmb_count++;
        }
    }
    else if (recruitment.party_one_sb_id == null && (playerClass == 'WRD' || playerClass == 'WL')){
        console.log(`pt 1 sb`);
        recruitment.party_one_sb_id = playerID;
        recruitment.sb_count++;
        recruitment.party_one.push([playerID, playerClass]);
        recruitment.nr_free_spots--;
        recruitment.nr_taken_spots++;
    }
    else if (recruitment.party_one_bb_id == null && (playerClass == 'KFM' || playerClass == 'SIN')){
        console.log(`pt 1 bb`);
        recruitment.party_one_bb_id = playerID;
        recruitment.bb_count++;
        recruitment.party_one.push([playerID, playerClass]);
        recruitment.nr_free_spots--;
        recruitment.nr_taken_spots++;
        if (playerClass == 'SIN'){
            recruitment.stealth_count++;
        }
    }
    else if (recruitment.party_one_ac_id == null && (playerClass == 'GUN' || playerClass == 'ARC')){
        console.log(`pt 1 ac`);
        recruitment.party_one_ac_id = playerID;
        recruitment.ac_count++;
        recruitment.party_one.push([playerID, playerClass]);
        recruitment.nr_free_spots--;
        recruitment.nr_taken_spots++;
    }
    else if (recruitment.party_two_sb_id == null && (playerClass == 'WRD' || playerClass == 'WL')){
        console.log(`pt 2 sb`);
        recruitment.party_two_sb_id = playerID;
        recruitment.sb_count++;
        recruitment.party_two.push([playerID, playerClass]);
        recruitment.nr_free_spots--;
        recruitment.nr_taken_spots++;
    }
    else if (recruitment.party_two_bb_id == null && (playerClass == 'KFM' || playerClass == 'SIN')){
        console.log(`pt 2 bb`);
        recruitment.party_two_bb_id = playerID;
        recruitment.bb_count++;
        recruitment.party_two.push([playerID, playerClass]);
        recruitment.nr_free_spots--;
        recruitment.nr_taken_spots++;
        if (playerClass == 'SIN'){
            recruitment.stealth_count++;
        }
    }
    else if (recruitment.party_two_ac_id == null && playerClass == 'GUN' || playerClass == 'ARC'){
        console.log(`pt 2 ac`);
        recruitment.party_two_ac_id = playerID;
        recruitment.ac_count++;
        recruitment.party_two.push([playerID, playerClass]);
        recruitment.nr_free_spots--;
        recruitment.nr_taken_spots++;
    }
    else{
        console.log(`not a buff or buff not needed`);
        let free = 6;
        if (recruitment.nr_max_people < free) free = recruitment.nr_max_people;
        free -= recruitment.party_one.length;
        if (recruitment.tank_id == null) free--;
        if (recruitment.party_one_sb_id == null) free--;
        if (recruitment.party_one_bb_id == null) free--;
        if (recruitment.party_one_ac_id == null) free--;
        if (free > 0){
            console.log('pt 1 dps');
            recruitment.party_one.push([playerID, playerClass]);
            recruitment.nr_free_spots--;
            recruitment.nr_taken_spots++;
            if (playerClass == 'SIN' || playerClass == 'SUM'){
                recruitment.stealth_count++;
            }
            if (playerClass == 'FM' || playerClass == 'DES'){
                recruitment.ice_count++;
            }
            if (playerClass == 'BM' || playerClass == 'BD'){
                recruitment.hmb_count++;
            }
        } else {
            free = 6;
            if (recruitment.nr_max_people-6 < free) free = recruitment.nr_max_people-6;
            free -= recruitment.party_two.length;
            if (recruitment.party_two_sb_id == null) free--;
            if (recruitment.party_two_bb_id == null) free--;
            if (recruitment.party_two_ac_id == null) free--;
            if (free > 0){
                console.log(`pt 2 dps`);
                recruitment.party_two.push([playerID, playerClass]);
                recruitment.nr_free_spots--;
                recruitment.nr_taken_spots++;
                if (playerClass == 'SIN' || playerClass == 'SUM'){
                    recruitment.stealth_count++;
                }
                if (playerClass == 'FM' || playerClass == 'DES'){
                    recruitment.ice_count++;
                }
                if (playerClass == 'BM' || playerClass == 'BD'){
                    recruitment.hmb_count++;
                }
            } else {
                console.log(`overflow`);
                recruitment.overflow.push([playerID, playerClass]);
            }
        }
    }
}

function type_A_recruitment_reset(recruitment){
    recruitment.nr_free_spots = recruitment.nr_max_people;
    recruitment.nr_taken_spots = 0;
    recruitment.nr_overflow = 0;
    recruitment.sb_count = 0;
    recruitment.bb_count = 0;
    recruitment.ac_count = 0;
    recruitment.stealth_count = 0;
    recruitment.hmb_count = 0;
    recruitment.ice_count = 0;
    recruitment.tank_id = null;
    recruitment.party_one_sb_id = null;
    recruitment.party_one_bb_id = null;
    recruitment.party_one_ac_id = null;
    recruitment.party_one = [];
    recruitment.party_two_sb_id = null;
    recruitment.party_two_bb_id = null;
    recruitment.party_two_ac_id = null;
    recruitment.party_two = [];
    recruitment.overflow = [];
}
