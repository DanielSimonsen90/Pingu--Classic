const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguLibrary } = require("PinguPackage");

module.exports = new PinguEvent('mostKnownUser',
    async function setContent(user) {
        return module.exports.content = new MessageEmbed().setDescription(`User, ${user.tag} (${user.id}) has been selected for Most Known User`);
    },
    async function execute(client, user) {
        PinguLibrary.AchievementCheck(client, { user }, 'EVENT', 'mostKnownUser', [user]);
    }
)