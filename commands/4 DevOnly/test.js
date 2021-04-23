const { PinguCommand, PinguUser } = require('PinguPackage');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {
    mustBeBeta: true
}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    let PinguUsers = await PinguUser.GetUsers();
    let users = PinguUsers.map(pUser => client.users.cache.get(pUser._id));

    await Promise.all(users.map(user => {
        let tempPUser = new PinguUser(user);
        let pUser = PinguUsers.find(pUser => pUser._id == user.id);
        let keep = !(function validatePUser() {
            return
            tempPUser.achievementConfig == pUser.achievementConfig &&
                tempPUser.daily == pUser.daily &&
                tempPUser.playlists == pUser.playlists &&
                tempPUser.marry == pUser.marry
        })();

        return keep ? null : PinguUser.Delete(client, user, module.exports.name, `User did not use Pingu - no need to save in DB`);
    }))

    return message.channel.send("Users deleted");
});