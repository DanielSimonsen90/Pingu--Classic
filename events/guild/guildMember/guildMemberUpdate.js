const { GuildMember, Client, MessageEmbed } = require("discord.js");
const { PinguEvents } = require("../../../PinguPackage");

module.exports = {
    name: 'events: guildMemberUpdate',
    /**@param {{preMember: GuildMember, member: GuildMember}}*/
    setContent({ preMember, member }) {
        let description = GetDescription();
        return module.exports.content = description ? new MessageEmbed().setDescription(description) : null;

        function GetDescription() {
            if (member.nickname != preMember.nickname) return PinguEvents.SetRemove(
                'Nickname',
                preMember.nickname,
                member.nickname,
                `Set **${member.user.tag}**'s nickname to ${member.nickname}`,
                `Removed **${member.user.tag}**'s nickname`,
                PinguEvents.SetDescriptionValues
            );
            else if (member.permissions.bitfield != preMember.permissions.bitfield) return PinguEvents.GoThroughArrays(
                'Permissions',
                preMember.permissions.toArray(),
                member.permissions.toArray(),
                ((i, l) => i == l)
            );
            else if (member.premiumSince != preMember.premiumSince) return PinguEvents.SetRemove(
                'Boost',
                preMember.premiumSince,
                member.premiumSince,
                `**${member.user.tag}** boosted ${member.guild.name}`,
                `**${member.user.tag}** is no longer boosting ${member.guild.name}`,
                PinguEvents.SetDescriptionValues
            );
            else if (member.roles.cache.array().length != preMember.roles.cache.array().length) PinguEvents.GoThroughArrays(
                'Roles',
                preMember.roles.cache.array(),
                member.roles.cache.array(),
                ((i, l) => i.id == l.id)
            );
            else if (member.voice.channelID != preMember.voice.channelID) PinguEvents.SetRemove(
                'Voice',
                preMember.voice.channel.name,
                member.voice.channel.name,
                `${member} joined VC ${member.voice.channel.name}`,
                `${member} left VC ${member.voice.channel.name}`,
                PinguEvents.SetDescriptionValues
            );
            let unknown = PinguEvents.UnknownUpdate(preMember, member);
            if (unknown == `Unknown Update: Unable to find what updated`)
                member.client.emit('userUpdate', preMember.user, member.user);
        }
    },
    /**@param {Client} client
     @param {{preMember: GuildMember, member: GuildMember}}*/
    execute(client, { preMember, member }) {

    }
}