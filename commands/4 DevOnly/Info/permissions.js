const { PinguCommand, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('permissions', 'DevOnly', 'Permissions that I require', {
    usage: '<has | missing>'
}, async ({ message, args }) => {
    let has = args[0] == 'has';
    let permArr = has ? PinguLibrary.Permissions().given : PinguLibrary.Permissions().missing;
    let title = `**Permissions I${(has ? ` should have` : `'m missing from invite`)}**`;

    return message.channel.send(`${title}\n${permArr
        .map(perm => {
            let permCheck = PinguLibrary.PermissionCheck(message, perm.permString) == PinguLibrary.PermissionGranted;
            return has && !permCheck || !has && permCheck ? `**${perm.permString}**` : perm.permString
        })
        .map(perm => `- ${perm}`)
        .sort((a, b) => a > b ? 1 : -1)
        .join('\n')}`
    );
});