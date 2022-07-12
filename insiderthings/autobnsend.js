module.exports = {
    name: 'autobnsend',
    description: 'Check if recruitments have expired and ends them.',
    async execute(bot){
        // var fs = require('fs');
        // fs.readFile('./bnssrctrack.json', 'utf8', function readFileCallback(err, data){
        //     if (err){
        //         console.log(err);
        //     } else {
        //         obj = JSON.parse(data); //now it an object
        //         var ids = obj.id.toString();
        //         var idarray = ids.split(",");
        //         if (idarray[0] == '') idarray.shift();
        //         let currentDate = new Date();
        //         currentDate = currentDate.toISOString();
        //         currentDate = new Date(currentDate);
        //         idarray.forEach(id => {
        //             let date = obj.date[idarray.indexOf(id)];
        //             date = new Date(date);
        //             console.log('Date:' + date);
        //             console.log('CurrentDate:' + currentDate);
        //             console.log('Diff:' + (date-currentDate));
        //             if (date-currentDate < 0){
        //                 obj.name.splice(idarray.indexOf(id),1);
        //                 obj.date.splice(idarray.indexOf(id),1);
        //                 idarray.splice(idarray.indexOf(id),1);
        //                 console.log('Ended recruitment with id: ' + id);
        //             }
        //         });
        //         obj.id = idarray; //add some data
        //         json = JSON.stringify(obj); //convert it back to json
        //         fs.writeFile('./bnssrctrack.json', json, 'utf8', function logerr(err){
        //             console.log(err);
        //         }); // write it back 
        //     }
        // });

        recruitmentsCopy = bot.bnsrecruitments;
        for (let recruitment of recruitmentsCopy){
            //console.log(recruitment);
            let currentDate = new Date();
            let recruitmentDate = new Date(recruitment.expire);
            if (recruitmentDate-currentDate < 0 || recruitment.nr_max_people == null){
                if (recruitment.nr_max_people == null){
                    console.log("Ending recruitment with id " + recruitment.message_id + " from server " + recruitment.server_name + "for invalid party size!");
                } else {
                    console.log("Ending recruitment with id " + recruitment.message_id + " from server " + recruitment.server_name + "for expiring!");
                }
                guild = bot.guilds.cache.get(recruitment.server_id);
                channel = guild.channels.cache.get(recruitment.channel_id);
                channel.messages.fetch(recruitment.message_id)
                    .then(message => bot.queue.push(['bnsend', message, [message.id, "auto"]]))
                    .catch(async error => {
                        if (bot.bnsrecendlock == true){
                            while (bot.bnsrecendlock == true){
                                await bot.wait(1000);
                            }
                            bot.bnsrecendlock = true;
                        } else {
                            bot.bnsrecendlock = true;
                        }
                        console.log(`Failed fetching message, deleting recruitment instead!`);
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
                        console.log(`Recruitment deleted SUCCessfully!`);
                        bot.bnsrecendlock = false;
                    });
            }
        }

        console.log("Cleaning complete!");

        return 0;
    }
}