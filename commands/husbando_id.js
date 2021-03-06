let db = require('../lib/db');
let lang = require('../lib/lang');

module.exports = {
    label: 'id',
    isSubcommand: true,
    enabled: true,
    generator: (msg, args)=> {
        db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
            return user.getHusbando();
        }).then((husbando)=> {
            if (husbando !== null && husbando !== undefined) {
                msg.channel.createMessage( lang.computeResponse(msg, 'husbando.id.default', {id: husbando.id}));
            } else {
                msg.channel.createMessage( lang.computeResponse(msg, 'husbando.id.no_husbando'));
            }
        });
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};