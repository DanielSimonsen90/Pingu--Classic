const { MessageEmbed } = require("discord.js");
const { PinguEvent, ReactionRole } = require('PinguPackage');

module.exports = new PinguEvent('messageDeleteBulk',
    async function setContent(client, messages) {
        return module.exports.content = new MessageEmbed({ description: `Deleted ${messages.size} messages from ${messages.first().channel}` })
    },
    async function execute(client, messages) {
        if (!messages.first().guild) return;

        let pGuild = client.pGuilds.get(messages.first().guild);
        let { reactionRoles } = pGuild.settings;
        let messageIDs = messages.map(m => m.id);

        reactionRoles.forEach(async rr => {
            if (messageIDs.includes(rr.messageID)) 
                return ReactionRole.RemoveReactionRole(rr, reactionRoles, pGuild, client);
        });
    }
);