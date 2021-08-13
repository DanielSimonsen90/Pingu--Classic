const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('mostKnownUser',
    async function setContent(client, embed, user) {
        return module.exports.content = embed.setDescription( `User, ${user.tag} (${user.id}) has been selected for Most Known User`)
    },
    async function execute(client, user) {
        client.AchievementCheck({ user }, 'EVENT', 'mostKnownUser', [user]);
    }
)