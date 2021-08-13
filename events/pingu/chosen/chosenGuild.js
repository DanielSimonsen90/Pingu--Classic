const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('chosenGuild',
    async function setContent(client, embed, guild, pGuild) {
        return module.exports.content = embed.setDescription(`PinguGuild, ${pGuild.name} (${pGuild._id}) has been selected for Server of the Day`)
    },
    async function execute(client, guild, pGuild) {
        return client.AchievementCheck({ guild }, 'EVENT', 'chosenGuild', [guild, pGuild]);
    }
)