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
        'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate', 'typingStart', 'webhookUpdate',                                                                 //channel
        'error', 'invalidated', 'onready',                                                                                                                                      //client
        'emojiCreate', 'emojiDelete', 'emojiUpdate',                                                                                                                            //emoji
        'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMemberUpdate',                                                                                     //guildMember
        'inviteCreate', 'inviteDelete',                                                                                                                                         //invite
        'roleCreate', 'roleDelete', 'roleUpdate',                                                                                                                               //role
        'guildBanAdd', 'guildBanRemove',                                                                                                                                        //guild bans
        'guildCreate', 'guildUpdate', 'guildDelete',                                                                                                                            //guild Crud
        'guildIntegrationsUpdate', 'guildUnavailable', 'presenceUpdate', 'voiceStateUpdate', 'guildMemberSpeaking',                                                             //guild
        'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji',                                                                //messageReaction
        'message', 'messageDelete', 'messageDeleteBulk', 'messageUpdate',                                                                                                       //message
        'userUpdate',                                                                                                                                                           //user
        'chosenUser', 'chosenGuild', 'mostKnownUser'                                                                                                                            //custom
    ], './commands', './events');

    try { var { token } = require('../PinguBetaToken.json'); /*throw null*/ }
    catch { token = config.token; }
    finally { client.login(token); }
})().catch(err => {
    require('fs').writeFile('./errors/startUpError.json', JSON.stringify(err, null, 2))
});