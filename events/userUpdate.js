const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('userUpdate', 
    async function setContent(client, embed, previous, current) {
        const difference = GetDifference();
        return module.exports.content = difference ? embed.setDescription(difference) : null;

        function GetDifference() {
            if (current.avatarURL() != previous.avatarURL() || current.avatar != previous.avatar) return PinguEvent.SetDescriptionValuesLink('Avatar', previous.avatarURL(), current.avatarURL());
            else if (current.discriminator != previous.discriminator) return PinguEvent.SetDescriptionValues('Discriminator', previous.discriminator, current.discriminator);
            else if (current.flags != previous.flags) return `Flags Update: ${(() => {
                const userFlags = current.flags?.toArray?.();
                const preUserFlags = previous.flags?.toArray?.();

                if (!userFlags && preUserFlags || userFlags.length > preUserFlags.length)
                    return `Removed flags: ${preUserFlags.join(', ')}`;
                else if (userFlags && !preUserFlags || userFlags.length < preUserFlags.length)
                    return `Added flags: ${userFlags.join(', ')}`;
                return `Unknown`
            })()}`
            else if (current.tag != previous.tag) return PinguEvent.SetDescriptionValues('Tag', previous.tag, current.tag);
            return null;
        }
    },
    async function execute(client, previous, current) {
        client.developers.update(current);

        const relevant = {
            avatar: current.avatarURL(),
            tag: current.tag
        };
        const pUser = client.pUsers.get(current);

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