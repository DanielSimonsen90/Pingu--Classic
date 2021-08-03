const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('permissions', 'DevOnly', 'Permissions that I require', {
    usage: '<has | missing>'
}, async ({client, message, args }) => {
    let has = args[0] == 'has';
    const permArr = has ? client.permissions.given : client.permissions.missing;
    let title = `**Permissions I${(has ? ` should have` : `'m missing from invite`)}**`;

    return message.channel.send(`${title}\n${permArr
        .map(perm => {
            let permCheck = client.permissions.checkFor(message, perm.permString) == client.permissions.PermissionGranted;
            return has && !permCheck || !has && permCheck ? `**${perm.permString}**` : perm.permString
        })
        .map(perm => `- ${perm}`)
        .sort((a, b) => a > b ? 1 : -1)
        .join('\n')}`
    );
});