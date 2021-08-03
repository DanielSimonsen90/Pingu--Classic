const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguLibrary } = require("PinguPackage");

module.exports = new PinguEvent('mostKnownUser',
    async function setContent(client, user) {
        return module.exports.content = new MessageEmbed({ description: `User, ${user.tag} (${user.id}) has been selected for Most Known User` })
    },
    async function execute(client, user) {
        client.AchievementCheck({ user }, 'EVENT', 'mostKnownUser', [user]);
    }
)