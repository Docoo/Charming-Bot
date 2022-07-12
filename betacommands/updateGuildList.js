module.exports = {
    name: "updateguildlist",
    description: "Update the database entries of the guilds",
    usage: `updateguildlist`,
    help: `-`,
    async execute(bot, message, args){
        //check if me
        if (message != undefined)
            if (message.author.id != "169525036305219585") return;
        
        //fetch entries from db
        let result;
        try {
            result = await bot.sql.query`select * from Guilds`;
        } catch (err) {
            console.dir(err);
            if (message != undefined) message.reply("an error has occured! :<");
            return 1;
        }

        //update entries for all guilds available
        bot.guilds.cache.forEach(async botGuild => {
            console.log(`ID: ${botGuild.id}, name: ${botGuild.name}`);
            let thisGuild = undefined;
            for (let dbGuild of result.recordset){
                if (dbGuild.guildID == botGuild.id){
                    thisGuild = dbGuild;
                    //found in entries
                }
            }

            if (thisGuild == undefined){
                //create an entry and insert into db
                thisGuild = {};
                thisGuild.guildID = botGuild.id;
                thisGuild.name = botGuild.name;
                thisGuild.pefix = null;
                thisGuild.bnsRecNick = false;

                try{
                    await bot.sql.query(`INSERT INTO Guilds(guildID, name, prefix, bnsRecNick) VALUES ('${thisGuild.guildID}', '${thisGuild.name}', '${thisGuild.pefix}', '${thisGuild.bnsRecNick}')`).catch(err => {throw err;});
                } catch (err) {
                    console.dir(err);
                    if (message != undefined) message.channel.send(`Error inserting enty into db for guild ${thisGuild.name}, id: ${thisGuild.guildID}`);
                }

            } else {
                //perform magic if needed on the guild entry
            }

        });

        if (message != undefined) message.channel.send("Update complete!");
        console.log("Guild update completed");
        return 0;
    }
}