const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguGuild, ReactionRole } = require('PinguPackage');

module.exports = new PinguEvent('messageDeleteBulk',
    async function setContent(messages) {
        return module.exports.content = new MessageEmbed().setDescription(`Deleted ${messages.size} messages from ${messages.first().channel}`);
    },
    async function execute(client, messages) {
        let pGuild = await PinguGuild.Get(messages.first().guild);
        let { reactionRoles } = pGuild.settings;
        let messageIDs = messages.map(m => m.id);

        reactionRoles.forEach(async rr => {
            if (!messageIDs.includes(rr.messageID)) return;
            return ReactionRole.RemoveReactionRole(rr, reactionRoles, pGuild, client);
        });
    }
);