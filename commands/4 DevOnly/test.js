const { PinguCommand, PinguUser } = require('PinguPackage');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {
    mustBeBeta: true
}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    let PinguUsers = await PinguUser.GetUsers();
    let users = PinguUsers.map(pUser => client.users.cache.get(pUser._id)).filter(v => v);

    let promises = users.map(user => {
        let tempPUser = new PinguUser(user);
        let pUser = PinguUsers.find(pUser => pUser._id == user.id);

        tempPUser.achievementConfig.achievements = [];
        pUser.daily.nextClaim = null;
        pUser.marry.partner = undefined;

        let keep = !(function validatePUser() {
            let noConfig = !pUser.achievementConfig.achievements.length && pUser.achievementConfig.notificationType == 'NONE' && pUser.achievementConfig.enabled
            let noDaily = pUser.daily.streak == 0 && pUser.daily.nextClaim == null
            let noPlaylists = !pUser.playlists.length
            let noMarry = pUser.marry.partner == undefined && pUser.marry.internalDate == null;

            console.log(user.tag, { noConfig, noDaily, noPlaylists, noMarry });

            return noConfig && noDaily && noPlaylists && noMarry;
        })();

        return keep ? null : PinguUser.Delete(client, user, module.exports.name, `User did not use Pingu - no need to save in DB`);
    });
    await Promise.all(promises);

    return message.channel.send("Users deleted");
});