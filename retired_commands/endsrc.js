module.exports = {
    name: "endsrc",
    description: "end the last recruitment post in the channel with the given name",
    usage: `endsrc <name>`,
    help: `**name** : the name used to identify the recruitment to end
            'tit may not contain spaces (anything after the first space will be ignored)`,
    execute(bot, message, args){
        const Discord = require('discord.js');
        message.channel.fetchMessages({limit : 100})
        .then((messages) => messages.some(msg => {
            if (msg.author.id == "580595641525338142"){
                if (typeof msg.embeds[0] === "undefined" || msg.embeds[0].title.split(" ")[3] != args[0]){ return false;
                } else {
                    //console.log(msg.embeds[0].title.split(" ")[3], args[0]);
                    let oldEmbed = msg.embeds[0];
                    const exampleEmbed = Discord.MessageEmbed.from(oldEmbed.toJSON()).setTitle('Recruitment ended!').setDescription('This is the team:');
                    msg.edit({embeds: [exampleEmbed]}).then(() =>{
                        msg.reactions.removeAll();
                    });
                    var fs = require('fs');
                    fs.readFile('./bnssrctrack.json', 'utf8', function readFileCallback(err, data){
                        console.log('Ended recruitment ' + args[0]);
                        if (err){
                            console.log(err);
                        } else {
                            obj = JSON.parse(data); //now it an object
                            var ids = obj.id.toString();
                            var idarray = ids.split(",");
                            if (idarray[0] == '') idarray.shift();
                            let namearray = obj.name;
                            if (idarray.indexOf(msg.id) > -1) {
                                obj.name.splice(idarray.indexOf(msg.id),1);
                                obj.date.splice(idarray.indexOf(msg.id),1);
                                idarray.splice(idarray.indexOf(msg.id),1);
                            };
                            obj.id = idarray; //add some data
                            if (obj.id[0] == '') obj.id.shift();
                            json = JSON.stringify(obj); //convert it back to json
                            fs.writeFile('./bnssrctrack.json', json, 'utf8', function logerr(err){
                                console.log(err);
                            }); // write it back 
                        }
                    });
                    
                    return true;
                }
            }
        }))
    }
}