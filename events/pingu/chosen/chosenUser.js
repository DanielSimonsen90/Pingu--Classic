const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('chosenUser',
    async function setContent(client, embed, user, pUser) {
        return module.exports.content = embed.setDescription(`PinguUser, ${pUser.tag} (${pUser._id}) has been selected for User of the Day`);
    },
    async function execute(client, user, pUser) {
        return client.AchievementCheck({ user }, 'EVENT', 'chosenUser', [user, pUser]);
    }
)