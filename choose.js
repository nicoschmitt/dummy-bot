(function(){

    var builder = require('botbuilder');
    var connector = require('botconnector');
    var msRest = require('ms-rest');
    
    function sendMessage(msg, cb) {
        var credentials = new msRest.BasicAuthenticationCredentials(process.env.BOT_APP_ID, process.env.BOT_APP_SECRET);
        var client = new connector(credentials);
        var options = { customHeaders: {'Ocp-Apim-Subscription-Key': credentials.password}};
        client.messages.sendMessage(msg, options, function (err, result, request, response) {
            if (!err && response && response.statusCode >= 400) {
                err = new Error('Message rejected with "' + response.statusMessage + '"');
                console.log(err);
            }
            if (cb) {
                cb(err);
            }
        });          
    }

    function handler(product) {
        return function(session) {
            setTimeout(function () {
                var reply = { 
                    replyToMessageId: session.message.id,
                    to: session.message.from,
                    from: session.message.to,
                    text: "Ok, good. Someone from heldesk will contact you in a moment. Bye.",
                    language: "en"
                };
                console.log(reply);
                sendMessage(reply);
            }, 5000);
            session.send("Ok, you need help on **%s**. Hold on a minute while I search someone to help you.", product);
        };
    };

    var options = [
            {
                route: "/outlook",
                match: '(outlook|mail|exchange|email|couriel)',
                on: handler("Outlook")
            },
            {
                route: "/skype",
                match: '(skype|lync|réunion|reunion|meeting|chat)',
                on: handler("Skype")
            },
            {
                route: "/office",
                match: '(office|word|excel|powerpoint)',
                on: handler("Office")
            },
            {
                route: "/windows",
                match: '(windows)',
                on: handler("Windows")
            },            
        ];
    
    module.exports.register = function(bot) {
        var chooseDialog = new builder.CommandDialog();
        chooseDialog.onBegin(session => { 
            session.send("Hello **%s**, I'm a dummy bot. On which product/solution do you need help?", session.userData.name); 
        });
        options.forEach(o => {
            chooseDialog.matches(o.match, o.on);
        });
        chooseDialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));
        bot.add("/choose", chooseDialog);    
    }
    
}());
