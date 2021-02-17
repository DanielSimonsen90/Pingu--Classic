const { Client, User, MessageEmbed } = require("discord.js");
const { PinguEvents, PinguUser } = require("PinguPackage");

module.exports = {
    name: 'events: userUpdate',
    /**@param {{
     * preUser: User,
     * user: User
     * }}*/
    setContent({ preUser, user }) {
        return module.exports.content = GetDifference() ? new MessageEmbed().setDescription(GetDifference()) : null;

        function GetDifference() {
            if (user.avatarURL() != preUser.avatarURL() || user.avatar != preUser.avatar) return PinguEvents.SetDescriptionValuesLink('Avatar', preUser.avatarURL(), user.avatarURL());
            else if (user.discriminator != preUser.discriminator) return PinguEvents.SetDescriptionValues('Discriminator', preUser.discriminator, user.discriminator);
            else if (user.flags != preUser.flags) return `Flags Update: ${(
                user.flags.toArray().length > preUser.flags.toArray().length ?
                    `${user.flags.toArray().find(flag => !preUser.flags.toArray().includes(flag))} added` :
                    user.flags.toArray().length < preUser.flags.toArray().length ?
                        `${preUser.flags.toArray().find(flag => !user.flags.toArray().includes(flag))} removed` :
                        `Changed from ${preUser.flags.toArray().find(flag => !user.flags.toArray().includes(flag))} to ${user.flags.toArray().find(flag => !preUser.flags.toArray().includes(flag))}`
            )}`;
            else if (user.tag != preUser.tag) return PinguEvents.SetDescriptionValues('Tag', preUser.tag, user.tag);
            return null;
        }
    },
    /**@param {Client} client
     @param {{preUser: User, user: User}}*/
    async execute(client, { preUser, user }) {
        if (user.bot) return;

        let updated = {};
        if (user.avatarURL() != preUser.avatarURL()) updated.avatar = user.avatarURL();
        if (user.tag != preUser.tag) updated.tag = user.tag;

        //Neither avatar or tag was updated in this event
        if (!Object.keys(updated)[0]) return;

        return await PinguUser.UpdatePUser(client, updated, await PinguUser.GetPUser(user), module.exports.name,
            `Successfully updated **${user.tag}** PinguUser.`,
            `Failed to update **${user.tag}** PinguUser.`,
        );
    }
}