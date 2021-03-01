﻿const Discord = require('discord.js');

try { main(); }
catch (err) {
    console.log(err);
}

async function main() {
    const { config, PinguClient } = require('PinguPackage');
    const client = new PinguClient(config, [
        'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate', 'typingStart', 'webhookUpdate',                                                                 //channel
        'error', 'invalidated', 'ready',                                                                                                                                        //client
        'emojiCreate', 'emojiDelete', 'emojiUpdate',                                                                                                                            //emoji
        'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMemberUpdate',                                                                                     //guildMember
        'inviteCreate', 'inviteDelete',                                                                                                                                         //invite
        'roleCreate', 'roleDelete', 'roleUpdate',                                                                                                                               //role
        'guildBanAdd', 'guildBanRemove', 'guildCreate', 'guildDelete', 'guildIntegrationsUpdate', 'guildUnavailable', 'guildUpdate', 'presenceUpdate', 'voiceStateUpdate',      //guild
        'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji',                                                                //messageReaction
        'message', 'messageDelete', 'messageDeleteBulk', 'messageUpdate',                                                                                                       //message
        'userUpdate'                                                                                                                                                            //user
    ], './commands', './events');

    try { var { token } = require('../../PinguBetaToken.json'); /*throw null*/ }
    catch { token = config.token; }
    finally { client.login(token); }
}