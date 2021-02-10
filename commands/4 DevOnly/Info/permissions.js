const { Message } = require('discord.js');
const { PinguLibrary, DiscordPermissions } = require('PinguPackage');

module.exports = {
    name: 'permissions',
    description: 'Permissions that I require',
    usage: '<has | missing>',
    id: 4,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[]}}*/
    execute({ message, args }) {
        let has = args[0] == 'has';
        let permArr = has ? PinguLibrary.Permissions.given : PinguLibrary.Permissions.missing;
        let title = `**Permissions I${(has ? ` should have` : `'m missing from invite`)}**`;

        message.channel.send(`${title}\n${permArr
            .map(perm => {
                let permCheck = PinguLibrary.PermissionCheck(message, [perm.permString]) == PinguLibrary.PermissionGranted;
                return has && !permCheck || !has && permCheck ? `**${perm.permString}**` : perm.permString
            })
            .map(perm => `- ${perm}`)
            .sort((a, b) => a > b ? 1 : -1)
            .join('\n')}`
        );
    },
}