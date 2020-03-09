module.exports = {
    name: 'create',
    description: 'idk',
    usage: `create [<something>]`,
    help: `**something** : doesn't matter, i probably can't make it :<`,
    execute(bot, message, args){
        const what = args[0];
		switch(what) {
			case 'nothing':
			    message.channel.send('Well stop disturbing me then, <@' + message.author.id + '>!');
			break;
			default:
			    message.channel.send('<@' + message.author.id + '>, i do not know how to make ' + message.content.substring(14) + '!');
			break;
		}
    }
}