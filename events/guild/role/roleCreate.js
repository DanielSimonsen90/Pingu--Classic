const { Client, Role, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'events: roleCreate',
    /**@param {{role: Role}}*/
    setContent({ role }) {
        return module.exports.content = new MessageEmbed()
            .addField(`Name`, role.name, true)
            .addField(`Color`, role.hexColor, true)
            .addField(`Hoisted`, role.hoist, true)
            .addField(`Permissions`, role.permissions.toArray().map(p => `• ${p}`).join(`\n`))
            .addField(`Mentionable?`, role.mentionable);
    },
    /**@param {Client} client
     @param {{role: Role}}*/
    execute(client, { role }) {

    }
}