module.exports = {
    name: 'bnssrc',
    description: 'Source a handful of people, 6 or 12 as parameter.',
    usage: `bnssrc <number> <name>`,
    help: `**number** : the number of people you are recruiting
            \tit can only be 6 or 12
            **name** : the name of the recruitment, used to identify it (recommended unique)
            \tit cannot contain any spaces (anything after the first space character will be ignored)`,
    execute(bot, message, args){
        const amount = parseInt(args[0]);
        if (isNaN(amount)) {
            return message.reply('It would seem the first parameter is not a number.')
        } else if (amount != 6 && amount != 12) {
            return message.reply('You can only source 6 or 12 people!')
        } else if (typeof args[1] === "undefined") {
            return message.reply('You need to specify what you are recruiting for!')
        }
        else {
            args.shift();
            const Discord = require('discord.js');
            //var messageContent = `${amount.toString()} people needed for ${sum(args)}\n\`\`\`\nEmpty list\n\`\`\``;
            //message.channel.send(messageContent);
            const newEmbed = new Discord.RichEmbed().setTitle(`People needed for ${sum(args)}`);
            newEmbed.setDescription(`Needed: ${amount}`);
            //newEmbed.addField("Empty list", "Be the first one to apply!");
            if (amount == 6){
                newEmbed.addField('Party1', 'Empty!');
            } else {
                newEmbed.addField('Party1', 'Empty!', true);
                newEmbed.addField('Party2', 'Empty!', true);
            }
            message.channel.send(newEmbed).then(() =>
            {
                const channel = message.client.channels.get(message.channel.id);
                channel.fetchMessages({ limit: 1 }).then(messages => {
                    let lastMessage = messages.first();
              
                    const BD = message.client.emojis.find(emoji => emoji.name === "BD");
                    const BM = message.client.emojis.find(emoji => emoji.name === "BM");
                    const DES = message.client.emojis.find(emoji => emoji.name === "DES");
                    const FM = message.client.emojis.find(emoji => emoji.name === "FM");
                    const GUN = message.client.emojis.find(emoji => emoji.name === "GUN");
                    const KFM = message.client.emojis.find(emoji => emoji.name === "KFM");
                    const SF = message.client.emojis.find(emoji => emoji.name === "SF");
                    const SIN = message.client.emojis.find(emoji => emoji.name === "SIN");
                    const SUM = message.client.emojis.find(emoji => emoji.name === "SUM");
                    const WL = message.client.emojis.find(emoji => emoji.name === "WL");
                    const WRD = message.client.emojis.find(emoji => emoji.name === "WRD");

                    lastMessage.react(BD).then(() => 
                    lastMessage.react(BM)).then(() =>
                    lastMessage.react(DES)).then(() =>
                    lastMessage.react(FM)).then(() =>
                    lastMessage.react(GUN)).then(() =>
                    lastMessage.react(KFM)).then(() =>
                    lastMessage.react(SF)).then(() =>
                    lastMessage.react(SIN)).then(() =>
                    lastMessage.react(SUM)).then(() =>
                    lastMessage.react(WL)).then(() =>
                    lastMessage.react(WRD)).then(() => {
                        console.log('Created recruitment for ' + sum(args));
                        var fs = require('fs');
                        fs.readFile('./bnssrctrack.json', 'utf8', function readFileCallback(err, data){
                            if (err){
                                console.log(err);
                            } else {
                            obj = JSON.parse(data); //now it an object
                            obj.id.push(lastMessage.id); //add some data
                            obj.name.push(args[0]);
                            let date = new Date();
                            //console.log(date);
                            //console.log(date.getDate());
                            if (amount == 6)
                                date.setDate(date.getDate()+2)
                            else
                                date.setDate(date.getDate()+7);
                            //console.log(date);
                            obj.date.push(date);
                            json = JSON.stringify(obj); //convert it back to json
                            fs.writeFile('./bnssrctrack.json', json, 'utf8', function logerr(err){
                                console.log('BNSsrc: '+err);
                            }); // write it back 
                        }});
                    }
                    );
                })
                .catch(console.error);
            });
        }
    }
}


function sum(theArgs) {
    var i=0;
    var mystring = '';
    while (true){
        if (typeof theArgs[i] === "undefined") break;
        mystring += theArgs[i].toString() + " ";
        i++;
    }
    return mystring;
}