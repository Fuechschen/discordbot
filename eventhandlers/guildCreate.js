var story = require('storyboard').mainStory;
var Promise = require('bluebird');

var db = require('../db/sql_db');
var cache = require('../lib/cache');

module.exports = {
    event: 'guildCreate',
    enabled: true,
    handler: (guild) => {
        story.debug('guildCreate', guild.name + '[' + guild.id + ']');
        db.models.Guild.findOrCreate({
            where: {gid: guild.id},
            defaults: {
                gid: guild.id,
                name: guild.name,
                region: guild.region,
                avability: true
            }
        }).spread((dbguild, created)=> {
            if (created) {
                return db.models.Prefix.findAll({where: {$or: [{prefix: '!fb'}, {prefix: '!fb '}]}}).then((prefixes)=> {
                    return Promise.all(prefixes.map((prefix)=> {
                        return prefix.addGuild(dbguild.uid)
                    })).then(()=> {
                        return Promise.resolve(dbguild);
                    });
                });
            } else {
                return dbguild.update({
                    gid: guild.id,
                    name: guild.name,
                    region: guild.region,
                    avability: true
                })
            }
        }).then((dbguild)=> {
            return dbguild.setOwner(guild.ownerID);
        }).then(()=> {
            return cache.getGuild(guild.id);
        }).then(()=> {
            return Promise.all(guild.members.map((member)=> {
                return db.models.User.upsert({
                    uid: member.id,
                    username: member.user.username,
                    discriminator: member.user.discriminator,
                    status: member.status
                })
            }));
        });
    }
};