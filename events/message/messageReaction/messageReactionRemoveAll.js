const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguLibrary, PinguGuild } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemoveAll',
    async function setContent(message) {
        return module.exports.content = new MessageEmbed().setDescription(`Removed all reactions from message, ${message.id}`);
    },
    async function execute(client, message) {
        (async function RemoveReactionRoles() {
            let pGuild = await PinguGuild.GetPGuild(message.guild);
            if (!pGuild.settings.reactionRoles[0]) return;

            for (var rr of pGuild.settings.reactionRoles) {
                if (rr.messageID != message.id) continue;

                let i = pGuild.settings.reactionRoles.indexOf(rr)
                pGuild.settings.reactionRoles.splice(i, 1);

                PinguLibrary.consoleLog(message.client, `Removed ${rr.emoteName} => ${rr.pRole.name}`);
            }

            return PinguGuild.UpdatePGuild(client, { settings: pGuild.settings }, pGuild, module.exports.name,
                `Successfully removed **${message.guild.name}**'s reactionroles for ${message.id}`,
                `Failed to remove **${message.guild.name}**'s reactionroles for ${message.id}`
            )
        })();
    }
);