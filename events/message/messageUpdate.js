const { MessageEmbed, ReactionManager } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('messageUpdate',
    async function setContent(preMessage, message) {
        let description = GetDifference();
        return module.exports.content = description ? new MessageEmbed().setDescription(description.length < 2048 ? description : description.substring(0, description[2040]) + "...") : null;

        function GetDifference() {
            if (message.content != preMessage.content) return PinguEvent.SetDescriptionValues('Content', preMessage.content, message.content);
            else if (message.pinned != preMessage.pinned) return PinguEvent.SetDescriptionValues('Pin', preMessage.pinned, message.pinned);
            else if (message.reactions != preMessage.reactions) return FindReactionDifference(preMessage.reactions, message.reactions);
            else if (!preMessage.embeds[0] && message.embeds[0]) return null;
            else if (message.embeds != preMessage.embeds) return PinguEvent.GoThroughObjectArray('Embed', preMessage.embeds, message.embeds);
            return PinguEvent.UnknownUpdate(preMessage, message);
        }

        /**@param {ReactionManager} old
         * @param {ReactionManager} current*/
        function FindReactionDifference(old, current) {
            let updateMessage = `[**Reactions**]: `;

            for (var reaction of current.cache.array()) {
                let oldReaction = old.cache.find(r => r.emoji == reaction.emoji);

                if (!oldReaction || oldReaction.count > reaction.count) return updateMessage += `${reaction.emoji} was added from [message](${message.url})`;
                else if (oldReaction.count < reaction.count) return updateMessage += `${reaction.emoji} was added to [message](${message.url})`;
            }

            for (var oldReaction of old.cache.array()) {
                let reaction = current.cache.find(r => r.emoji == oldReaction.emoji);
                if (!reaction) return updateMessage += `${reaction.emoji} was removed from [message](${message.url})`;
            }

            return updateMessage += `Unknown update - [message](${message.url})`;
        }
    }
);