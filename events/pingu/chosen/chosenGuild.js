const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguLibrary } = require("PinguPackage");

module.exports = new PinguEvent('chosenGuild',
    async function setContent(guild, pGuild) {
        return module.exports.content = new MessageEmbed().setDescription(`PinguGuild, ${pGuild.name} (${pGuild._id}) has been selected for Server of the Day`);
    },
    async function execute(client, guild, pGuild) {
        return PinguLibrary.AchievementCheck(client, { guild }, 'EVENT', 'chosenGuild', [guild, pGuild]);
    }
)