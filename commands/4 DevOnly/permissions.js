const { Message } = require('discord.js');
const { PinguLibrary, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'permissions',
    description: 'Permissions that I require',
    usage: '<has | missing>',
    id: 4,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        let has = args[0] == 'has';
        let permArr = has ? PinguLibrary.Permissions.given : PinguLibrary.Permissions.missing;
        let title = `**Permissions I${(has ? ` should have` : `'m missing from invite`)}**`;

        message.channel.send(`${title}\n${permArr
            .map(perm => `- ${perm.permString}`)
            .sort((a, b) => a > b ? 1 : -1)
            .join('\n')}`
        );
    },
}