const Discord = require('discord.js');

try { main(); }
catch (err) {
    console.log(err);
}

async function main() {
    const { config, PinguClient } = require('PinguPackage');
    const client = new PinguClient(config, [
        'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate', 'typingStart', 'webhookUpdate',                                                                                 //channel
        'error', 'invalidated', 'ready',
        'emojiCreate', 'emojiDelete', 'emojiUpdate',
        'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMemberUpdate',
        'inviteCreate', 'inviteDelete',
        'roleCreate', 'roleDelete', 'roleUpdate',
        'guildBanAdd', 'guildBanRemove', 'guildCreate', 'guildDelete', 'guildIntegrationsUpdate', 'guildUnavailable', 'guildUpdate', 'presenceUpdate', 'voiceStateUpdate',
        'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji',
        'message', 'messageDelete', 'messageDeleteBulk', 'messageUpdate',
        'userUpdate'
    ], './commands', './events');

    try { var { token } = require('../../PinguBetaToken.json'); /*throw null*/ }
    catch { token = config.token; }
    finally { client.login(token); }
}