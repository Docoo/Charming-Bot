module.exports={
    name: 'bnsreactionapplyV2',
    description: 'allows a user to apply to a recruitment post',
    async execute(bot, reaction, user){

        const Discord = require('discord.js');
        const files = []
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
        if (recruitment.type == 'B'){
            playerClass = reaction.emoji.name.toUpperCase();
            if (playerClass == 'WAR') playerClass = 'WRD';
            if (recruitment.party_one_sb_id == user.id || recruitment.party_two_sb_id == user.id || 
                recruitment.party_one_bb_id == user.id || recruitment.party_two_bb_id == user.id ||
                recruitment.party_one_ac_id == user.id || recruitment.party_two_ac_id == user.id ||
                recruitment.tank_id == user.id){
                    reaction.remove(user);
                    bot.bnsremovedreactions.push([recruitment.message_id, user.id, playerClass]);
                    bot.lockedbnsrecruitments.delete(recruitment.message_id);
                    return;
                }
            if (playerClass == 'WL'){
                if (recruitment.sb_needed > 0){
                    if (recruitment.party_one_sb_id == null){
                        recruitment.party_one_sb_id = user.id;
                        recruitment.sb_needed--;
                    } else if (recruitment.party_two_sb_id == null){
                        recruitment.party_two_sb_id = user.id;
                        recruitment.sb_needed--;
                    } else {
                        recruitment.sb_needed = 0;
                        reaction.remove(user);
                        bot.bnsremovedreactions.push([recruitment.message_id, user.id, playerClass]);
                        bot.lockedbnsrecruitments.delete(recruitment.message_id);
                        return;
                    }
                } else {
                    reaction.remove(user);
                    bot.bnsremovedreactions.push([recruitment.message_id, user.id, playerClass]);
                    bot.lockedbnsrecruitments.delete(recruitment.message_id);
                    return;
                }
            }
            if (playerClass == 'WRD'){
                if (recruitment.sb_needed > 0){
                    if (recruitment.party_one_sb_id == null){
                        recruitment.party_one_sb_id = user.id;
                        recruitment.sb_needed--;
                        if (recruitment.tank_needed && recruitment.tank_id == null) {
                            recruitment.tank_id = user.id;
                        }
                    } else if (recruitment.party_two_sb_id == null){
                        recruitment.party_two_sb_id = user.id;
                        recruitment.sb_needed--;
                        if (recruitment.tank_needed && recruitment.tank_id == null) {
                            recruitment.tank_id = user.id;
                        }
                    } else {
                        recruitment.sb_needed = 0;
                        if (recruitment.tank_needed && recruitment.tank_id == null) {
                            recruitment.tank_id = user.id;
                        } else {
                            reaction.remove(user);
                            bot.bnsremovedreactions.push([recruitment.message_id, user.id, playerClass]);
                            bot.lockedbnsrecruitments.delete(recruitment.message_id);
                            return;
                        }
                    }
                } else if (recruitment.tank_needed && recruitment.tank_id == null) {
                    recruitment.tank_id = user.id;
                } else {
                    reaction.remove(user);
                    bot.bnsremovedreactions.push([recruitment.message_id, user.id, playerClass]);
                    bot.lockedbnsrecruitments.delete(recruitment.message_id);
                    return;
                }
            }
            if (playerClass == 'SIN'){
                if (recruitment.bb_needed > 0){
                    if (recruitment.party_one_bb_id == null){
                        recruitment.party_one_bb_id = user.id;
                        recruitment.bb_needed--;
                    } else if (recruitment.party_two_bb_id == null){
                        recruitment.party_two_bb_id = user.id;
                        recruitment.bb_needed--;
                    } else {
                        recruitment.bb_needed = 0;
                        reaction.remove(user);
                        bot.bnsremovedreactions.push([recruitment.message_id, user.id, playerClass]);
                        bot.lockedbnsrecruitments.delete(recruitment.message_id);
                    }
                }
            }
            if (playerClass == 'KFM'){
                if (recruitment.bb_needed > 0){
                    if (recruitment.party_one_bb_id == null){
                        recruitment.party_one_bb_id = user.id;
                        recruitment.bb_needed--;
                        if (recruitment.tank_needed && recruitment.tank_id == null) {
                            recruitment.tank_id = user.id;
                        }
                    } else if (recruitment.party_two_bb_id == null){
                        recruitment.party_two_bb_id = user.id;
                        recruitment.bb_needed--;
                        if (recruitment.tank_needed && recruitment.tank_id == null) {
                            recruitment.tank_id = user.id;
                        }
                    } else {
                        recruitment.bb_needed = 0;
                        if (recruitment.tank_needed && recruitment.tank_id == null) {
                            recruitment.tank_id = user.id;
                        } else {
                            reaction.remove(user);
                            bot.bnsremovedreactions.push([recruitment.message_id, user.id, playerClass]);
                            bot.lockedbnsrecruitments.delete(recruitment.message_id);
                            return;
                        }
                    }
                } else if (recruitment.tank_needed && recruitment.tank_id == null) {
                    recruitment.tank_id = user.id;
                } else {
                    reaction.remove(user);
                    bot.bnsremovedreactions.push([recruitment.message_id, user.id, playerClass]);
                    bot.lockedbnsrecruitments.delete(recruitment.message_id);
                    return;
                }
            }
            if (playerClass == 'BM'){
                if (recruitment.tank_needed && recruitment.tank_id == null) {
                    recruitment.tank_id = user.id;
                } else {
                    reaction.remove(user);
                    bot.bnsremovedreactions.push([recruitment.message_id, user.id, playerClass]);
                    bot.lockedbnsrecruitments.delete(recruitment.message_id);
                    return;
                }
            }
            if (playerClass == 'GUN' || playerClass == 'ARC'){
                if (recruitment.ac_needed > 0){
                    if (recruitment.party_one_ac_id == null){
                        recruitment.party_one_ac_id = user.id;
                        recruitment.ac_needed--;
                    } else if (recruitment.party_two_ac_id == null){
                        recruitment.party_two_ac_id = user.id;
                        recruitment.ac_needed--;
                    } else {
                        recruitment.ac_needed = 0;
                        reaction.remove(user);
                        bot.bnsremovedreactions.push([recruitment.message_id, user.id, playerClass]);
                        bot.lockedbnsrecruitments.delete(recruitment.message_id);
                    }
                }
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
                player = reaction.message.guild.members.get(recruitment.party_two_bb_id)
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
                player = reaction.message.guild.members.get(recruitment.tank_id)
                tankvalue += `${recruitment.use_nick == false ? player.user.username : player.displayName}`;
            } else {
                if (recruitment.tank_needed) tankvalue += `Tank needed!`;
            }
            
            files.push(new Discord.AttachmentBuilder('./assets/bns_logo.png'))
            let newEmbed = Discord.MessageEmbed.from(reaction.message.embeds[0].toJSON())
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
            //console.log(newEmbed);
            return reaction.message.edit({embeds: [newEmbed], files: files}).then(message => console.log(`Edited type B embed with id ${message.id}`));
        } else {
            //resolve A type reaction
            if (recruitment.enforceRoles){
                //role enforcing

                let party1value = '';
                let party2value = '';
                let overflowvalue = '';

                files.push(new Discord.AttachmentBuilder('./assets/bns_logo.png'))
                let newEmbed = Discord.MessageEmbed.from(reaction.message.embeds[0].toJSON())
                    .setThumbnail('attachment://bns_logo.png');
                playerClass = reaction.emoji.name.toUpperCase();
                if (playerClass == 'WAR') playerClass = 'WRD';

                let found = false;
                let found_in_overflow = false;
                let oldPlayerClass = undefined;
                for (index in recruitment.party_one){
                    if (recruitment.party_one[index][0] == user.id){
                        found = true;
                        oldPlayerClass = recruitment.party_one[index][1];
                        if (playerClass == oldPlayerClass){
                            bot.lockedbnsrecruitments.delete(recruitment.message_id);
                            return 3;
                        }
                        recruitment.party_one.splice(index, 1);
                    }
                }
                for (index in recruitment.party_two){
                    if (recruitment.party_two[index][0] == user.id){
                        found = true;
                        oldPlayerClass = recruitment.party_two[index][1];
                        if (playerClass == oldPlayerClass){
                            bot.lockedbnsrecruitments.delete(recruitment.message_id);
                            return 3;
                        }
                        recruitment.party_two.splice(index, 1);
                    }
                }
                for (index in recruitment.overflow){
                    if (recruitment.overflow[index][0] == user.id){
                        found = true;
                        found_in_overflow = true;
                        oldPlayerClass = recruitment.overflow[index][1];
                        if (playerClass == oldPlayerClass){
                            bot.lockedbnsrecruitments.delete(recruitment.message_id);
                            return 3;
                        }
                        recruitment.overflow[index][1] = playerClass;
                    }
                }
                if (found){
                    if (!found_in_overflow){
                        let temp_pt1 = recruitment.party_one;
                        let temp_pt2 = recruitment.party_two;
                        let temp_ovf = recruitment.overflow;
                        type_A_recruitment_reset(recruitment);
                        for (let index in temp_pt1)
                            place_in_party_by_role(bot, reaction, user, recruitment, temp_pt1[index][1], temp_pt1[index][0]);
                        for (let index in temp_pt2)
                            place_in_party_by_role(bot, reaction, user, recruitment, temp_pt2[index][1], temp_pt2[index][0]);
                        place_in_party_by_role(bot, reaction, user, recruitment, playerClass, user.id);
                        for (let index in temp_ovf)
                            place_in_party_by_role(bot, reaction, user, recruitment, temp_ovf[index][1], temp_ovf[index][0]);
                    } else {
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
                    }

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
                    newEmbed.addFields([
                        {   
                            name: '**Party 1:**', 
                            value: party1value,
                            inline: true
                        }
                    ])
                    if (party2value != '')
                        newEmbed.addFields([
                            {   
                                name: '**Party 2:**', 
                                value: party2value,
                                inline: true
                            }
                        ])
                    if (overflowvalue != '')
                        newEmbed.addFields([
                            {   
                                name: '**Overflow:**', 
                                value: overflowvalue,
                                inline: true
                            }
                        ])
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

                    for (let react of reaction.message.reactions[Symbol.iterator]()){
                        if (react[1].emoji.name == oldPlayerClass){
                            react[1].remove(user);
                            bot.bnsremovedreactions.push([recruitment.message_id, user.id, oldPlayerClass]);
                        }
                    }
                    bot.lockedbnsrecruitments.delete(recruitment.message_id);
                    //console.log(newEmbed);
                    reaction.message.edit({embed: [newEmbed], files: files}).then(message => console.log(`Edited type A embed with enforcement with id ${message.id}`));
                    return 0;
                }

                place_in_party_by_role(bot, reaction, user, recruitment, playerClass, user.id);

                for (index in recruitment.party_one){
                    player = reaction.message.guild.members.cache.find(member => member.id == recruitment.party_one[index][0]);
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
                if (party1value == '')
                    party1value = 'Be the first one to apply!';

                newEmbed.fields = [];
                newEmbed.addFields([
                    {   
                        name: '**Party 1:**', 
                        value: party1value,
                        inline: true
                    }
                ])
                if (party2value != '')
                    newEmbed.addFields([
                        {   
                            name: '**Party 2:**', 
                            value: party2value,
                            inline: true
                        }
                    ])
                if (overflowvalue != '')
                    newEmbed.addFields([
                        {   
                            name: '**Overflow:**', 
                            value: overflowvalue,
                            inline: true
                        }
                    ])
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
                //console.log(recruitment);
                reaction.message.edit({embeds: [newEmbed], files: files}).then(message => console.log(`Edited type A embed with enforcement with id ${message.id}`));


            } else {
                //no role enforcing

                let party1value = '';
                let party2value = '';
                let overflowvalue = '';

                files.push(new Discord.AttachmentBuilder('./assets/bns_logo.png'))
                let newEmbed = Discord.MessageEmbed.from(reaction.message.embeds[0].toJSON())
                    .setThumbnail('attachment://bns_logo.png');

                let found = false;
                //console.log("debug: ", recruitment);
                //console.log("\n\n===\n"+reaction.message.embeds[0]);
                for (index in recruitment.party_one){
                    if (recruitment.party_one[index][0] == user.id){
                        playerClass = reaction.emoji.name.toUpperCase();
                        if (playerClass == 'WAR') playerClass = 'WRD';
                        oldPlayerClass = recruitment.party_one[index][1];
                        console.log(`${playerClass}, ${oldPlayerClass}`);
                        if (playerClass == oldPlayerClass){
                            bot.lockedbnsrecruitments.delete(recruitment.message_id);
                            return 3;
                        }
                        recruitment.party_one[index][1] = playerClass;
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
                        found = true;
                    }
                }
                for (index in recruitment.party_two){
                    if (recruitment.party_two[index][0] == user.id){
                        playerClass = reaction.emoji.name.toUpperCase();
                        if (playerClass == 'WAR') playerClass = 'WRD';
                        oldPlayerClass = recruitment.party_two[index][1];
                        if (playerClass == oldPlayerClass){
                            bot.lockedbnsrecruitments.delete(recruitment.message_id);
                            return 3;
                        }
                        recruitment.party_two[index][1] = playerClass;
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
                        found = true;
                    }
                }
                for (index in recruitment.overflow){
                    if (recruitment.overflow[index][0] == user.id){
                        playerClass = reaction.emoji.name.toUpperCase();
                        if (playerClass == 'WAR') playerClass = 'WRD';
                        oldPlayerClass = recruitment.overflow[index][1];
                        if (playerClass == oldPlayerClass){
                            bot.lockedbnsrecruitments.delete(recruitment.message_id);
                            return 3;
                        }
                        recruitment.overflow[index][1] = playerClass;
                        found = true;
                    }
                }
                if (found){


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
                    newEmbed.addFields([
                        {   
                            name: '**Party 1:**', 
                            value: party1value,
                            inline: true
                        }
                    ])
                    if (party2value != '')
                        newEmbed.addFields([
                            {   
                                name: '**Party 2:**', 
                                value: party2value,
                                inline: true
                            }
                        ])
                    if (overflowvalue != '')
                        newEmbed.addFields([
                            {   
                                name: '**Overflow:**', 
                                value: overflowvalue,
                                inline: true
                            }
                        ])

                    //console.log(newEmbed);

                    tankPlayer = {};
                    if (recruitment.tank_id == null){
                        tankPlayer.user = {};
                        tankPlayer.user.username = '-';
                        tankPlayer.displayName = '-';
                    } else
                        tankPlayer = reaction.message.channel.guild.members.cache.find(member => member.id == recruitment.tank_id);
                        
                    newEmbed.setFooter({text: `SB: ${recruitment.sb_count}/${recruitment.nr_of_parties} • BB: ${recruitment.bb_count}/${recruitment.nr_of_parties} • AC: ${recruitment.ac_count}/${recruitment.nr_of_parties} • Tank: ${recruitment.use_nick == false ? tankPlayer.user.username : tankPlayer.displayName} • HMB: ${recruitment.hmb_count}/${recruitment.nr_of_parties} • STEALTH: ${recruitment.stealth_count}/${recruitment.nr_of_parties} • ICE: ${recruitment.ice_count}/${recruitment.nr_of_parties}`});
                    reaction.message.edit({embeds: [newEmbed], files: files}).then(message => console.log(`Edited type A embed, no enforcement with id ${message.id}`));

                    bot.updateBnsRecruitments();
                    for (let react of reaction.message.reactions[Symbol.iterator]()){
                        if (react[1].emoji.name == oldPlayerClass){
                            react[1].remove(user);
                            bot.bnsremovedreactions.push([recruitment.message_id, user.id, oldPlayerClass]);
                        }
                    }
                    bot.lockedbnsrecruitments.delete(recruitment.message_id);

                    return 0;
                }

                if (recruitment.nr_free_spots > 0 && recruitment.nr_taken_spots < 6){
                    //put nibba in pt1
                    playerClass = reaction.emoji.name.toUpperCase();
                    if (playerClass == 'WAR') playerClass = 'WRD';
                    recruitment.party_one.push([user.id, playerClass]);
                    recruitment.nr_free_spots--;
                    recruitment.nr_taken_spots++;
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
                } else if (recruitment.nr_free_spots > 0 && recruitment.nr_taken_spots >= 6){
                    //put nibba in pt2
                    playerClass = reaction.emoji.name.toUpperCase();
                    if (playerClass == 'WAR') playerClass = 'WRD';
                    recruitment.party_two.push([user.id, playerClass]);
                    recruitment.nr_free_spots--;
                    recruitment.nr_taken_spots++;
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
                    //put nibba in overflow
                    playerClass = reaction.emoji.name.toUpperCase();
                    if (playerClass == 'WAR') playerClass = 'WRD';
                    recruitment.overflow.push([user.id, playerClass]);
                    recruitment.nr_overflow++;
                }

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
                newEmbed.addFields([
                    {   
                        name: '**Party 1:**', 
                        value: party1value,
                        inline: true
                    }
                ])
                if (party2value != '')
                    newEmbed.addFields([
                        {   
                            name: '**Party 2:**', 
                            value: party2value,
                            inline: true
                        }
                    ])
                if (overflowvalue != '')
                    newEmbed.addFields([
                        {   
                            name: '**Overflow:**', 
                            value: overflowvalue,
                            inline: true
                        }
                    ])

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
                //console.log(newEmbed);
                reaction.message.edit({embeds: [newEmbed], files: files}).then(message => console.log(`Edited type A embed, no enforcement with id ${message.id}`));

            }
        }
        bot.lockedbnsrecruitments.delete(recruitment.message_id);
        console.log("here at the end");
        return 0;
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
                recruitment.nr_overflow++;
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
