const { Message, RoleManager } = require('discord.js');
const { DiscordPermissions, PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'santa',
    description: `Santa himself tells ya if you're good or naughty`,
    usage: '',
    guildOnly: true,
    id: 2,
    example: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {Message} message @param {string[]} args*/
    async execute(message, args) {
        //No more christmas
        if (Date.now() > new Date(2020, 12, 26).getTime()) 
            /**@param {string} roleName*/
            message.client.guilds.cache.forEach(async guild => {
                let deleteRole = (roleName) => {
                    let role = guild.roles.cache.find(r => r.name == roleName)
                    if (!role) return;

                    return role.delete(`Christmas is no more`);
                };

                await deleteRole('Nice');
                await deleteRole('Naughty');

                await PinguLibrary.DanhoDM(message.client, `Removed Good & Naughty roles at **${guild.name}**`);
            });
        

        let guildRoles = message.guild.roles.cache;
        let roles = {
            nice: guildRoles.find(r => r.name == 'Nice') || await CreateRole(message.guild.roles, "Nice"),
            naughty: guildRoles.find(r => r.name == 'Naughty') || await CreateRole(message.guild.roles, "Naughty")
        }

        if (!roles.nice) return message.channel.send(`I couldn't find the Good role!`);
        if (!roles.naughty) return message.channel.send(`I couldn't find the Naughty role!`);

        if (message.member.roles.cache.has(roles.nice.id) || message.member.roles.cache.has(roles.naughty.id))
            return message.channel.send(`Hohoho! I've already given you your ${(message.member.roles.cache.has(roles.nice.id) ? "Nice" : "Naughty")} role!`)

        let role = Math.round(Math.random() * 2) == 1 ? roles.nice : roles.naughty;

        await message.member.roles.add(role);
        message.channel.send(`Hohoho! I see you've been a **${role.name}** one this year!`);
        PinguLibrary.DanhoDM(message.client, `Gave ${message.author.username} ${role.name} for using *santa`);
    }
}
/**@param {RoleManager} roles
 * @param {string} roleName*/
async function CreateRole(roles, roleName) {
    return await roles.create({ data: { name: roleName, hoist: true } });
}