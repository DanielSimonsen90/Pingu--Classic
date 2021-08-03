const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('userUpdate', 
    async function setContent(client, preUser, user) {
        const difference = GetDifference();
        return module.exports.content = difference ? new MessageEmbed({ description: difference }) : null;

        function GetDifference() {
            if (user.avatarURL() != preUser.avatarURL() || user.avatar != preUser.avatar) return PinguEvent.SetDescriptionValuesLink('Avatar', preUser.avatarURL(), user.avatarURL());
            else if (user.discriminator != preUser.discriminator) return PinguEvent.SetDescriptionValues('Discriminator', preUser.discriminator, user.discriminator);
            else if (user.flags != preUser.flags) return `Flags Update: ${(() => {
                const userFlags = user.flags?.toArray?.();
                const preUserFlags = preUser.flags?.toArray?.();

                if (!userFlags && preUserFlags || userFlags.length > preUserFlags.length)
                    return `Removed flags: ${preUserFlags.join(', ')}`;
                else if (userFlags && !preUserFlags || userFlags.length < preUserFlags.length)
                    return `Added flags: ${userFlags.join(', ')}`;
                return `Unknown`
            })()}`
            else if (user.tag != preUser.tag) return PinguEvent.SetDescriptionValues('Tag', preUser.tag, user.tag);
            return null;
        }
    },
    async function execute(client, preUser, user) {
        client.developers.update(user);

        const relevant = {
            avatar: user.avatarURL(),
            tag: user.tag
        };
        const pUser = client.pUsers.get(user);

        const updated = Object.keys(relevant).reduce((updated, prop) => {
            if (pUser[prop] != relevant[prop])
                updated.push(prop);
            return updated;
        }, []);

        if (!updated.length) return;

        updated.forEach(prop => pUser[prop] = updated[prop]);

        return client.pUsers.update(pUser, module.exports.name, `User updated: ${updated.join(', ')}`);
    }
);