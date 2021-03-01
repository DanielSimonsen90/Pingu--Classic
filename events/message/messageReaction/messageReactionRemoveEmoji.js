const { MessageEmbed } = require("discord.js");
const { PinguLibrary, PinguEvent, ReactionRole } = require("PinguPackage");

module.exports = new PinguEvent('messageReactionRemoveEmoji',
    async function setContent(reaction) {
        return module.exports.content = new MessageEmbed().setDescription(`${reaction.emoji} was removed from ${reaction.message.id}`);
    },
    async function execute(client, reaction) {
        PinguLibrary.consoleLog(client, `${module.exports.name} called`);
        TestForReactionRole(reaction);

        async function TestForReactionRole() {
            return ReactionRole.RemoveReaction(reaction);
        }
    }
);

