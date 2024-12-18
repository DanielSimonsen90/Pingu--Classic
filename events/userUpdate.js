const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguUser } = require("PinguPackage");

module.exports = new PinguEvent('userUpdate', 
    async function setContent(preUser, user) {
        return module.exports.content = GetDifference() ? new MessageEmbed().setDescription(GetDifference()) : null;

        function GetDifference() {
            if (user.avatarURL() != preUser.avatarURL() || user.avatar != preUser.avatar) return PinguEvent.SetDescriptionValuesLink('Avatar', preUser.avatarURL(), user.avatarURL());
            else if (user.discriminator != preUser.discriminator) return PinguEvent.SetDescriptionValues('Discriminator', preUser.discriminator, user.discriminator);
            else if (user.flags != preUser.flags) return `Flags Update: ${(
                user.flags.toArray().length > preUser.flags.toArray().length ?
                    `${user.flags.toArray().find(flag => !preUser.flags.toArray().includes(flag))} added` :
                    user.flags.toArray().length < preUser.flags.toArray().length ?
                        `${preUser.flags.toArray().find(flag => !user.flags.toArray().includes(flag))} removed` :
                        `Changed from ${preUser.flags.toArray().find(flag => !user.flags.toArray().includes(flag))} to ${user.flags.toArray().find(flag => !preUser.flags.toArray().includes(flag))}`
            )}`;
            else if (user.tag != preUser.tag) return PinguEvent.SetDescriptionValues('Tag', preUser.tag, user.tag);
            return null;
        }
    },
    async function execute(client, preUser, user) {
        let updated = await PinguUser.GetUpdatedProperty(preUser, user);
        if (!updated) return;

        if (!Object.keys(updated)[0]) return;

        const pUser = await PinguUser.Get(user);
        if (!pUser) return;

        updated.forEach(update => {
            switch (update) {
                case 'avatar': pUser.avatar = user.avatarURL(); break;
                case 'tag': pUser.tag = user.tag; break;
                default: break;
            }
        })

        return await PinguUser.Update(client, updated, pUser, module.exports.name, updated.join(', '));
    }
);