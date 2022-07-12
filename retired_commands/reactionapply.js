module.exports = {
    name: 'reactionapply',
    description: 'allows a user to apply to a recruitment post',
    execute(bot, reaction, user){
        let ok = true;
        const Discord = require('discord.js');
        const fs = require('fs');
        //delete require.cache[require.resolve('./../../bnssrctrack.json')];
        //const bnssrcTrackIDs = require('./../../bnssrctrack.json');
        const bnssrcTrackIDs = JSON.parse(fs.readFileSync('./bnssrctrack.json', 'utf8'));
	    var trackedIDs = bnssrcTrackIDs.id.toString().split(',');
    	if (trackedIDs.indexOf(reaction.message.id) == -1) return; //reaction.message.channel.send(reaction.message.id); 580595641525338142 169525036305219585
	    var oldEmbed = reaction.message.embeds[0];
        var list = oldEmbed.description.split(" ");
        let userlist = oldEmbed.fields;
        for (let i=0; i<oldEmbed.fields.length; i++){
            let newEmbed = new Discord.MessageEmbed(oldEmbed);
            let data = oldEmbed.fields[i].value.split('\n');
            data.forEach(element => {
                if (element.indexOf(`${user.username}`) != -1){
                    element = `${reaction.emoji.toString()}${user.username}`;
                    //console.log(element);
                    newValue = '';
                    data.forEach(elem => {
                        if (elem.indexOf(`${user.username}`) == -1) {
                            newValue = newValue + '\n' + elem
                        } else {
                            newValue = newValue + '\n' + element
                        }
                    });
                    newEmbed.fields[i].value = newValue;
                    reaction.message.edit({embeds: [newEmbed]});
                    //console.log("reached new embed");
                    //console.log(newValue);
                    reaction.message.reactions.forEach(react => {
                        if (react.emoji != reaction.emoji){
                            react.remove(user);
                        }
                    })
                    //reaction.remove(user).catch(console.error);
                    ok = false;
                    return;
                }
            })
        }
        userlist.forEach(element => {
            if (`${element.name}` === `${user.username}`){
                reaction.remove(user).catch(console.error);
                ok = false;
                return;
            }
        });
        if (!ok) return;
	    var required = parseInt(list[1]);
	    if (required == 0) {
            //reaction.remove(user).catch(console.error);
            ok = false;
            let newEmbed = new Discord.MessageEmbed(oldEmbed);
            if (newEmbed.fields.length == 3){
                // two parties + overflow
                let data = newEmbed.fields[2].value;
                data = data + `\n${reaction.emoji.toString()}${user.username}`;
                newEmbed.fields[2].value = data;
            } else if (newEmbed.fields.length == 2) {
                // one party + overflow OR two parties
                if (newEmbed.fields[1].name == 'Overflow:'){
                    let data = newEmbed.fields[1].value;
                    data = data + `\n${reaction.emoji.toString()}${user.username}`;
                    newEmbed.fields[1].value = data;
                } else {
                    newEmbed.addField('Overflow:', `${reaction.emoji.toString()}${user.username}\n`, false);
                }
            } else if (newEmbed.fields.length == 1){
                newEmbed.addField('Overflow:', `${reaction.emoji.toString()}${user.username}\n`, false);
            }
            reaction.message.edit({embeds: [newEmbed]});
            return;
        }
        if (ok) {
            required--;
            console.log(ok);
    	    var newDescription = list[0] + " " + required.toString();
	        if ((oldEmbed.fields.length == 1) || (oldEmbed.fields.length == 2 && required >= 6) ) {	
                var newEmbed = new Discord.MessageEmbed(oldEmbed);
                let data = newEmbed.fields[0].value;
                if (data == 'Empty!') {
                    data = `${reaction.emoji.toString()}${user.username}`;
                } else {
                    data = data + `\n${reaction.emoji.toString()}${user.username}`;
                }
                newEmbed.fields[0].value = data;
                newEmbed.description = newDescription;
    		    reaction.message.edit({embeds: [newEmbed]});
	        } else {
                var newEmbed = new Discord.MessageEmbed(oldEmbed);
                let data = newEmbed.fields[1].value;
                if (data == 'Empty!') {
                    data = `${reaction.emoji.toString()}${user.username}`;
                } else {
                    data = data + `\n${reaction.emoji.toString()}${user.username}`;
                }
		        newEmbed.fields[1].value = data;
                newEmbed.description = newDescription;
		        reaction.message.edit({embeds: [newEmbed]});
            }
        }
    }
}