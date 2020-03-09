module.exports = {
	name: 'ping',
	description: 'Pong!',
    usage: `ping`,
    help: ``,
	execute(bot, message, args) {
		message.channel.send('Pong.');
	}
}