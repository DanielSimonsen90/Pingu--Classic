const { GuildMember, Client, MessageEmbed } = require("discord.js");
const DPermissions = require('discord.js').Permissions
const { PinguEvents } = require("../../../PinguPackage");

module.exports = {
    name: 'events: guildMemberUpdate',
    /**@param {{preMember: GuildMember, member: GuildMember}}*/
    setContent({ preMember, member }) {
        return module.exports.content = new MessageEmbed().setDescription(GetDescription());

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
            return PinguEvents.UnknownUpdate(preMember, member);
        }
    },
    /**@param {Client} client
     @param {{preMember: GuildMember, member: GuildMember}}*/
    execute(client, { preMember, member }) {

    }
}