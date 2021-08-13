const { ReactionManager } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('messageUpdate',
    async function setContent(client, embed, previous, current) {
        let description = GetDifference();
        return module.exports.content = description ? embed.setDescription(description.length < 2048 ? description : description.substring(0, 2040) + "...") : null;

        function GetDifference() {
            if (current.content != previous.content) return PinguEvent.SetDescriptionValues('Content', previous.content, current.content);
            else if (current.pinned != previous.pinned) return PinguEvent.SetDescriptionValues('Pin', previous.pinned, current.pinned);
            else if (current.reactions != previous.reactions) return FindReactionDifference(previous.reactions, current.reactions);
            else if (!previous.embeds[0] && current.embeds[0]) return null;
            else if (current.embeds != previous.embeds) return PinguEvent.GoThroughObjectArray('Embed', previous.embeds, current.embeds);
            return PinguEvent.UnknownUpdate(previous, current);
        }

        /**@param {ReactionManager} old
         * @param {ReactionManager} current*/
        function FindReactionDifference(old, current) {
            let updateMessage = `[**Reactions**]: `;

            for (var [_, reaction] of current.cache) {
                let oldReaction = old.cache.find(r => r.emoji == reaction.emoji);

                if (!oldReaction || oldReaction.count > reaction.count) return updateMessage += `${reaction.emoji} was added from [message](${current.url})`;
                else if (oldReaction.count < reaction.count) return updateMessage += `${reaction.emoji} was added to [message](${current.url})`;
            }

            for (var [__, oldReaction] of old.cache) {
                let reaction = current.cache.find(r => r.emoji == oldReaction.emoji);
                if (!reaction) return updateMessage += `${reaction.emoji} was removed from [message](${current.url})`;
            }

            return updateMessage += `Unknown update - [message](${current.url})`;
        }
    }
);