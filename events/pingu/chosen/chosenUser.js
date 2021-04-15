const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguLibrary } = require("PinguPackage");

module.exports = new PinguEvent('chosenUser',
    async function setContent(user, pUser) {
        return module.exports.content = new MessageEmbed().setDescription(`PinguUser, ${pUser.tag} (${pUser._id}) has been selected for User of the Day`);
    },
    async function execute(client, user, pUser) {
        return PinguLibrary.AchievementCheck(client, { user }, 'EVENT', 'chosenUser', [user, pUser]);
    }
)