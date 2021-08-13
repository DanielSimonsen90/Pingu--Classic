const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('guildMemberUpdate',
    async function setContent(client, embed, previous, current) {
        let description = GetDescription();
        return module.exports.content = description ? embed.setDescription(description) : null;

        function GetDescription() {
            if (current.nickname != previous.nickname) return PinguEvent.SetRemove(
                'Nickname',
                previous.nickname,
                current.nickname,
                `Set **${current.user.tag}**'s nickname to ${current.nickname}`,
                `Removed **${current.user.tag}**'s nickname`,
                PinguEvent.SetDescriptionValues
            );
            else if (current.permissions.bitfield != previous.permissions.bitfield) return PinguEvent.GoThroughArrays(
                'Permissions',
                previous.permissions.toArray(),
                current.permissions.toArray(),
                ((i, l) => i == l)
            );
            else if (current.premiumSinceTimestamp != previous.premiumSinceTimestamp) return PinguEvent.SetRemove(
                'Boost',
                previous.premiumSince,
                current.premiumSince,
                `**${current.user.tag}** boosted ${current.guild.name}`,
                `**${current.user.tag}** is no longer boosting ${current.guild.name}`,
                PinguEvent.SetDescriptionValues
            );
            else if (current.roles.cache.array().length != previous.roles.cache.array().length) PinguEvent.GoThroughArrays(
                'Roles',
                previous.roles.cache.array(),
                current.roles.cache.array(),
                ((i, l) => i.id == l.id)
            );
            else if (current.voice.channelId != previous.voice.channelId) PinguEvent.SetRemove(
                'Voice',
                previous.voice.channel.name,
                current.voice.channel.name,
                `${current} joined VC ${current.voice.channel.name}`,
                `${current} left VC ${current.voice.channel.name}`,
                PinguEvent.SetDescriptionValues
            );
            let unknown = PinguEvent.UnknownUpdate(previous, current);
            if (unknown == `Unknown Update: Unable to find what updated`)
                client.emit('userUpdate', previous.user, current.user);
        }
    }
);