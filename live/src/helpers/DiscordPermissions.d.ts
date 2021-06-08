import { PermissionString } from 'discord.js';
interface DiscordPermissionsInterface extends Record<PermissionString, PermissionString> {
}
export declare class DiscordPermissions implements DiscordPermissionsInterface {
    CREATE_INSTANT_INVITE: PermissionString;
    KICK_MEMBERS: PermissionString;
    BAN_MEMBERS: PermissionString;
    ADMINISTRATOR: PermissionString;
    MANAGE_CHANNELS: PermissionString;
    MANAGE_GUILD: PermissionString;
    ADD_REACTIONS: PermissionString;
    VIEW_AUDIT_LOG: PermissionString;
    PRIORITY_SPEAKER: PermissionString;
    STREAM: PermissionString;
    VIEW_CHANNEL: PermissionString;
    SEND_MESSAGES: PermissionString;
    SEND_TTS_MESSAGES: PermissionString;
    MANAGE_MESSAGES: PermissionString;
    EMBED_LINKS: PermissionString;
    ATTACH_FILES: PermissionString;
    READ_MESSAGE_HISTORY: PermissionString;
    MENTION_EVERYONE: PermissionString;
    USE_EXTERNAL_EMOJIS: PermissionString;
    VIEW_GUILD_INSIGHTS: PermissionString;
    CONNECT: PermissionString;
    SPEAK: PermissionString;
    MUTE_MEMBERS: PermissionString;
    DEAFEN_MEMBERS: PermissionString;
    MOVE_MEMBERS: PermissionString;
    USE_VAD: PermissionString;
    CHANGE_NICKNAME: PermissionString;
    MANAGE_NICKNAMES: PermissionString;
    MANAGE_ROLES: PermissionString;
    MANAGE_WEBHOOKS: PermissionString;
    MANAGE_EMOJIS: PermissionString;
}
export {};
