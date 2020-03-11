module.exports = {
    name: "test",
    description: "Test whatever i'm working on",
    usage: `test`,
    help: `-`,
    async execute(bot, message, args){
        if (message.author.id != "169525036305219585") return;
        const sql = require('mssql')
 
        try {
            // make sure that any items are correctly URL encoded in the connection string
            await sql.connect(`mssql://${bot.authToken.mssql.user}:${bot.authToken.mssql.pass}@localhost/CharmingBotBetaDB`);
            const result = await sql.query`select * from Guilds where guildID = 1`;
            console.dir(result);
        } catch (err) {
            // ... error checks
            console.dir(err)
        }
    }
}