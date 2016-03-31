(function(){

    var builder = require('botbuilder');

    function handler(product) {
        return function(session) {
            session.send("Ok, you need help on %s. Hold on a minute while I search someone to help you.", product);
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
            session.send("Hello %s, I'm a dummy bot. On which product/solution do you need help?", session.userData.name); 
        });
        options.forEach(o => {
            console.log(o.route);
            chooseDialog.matches(o.match, o.route);
            bot.add(o.route, o.on);
        });
        chooseDialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));
        bot.add("/choose", chooseDialog);    
    }
    
}());
