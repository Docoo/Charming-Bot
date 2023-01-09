module.exports={
    name: "bnsend",
    description: "End a recruitment for bns",
    usage: `bnsrecend <messageID/title>`,
    help: `**messageID** : the ID of the message the recruitment is embedded in
            can be used to end a recruitment in any channel on the server
            **title** : the title of the recruitment you are wishing to end
            if the recruitment is in a different channel or there are multiple 
            recruitments with the same title, the messageID will be required`,
    async execute(bot,message,args){
        //if (args[1] == "auto") return;
        //return message.channel.send("Temporarily disabled due to a bug. Please allow the recruitments to expire (you may delete the message) and start a new recruitment.");
        if (args[0] == undefined) return message.channel.send("MessageID/Title missing!");
        bot.updateBnsRecruitments();
        let recruitment = undefined;
        for (index in bot.bnsrecruitments){
            rec = bot.bnsrecruitments[index];
            if (rec.server_id == message.channel.guild.id && rec.channel_id == message.channel.id){
                if (rec.message_id == args[0]){
                    recruitment = rec;
                    console.log(`Recruitment ${recruitment.title} from ${recruitment.server_name} found with ID: ${recruitment.message_id} in bnsend`);
                } else {
                    if (rec.title == args[0]){
                        if (recruitment == undefined){
                            recruitment = rec;
                            console.log(`Recruitment ${recruitment.title} from ${recruitment.server_name} found with title "${rec.title}" in bnsend`);
                        } else {
                            return message.channel.send("Multiple recruitments with this title exist in this channel. Please use messageID instead!");
                        }
                    }
                }
            }
        }
        // if (recruitment == undefined){
        //     for (index in bot.bnsrecruitments){
        //         rec = bot.bnsrecruitments[index];
        //         if (rec.server_id == message.channel.guild.id && rec.message_id == args[0]){
        //             recruitment = rec;
        //             console.log(`Recruitment ${recruitment.title} from ${recruitment.server_name} found with ID: ${recruitment.message_id} in bnsend`);
        //         }
        //     }
        // }

        
        if (recruitment == undefined) return message.channel.send("No recruitment was found!");

        if (bot.bnsrecendlock == true){
            while (bot.bnsrecendlock == true){
                await bot.wait(1000);
            }
            //console.log("right after finding");
            bot.bnsrecendlock = true;
        } else {
            bot.bnsrecendlock = true;
        }
        //console.log("got here");
        
        const Discord = require('discord.js');
        const files = [];
        files.push(new Discord.AttachmentBuilder('./assets/bns_logo.png'))

        if (recruitment.type == 'B'){
            //end type B recruit
            message.guild.channels.cache.get(recruitment.channel_id).messages.fetch(recruitment.message_id)
                .then(fetchedMessage => {
                    //console.log("fetched");
                    newEmbed = Discord.MessageEmbed.from(fetchedMessage.embeds[0].toJSON());
                    //console.log("stole embed");
                    newEmbed.setTitle(`Recruitment ended!`)
                    .setDescription(`Roles were given to:`)
                    .setThumbnail('attachment://bns_logo.png');
                    //console.log("edited embed");
                    fetchedMessage.edit({ embeds: [newEmbed], files: files}).then(editedMessage => {
                        //console.log("sent new embed");
                        editedMessage.reactions.removeAll().then(() => {
                            console.log(`Ended recruitment with id ${recruitment.message_id}, title ${recruitment.title} from server ${editedMessage.guild.name}`);
                            for (i in bot.bnsrecruitments){
                                //console.log(i);
                                let aRec = bot.bnsrecruitments[i];
                                if (aRec.message_id == recruitment.message_id){
                                    bot.bnsrecruitments.splice(i, 1);
                                    console.log(i);
                                    break;
                                }
                            }
                            bot.updateBnsRecruitments();
                            bot.bnsrecendlock = false;
                            return 0;
                        })
                    })
                });
        } else {
            //end type A recruit
            let party1value = '';
            let party2value = '';
            if (recruitment.enforceRoles){
                //treat roles first
                count = 0;
                max = 6;
                if (max > recruitment.nr_max_people) max = recruitment.nr_max_people;
                while (count < max && recruitment.overflow.length > 0){
                    count++;
                    recruitment.party_one.push(recruitment.overflow.shift());
                }
                count = 0;
                max = 6;
                if (max > recruitment.nr_max_people - 6) max = recruitment.nr_max_people - 6;
                while (count < max && recruitment.overflow.length > 0){
                    count++;
                    recruitment.party_two.push(recruitment.overflow.shift());
                }
                for (index in recruitment.party_one){
                    player = recruitment.party_one[index][0];
                    playerClass = recruitment.party_one[index][1];
                    player = message.guild.members.get(player);
                    playerClass = bot.getClassIcon(playerClass);
                    party1value += `\n${playerClass}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }
                for (index in recruitment.party_two){
                    player = recruitment.party_two[index][0];
                    playerClass = recruitment.party_two[index][1];
                    player = message.guild.members.get(player);
                    playerClass = bot.getClassIcon(playerClass);
                    party2value += `\n${playerClass}${recruitment.use_nick == false ? player.user.username : player.displayName}`;
                }
            }
            console.log("type A before fetching message");
            if (!message.guild.me.permissions.has('ADMINISTRATOR')) {
                bot.bnsrecendlock = false;
                return 3;
            }
            //console.log(JSON.stringify(recruitment));
            //message.guild.channels.cache.get(recruitment.channel_id).messages.fetch(recruitment.message_id).then(msg => console.log(msg));
            message.guild.channels.cache.get(recruitment.channel_id).messages.fetch(recruitment.message_id)
                .then(fetchedMessage => {
                    //console.log("fetched");
                    newEmbed = Discord.MessageEmbed.from(fetchedMessage.embeds[0].toJSON());
                    newEmbed.setTitle(`Recruitment ended!`)
                    .setDescription(`The final team is:`)
                    .setThumbnail('attachment://bns_logo.png');
                    //edit teams here

                    if (recruitment.nr_max_people<=6){
                        while (newEmbed.fields.length>1) {
                            newEmbed.fields.splice(1, 1);
                        }
                        if (recruitment.enforceRoles){
                            if (party1value != '') newEmbed.fields[0].value = party1value;
                        }
                    } else { 
                        while (newEmbed.fields.length>2){
                            newEmbed.fields.splice(2, 1);
                        }
                        if (recruitment.enforceRoles){
                            if (party1value != '') newEmbed.fields[0].value = party1value;
                            if (party2value != '') newEmbed.fields[1].value = party2value;
                        }
                    }
                    //console.log(newEmbed);
                    fetchedMessage.edit({ content: `${message.author}, recruitment has been closed!`, embeds: [newEmbed], files: files}).then(editedMessage => {
                        editedMessage.reactions.removeAll().then(() => {
                            console.log(`Ended recruitment with id ${recruitment.message_id}, title ${recruitment.title} from server ${editedMessage.guild.name}`);
                            for (i in bot.bnsrecruitments){
                                //console.log(i);
                                let aRec = bot.bnsrecruitments[i];
                                if (aRec.message_id == recruitment.message_id){
                                    console.log(i);
                                    bot.bnsrecruitments.splice(i, 1);
                                    break;
                                }
                            }
                            bot.updateBnsRecruitments();
                            bot.bnsrecendlock = false;
                            return 0;
                        })
                    })
                })
                .catch(error => {
                    console.log(`Failed fetching message, deleting recruitment instead!`);
                    for (i in bot.bnsrecruitments){
                        //console.log(i);
                        let aRec = bot.bnsrecruitments[i];
                        if (aRec.message_id == recruitment.message_id){
                            console.log(i);
                            bot.bnsrecruitments.splice(i, 1);
                            break;
                        }
                    }
                    bot.updateBnsRecruitments();
                    bot.bnsrecendlock = false;
                    message.channel.send(`Recruitment ended successfully!`);
                });
        }
        return 0;
    }
}
