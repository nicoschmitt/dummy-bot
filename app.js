require('dotenv').config({silent: true});

var restify = require('restify');
var builder = require('botbuilder');

var bot = new builder.BotConnectorBot({ appId: process.env.BOT_APP_ID, appSecret: process.env.BOT_APP_SECRET });

bot.on("BotAddedToConversation", function(message) {
    var user = message.participants.filter(u => !u.isBot)[0];
    console.log("Chat with " + user.name);
});

bot.add('/', function (session) {
    session.userData.name = session.message.from.name;
    session.beginDialog('/choose');
});

require('./choose').register(bot);

var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 80, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
