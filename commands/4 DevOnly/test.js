const { Message } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'test',
    description: 'Danho test script',
    usage: '',
    guildOnly: false,
    id: 4,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild}}*/
    execute({ message, args, pAuthor, pGuild }) {
        let channelsToView = [
            'server-announcements',
            `Pingu's Broadcasting Channel`,
            'pingu-beta-testing',
            'error-log',
            'console-log',
            'pingu-guild-log',
            'pingu-user-log'
        ];

        message.guild.channels.cache.forEach(c => {
            if (!channelsToView.includes(c.name) && c.permissionsFor(message.guild.roles.cache.find(r => r.id == '783365374165909556')).has(DiscordPermissions.VIEW_CHANNEL))
                c.overwritePermissions([{
                    type: 'role',
                    id: '783365374165909556',
                    deny: [DiscordPermissions.VIEW_CHANNEL]
                }], 'Removing Pingu BETA Access from from everything');
        })
    }
}