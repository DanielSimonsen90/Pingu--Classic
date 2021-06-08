import { PermissionString } from 'discord.js';

export const DiscordPermissions = new class DiscordPermissions implements Record<PermissionString, PermissionString> {
    CREATE_INSTANT_INVITE = 'CREATE_INSTANT_INVITE' as PermissionString
    KICK_MEMBERS = 'KICK_MEMBERS' as PermissionString
    BAN_MEMBERS = 'BAN_MEMBERS' as PermissionString
    ADMINISTRATOR = 'ADMINISTRATOR' as PermissionString
    MANAGE_CHANNELS = 'MANAGE_CHANNELS' as PermissionString
    MANAGE_GUILD = 'MANAGE_GUILD' as PermissionString
    ADD_REACTIONS = 'ADD_REACTIONS' as PermissionString
    VIEW_AUDIT_LOG = 'VIEW_AUDIT_LOG' as PermissionString
    PRIORITY_SPEAKER = 'PRIORITY_SPEAKER' as PermissionString
    STREAM = 'STREAM' as PermissionString
    VIEW_CHANNEL = 'VIEW_CHANNEL' as PermissionString
    SEND_MESSAGES = 'SEND_MESSAGES' as PermissionString
    SEND_TTS_MESSAGES = 'SEND_TTS_MESSAGES' as PermissionString
    MANAGE_MESSAGES = 'MANAGE_MESSAGES' as PermissionString
    EMBED_LINKS = 'EMBED_LINKS' as PermissionString
    ATTACH_FILES = 'ATTACH_FILES' as PermissionString
    READ_MESSAGE_HISTORY = 'READ_MESSAGE_HISTORY' as PermissionString
    MENTION_EVERYONE = 'MENTION_EVERYONE' as PermissionString
    USE_EXTERNAL_EMOJIS = 'USE_EXTERNAL_EMOJIS' as PermissionString
    VIEW_GUILD_INSIGHTS = 'VIEW_GUILD_INSIGHTS' as PermissionString
    CONNECT = 'CONNECT' as PermissionString
    SPEAK = 'SPEAK' as PermissionString
    MUTE_MEMBERS = 'MUTE_MEMBERS' as PermissionString
    DEAFEN_MEMBERS = 'DEAFEN_MEMBERS' as PermissionString
    MOVE_MEMBERS = 'MOVE_MEMBERS' as PermissionString
    USE_VAD = 'USE_VAD' as PermissionString
    CHANGE_NICKNAME = 'CHANGE_NICKNAME' as PermissionString
    MANAGE_NICKNAMES = 'MANAGE_NICKNAMES' as PermissionString
    MANAGE_ROLES = 'MANAGE_ROLES' as PermissionString
    MANAGE_WEBHOOKS = 'MANAGE_WEBHOOKS' as PermissionString
    MANAGE_EMOJIS = 'MANAGE_EMOJIS' as PermissionString
}

export default DiscordPermissions;