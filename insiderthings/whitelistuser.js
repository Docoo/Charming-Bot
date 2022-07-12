module.exports = {
    name: "whitelistuser",
    description: 'Add a user to the whitelist.',
    execute(bot, message, args){
        var fs = require('fs');
        let user = message.mentions.users.first();
        fs.readFile('./configs/user-whitelist.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                obj = JSON.parse(data); //now it an object
                obj.id.push(user.id); //add some data
                json = JSON.stringify(obj); //convert it back to json
                fs.writeFile('./configs/user-whitelist.json', json, 'utf8', function logerr(err){
                    console.log(err);
                }); // write it back 
            }
        });
        return message.channel.send(`${message.mentions.users.first()} successfully whitelisted!`);
    }
}