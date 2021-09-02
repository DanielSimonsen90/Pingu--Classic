const Discord = require('discord.js');

(async function main() {
    const { config, PinguClient } = require('PinguPackage');
    const client = new PinguClient(config, [
        'ADD_REACTIONS', 'ATTACH_FILES', 'CHANGE_NICKNAME', 'CONNECT', 'EMBED_LINKS', 
        'MANAGE_CHANNELS', 'MANAGE_EMOJIS', 'MANAGE_MESSAGES', 'MANAGE_ROLES',
        'READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'SPEAK', 
        'USE_EXTERNAL_EMOJIS', 'USE_VAD', 
        'VIEW_AUDIT_LOG', 'VIEW_CHANNEL'
    ], [
        'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate', 'typingStart', 'webhookUpdate',
        'error', 'invalidated', 'onready',
        'emojiCreate', 'emojiUpdate', 'emojiDelete', 'stickerCreate', 'stickerUpdate', 'stickerDelete',
        'guildMemberAdd', 'guildMemberUpdate', 'guildMemberRemove', 'guildMemberAvailable',
        'inviteCreate', 'inviteDelete',
        'roleCreate', 'roleUpdate', 'roleDelete',
        'guildBanAdd', 'guildBanRemove',
        'guildCreate', 'guildUpdate', 'guildDelete',
        'guildIntegrationUpdate', 'guildUnavailable', 'presenceUpdate', 'voiceStateUpdate',
        'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji',
        'messageCreate', 'messageUpdate', 'messageDelete', 'messageDeleteBulk',
        'userUpdate',
        'applicationCommandCreate', 'applicationCommandDelete', 'applicationCommandUpdate',
        'interactionCreate', 'interaction',
        'chosenUser', 'chosenGuild', 'mostKnownUser'
    ], __dirname, 'commands', 'events', { 
        intents: [
            'GUILDS', //guildCrud, roleCrud, channelCrud, channelPinsUpdate, threadCrud, threadListSync, threadMembersUpdate, threadMemberUpdate, stageCrud
            'GUILD_MEMBERS', //guildMemberCrud, threadMembersUpdate
            'GUILD_BANS', //guildBanAdd, guildBanRemove
            'GUILD_EMOJIS_AND_STICKERS', //emojiUpdate, stickersUpdate
            'GUILD_INTEGRATIONS', //guildIntergrationUpdate, intergationCrud
            // 'GUILD_WEBHOOKS', //webhookUpdate
            'GUILD_INVITES', //inviteCreate, inviteDelete
            'GUILD_VOICE_STATES', //voiceStateUpdate
            'GUILD_PRESENCES', //presenceUpdate
            'GUILD_MESSAGES', //messageCrud, messageDeleteBulk
            'GUILD_MESSAGE_REACTIONS', //messageReactionCreate, messageReactionRemove, messageReactionRemoveAll, messageReactionRemoveEmoji
            'GUILD_MESSAGE_TYPING', //typingStart
            'DIRECT_MESSAGES', //messageCrud, channelPinsUpdate
            'DIRECT_MESSAGE_REACTIONS', //messageReactionAdd, messageReactionRemove, messageReactionRemoveAll, messageReactionRemoveEmoji,
            // 'DIRECT_MESSAGE_TYPING' //typingStart
        ] 
    });

    try { var { token } = require('../PinguBetaToken.json'); /*throw null*/ }
    catch { token = config.token; }
    finally { client.login(token); }
})().catch(({ message, stack}) => {
    const err = { message, stack };
    const myStack = stack.split('\n');
    require('fs').writeFile('./errors/startUpError.json', JSON.stringify(err, null, 2))
});