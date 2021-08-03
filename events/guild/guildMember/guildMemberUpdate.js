const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('guildMemberUpdate',
    async function setContent(client, preMember, member) {
        let description = GetDescription();
        return module.exports.content = description ? new MessageEmbed({ description }) : null;

        function GetDescription() {
            if (member.nickname != preMember.nickname) return PinguEvent.SetRemove(
                'Nickname',
                preMember.nickname,
                member.nickname,
                `Set **${member.user.tag}**'s nickname to ${member.nickname}`,
                `Removed **${member.user.tag}**'s nickname`,
                PinguEvent.SetDescriptionValues
            );
            else if (member.permissions.bitfield != preMember.permissions.bitfield) return PinguEvent.GoThroughArrays(
                'Permissions',
                preMember.permissions.toArray(),
                member.permissions.toArray(),
                ((i, l) => i == l)
            );
            else if (member.premiumSinceTimestamp != preMember.premiumSinceTimestamp) return PinguEvent.SetRemove(
                'Boost',
                preMember.premiumSince,
                member.premiumSince,
                `**${member.user.tag}** boosted ${member.guild.name}`,
                `**${member.user.tag}** is no longer boosting ${member.guild.name}`,
                PinguEvent.SetDescriptionValues
            );
            else if (member.roles.cache.array().length != preMember.roles.cache.array().length) PinguEvent.GoThroughArrays(
                'Roles',
                preMember.roles.cache.array(),
                member.roles.cache.array(),
                ((i, l) => i.id == l.id)
            );
            else if (member.voice.channelID != preMember.voice.channelID) PinguEvent.SetRemove(
                'Voice',
                preMember.voice.channel.name,
                member.voice.channel.name,
                `${member} joined VC ${member.voice.channel.name}`,
                `${member} left VC ${member.voice.channel.name}`,
                PinguEvent.SetDescriptionValues
            );
            let unknown = PinguEvent.UnknownUpdate(preMember, member);
            if (unknown == `Unknown Update: Unable to find what updated`)
                client.emit('userUpdate', preMember.user, member.user);
        }
    }
);