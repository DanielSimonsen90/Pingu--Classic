const { Client, Message, MessageEmbed, ReactionManager } = require("discord.js");
const { PinguEvents } = require("../../PinguPackage");

module.exports = {
    name: 'events: messageUpdate',
    /**@param {{
     * preMessage: Message, 
     * message: Message
     * }}*/
    setContent({ preMessage, message }) {
        return module.exports.content = new MessageEmbed().setDescription(GetDifference());

        function GetDifference() {
            if (message.content != preMessage.content) return PinguEvents.SetDescriptionValues('Content', preMessage.content, message.content);
            else if (message.pinned != preMessage.pinned) return PinguEvents.SetDescriptionValues('Pin', preMessage.pinned, message.pinned);
            else if (message.reactions != preMessage.reactions) return FindReactionDifference(preMessage.reactions, message.reactions);
            else if (message.embeds != preMessage.embeds) return PinguEvents.GoThroughObjectArray('Embed', preMessage.embeds, message.embeds);
            return PinguEvents.UnknownUpdate(preMessage, message);
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
    },
    /**@param {Client} client
     @param {{preMessage: Message, message: Message}}*/
    execute(client, { preMessage, message }) {

    },
}