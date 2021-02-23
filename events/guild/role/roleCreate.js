const { MessageEmbed } = require("discord.js");
const { PinguEvent, EmbedField } = require('PinguPackage');

module.exports = new PinguEvent('roleCreate',
    async function setContent(role) {
        return module.exports.content = new MessageEmbed().addFields([
            new EmbedField(`Name`, role.name, true),
            new EmbedField(`Color`, role.hexColor, true),
            new EmbedField(`Hoisted`, role.hoist, true),
            new EmbedField(`Permissions`, role.permissions.toArray().map(p => `• ${p}`).join(`\n`)),
            new EmbedField(`Mentionable?`, role.mentionable)
        ]);
    }
);