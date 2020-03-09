module.exports = {
    name: 'reactionunapply',
    description: 'allows a user to withdraw from a recruitment post',
    execute(bot, reaction, user){
		const Discord = require('discord.js');
		const fs = require('fs');
        //delete require.cache[require.resolve('./../../bnssrctrack.json')];
		//const bnssrcTrackIDs = require('./../../bnssrctrack.json');
        const bnssrcTrackIDs = JSON.parse(fs.readFileSync('./bnssrctrack.json', 'utf8'));
    	var trackedIDs = bnssrcTrackIDs.id.toString().split(',');
    	if (trackedIDs.indexOf(reaction.message.id) == -1 && user.id === "169525036305219585") return; //reaction.message.channel.send(reaction.message.id);
    	var oldEmbed = reaction.message.embeds[0];
    	var list = oldEmbed.description.split(" ");
    	var required = parseInt(list[1]);
		var newDescription;
		let newEmbed = new Discord.RichEmbed(oldEmbed);
		/*
    	if (oldEmbed.fields.length == 1) {
		    let field = oldEmbed.fields[0];
		    if (field.name === user.username && field.value === reaction.emoji.toString()){	
    			required++;
			    newDescription = list[0] + " " + required.toString();
			    var newEmbed = new Discord.RichEmbed({
    				title: oldEmbed.title,
				    description: newDescription
			    });
			    newEmbed.addField("Empty list", "Be the first one to apply!");
			    reaction.message.edit(newEmbed);
		    }
	    } else {
    		var newEmbed = new Discord.RichEmbed({
			    title: oldEmbed.title
		    });
		    oldEmbed.fields.forEach(field => {
    			if (field.name === user.username && field.value === reaction.emoji.toString()){
				    required++;
			    }
			    else {
    				newEmbed.addField(field.name, field.value);
			    }
		    })
		    if (newEmbed.fields.length == 0) {
    			newEmbed.addField("Empty list", "Be the first one to apply!");
		    }
		    var newDescription = list[0] + " " + required.toString();
		    newEmbed.setDescription(newDescription);
		    reaction.message.edit(newEmbed);
		}
		*/
		if (oldEmbed.fields.length == 1){
			// one party, no overflow
			let data = newEmbed.fields[0].value;
			if (data.includes(`${reaction.emoji.toString()}${user.username}`)){
				data = data.replace(`${reaction.emoji.toString()}${user.username}`, '');
				data = data.replace('\n\n', '\n');
				required = required+1;
				newDescription = list[0] + ' ' + required;
				newEmbed.setDescription(newDescription);
				if (data == '') data = 'Empty!';
				newEmbed.fields[0].value = data;
				reaction.message.edit(newEmbed);
				console.log('returning p1/1');
			} else {
				console.log('returning out of 1p');
			}
		} else if (oldEmbed.fields.length == 2){
			//two parties, no overflow OR one party plus overflow
			if (newEmbed.fields[1].name == 'Party2'){
				let data = newEmbed.fields[0].value;
				if (data.includes(`${reaction.emoji.toString()}${user.username}`)){
					data = data.replace(`${reaction.emoji.toString()}${user.username}`, '');
					data = data.replace('\n\n', '\n');
					required = required+1;
					newDescription = list[0] + ' ' + required;
					newEmbed.setDescription(newDescription);
					if (data == '') data = 'Empty!';
					newEmbed.fields[0].value = data;
					reaction.message.edit(newEmbed);
					console.log('returning p1 no of');
				} else {
					data = newEmbed.fields[1].value;
					if (data.includes(`${reaction.emoji.toString()}${user.username}`)){
						data = data.replace(`${reaction.emoji.toString()}${user.username}`, '');
						data = data.replace('\n\n', '\n');
						required = required+1;
						newDescription = list[0] + ' ' + required;
						newEmbed.setDescription(newDescription);
						if (data == '') data = 'Empty!';
						newEmbed.fields[1].value = data;
						reaction.message.edit(newEmbed);
						console.log('returning p2 no of');
					}
					console.log('returning outside of 2p no of');
				}
			} else {
				//one party + overflow
				let data = newEmbed.fields[0].value;
				if (data.includes(`${reaction.emoji.toString()}${user.username}`)){
					data = data.replace(`${reaction.emoji.toString()}${user.username}`, '');
					data = data.replace('\n\n', '\n');
					overflowList = newEmbed.fields[1].value.split('\n');
					overflow = overflowList[0];
					//overflow = overflow + '\n';
					data = data + '\n' + overflow;
					overflowList.shift();
					data2 = '';
					overflowList.forEach(element => {
						data2 = data2 + '\n' + element;
					});
					newEmbed.fields[1].value = data2;
					if (data2 == '') {
						newEmbed.fields = [newEmbed.fields[0]];
					}
					newEmbed.fields[0].value = data;
					reaction.message.edit(newEmbed);
					console.log('returning inside pt1');
				} else {
					data = newEmbed.fields[1].value;
					if (data.includes(`${reaction.emoji.toString()}${user.username}`)){
						data = data.replace(`${reaction.emoji.toString()}${user.username}`, '');
						data = data.replace('\n\n', '\n');
						newEmbed.fields[1].value = data;
						if (data == '') {
							newEmbed.fields = [newEmbed.fields[0]];
						}
						reaction.message.edit(newEmbed);
						console.log('returning inside overflow');
					}
				}
				console.log('returning outside if');
			}
		} else if (oldEmbed.fields.length == 3){
			//two parties + overflow
			let data = newEmbed.fields[0].value;
			if (data.includes(`${reaction.emoji.toString()}${user.username}`)){
				data = data.replace(`${reaction.emoji.toString()}${user.username}`, '');
				data = data.replace('\n\n', '\n');
				overflowList = newEmbed.fields[2].value.split('\n');
				overflow = overflowList[0];
				//overflow = overflow + '/n';
				data = data + '\n' + overflow;
				overflowList.shift();
				overflowList.shift();
					data2 = '';
					overflowList.forEach(element => {
						data2 = data2 + '\n' + element;
					});
				newEmbed.fields[1].value = data2;
				if (data2 == '') {
					newEmbed.fields = [newEmbed.fields[0], newEmbed.fields[1]];
				}
				newEmbed.fields[0].value = data;
				reaction.message.edit(newEmbed);
				console.log('returning from p1');
			} else {
				data = newEmbed.fields[1].value;
				if (data.includes(`${reaction.emoji.toString()}${user.username}`)) {
					data = data.replace(`${reaction.emoji.toString()}${user.username}`, '');
					data = data.replace('\n\n', '\n');
					overflowList = newEmbed.fields[2].value.split('\n');
					overflow = overflowList[0];
					//overflow = overflow + '/n';
					data = data + '\n' + overflow;
					overflowList.shift();
					overflowList.shift();
					data2 = '';
					overflowList.forEach(element => {
						data2 = data2 + '\n' + element;
					});
					newEmbed.fields[1].value = data2;
					if (data2 == '') {
						newEmbed.fields = [newEmbed.fields[0], newEmbed.fields[1]];
					}
					newEmbed.fields[1].value = data;
					reaction.message.edit(newEmbed);
					console.log('returning from p2');
				} else {
					data = newEmbed.fields[1].value;
					if (data.includes(`${reaction.emoji.toString()}${user.username}`)){
						data = data.replace(`${reaction.emoji.toString()}${user.username}`, '');
						data = data.replace('\n\n', '\n');
						newEmbed.fields[1].value = data;
						if (data == '') {
							newEmbed.fields = [newEmbed.fields[0]];
						}
						reaction.message.edit(newEmbed);
						console.log('returning inside overflow');
					}
				}
				console.log('returning outside if');
			}
		}
		console.log('returning outside big if');
		return 0;
    }
}