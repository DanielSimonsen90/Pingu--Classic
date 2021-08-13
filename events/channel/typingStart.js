const { PinguEvent } = require('PinguPackage');

module.exports = new PinguEvent('typingStart',
    async function setContent(client, embed, typing) {
        return module.exports.content = embed.setDescription(
            `[${client.timeFormat(typing.startedTimestamp, 'LONG_TIME')}] **${typing.user}** started typing in ${typing.channel}${typing.guild ? `, ${typing.guild}` : ''}.`
        );
    }
);