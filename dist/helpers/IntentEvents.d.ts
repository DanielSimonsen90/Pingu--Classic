import { ClientEvents } from 'discord.js';
declare type ICreateable<T extends string> = `${T}Create` | `${T}Delete`;
declare type IUpdateable<T extends string> = `${T}Update`;
declare type ICrud<T extends string> = ICreateable<T> | IUpdateable<T>;
declare type IAddable<T extends string> = `${T}Add` | `${T}Remove`;
declare type GuildBanAddable = IAddable<"guildBan">;
declare type GuildCrud = ICrud<"guild">;
declare type GuildMemberCrud = ICrud<"guildMember">;
declare type IntegrationCrud = ICrud<"integration">;
declare type InviteCreateable = ICreateable<"invite">;
declare type MessageCrud = ICrud<"message">;
declare type RoleCrud = ICrud<"role">;
declare type ChannelCrud = ICrud<"channel">;
declare type ThreadCrud = ICrud<"thread">;
declare type StageCrud = ICrud<"stage">;
declare type MessageReactionCrud<T extends string = "messageReaction"> = IAddable<T> | `${T}RemoveAll` | `${T}RemoveEmoji`;
declare type ChannelPinsUpdate = IUpdateable<"channelPins">;
declare type ThreadMemberUpdate = IUpdateable<"threadMember">;
declare type ThreadMembersUpdate = IUpdateable<"threadMembers">;
declare type VoiceStateUpdate = IUpdateable<"voiceState">;
declare type EmojiUpdate = IUpdateable<"emoji">;
declare type StickersUpdate = IUpdateable<"stickers">;
declare type GuildIntegrationUpdate = IUpdateable<"guildIntegration">;
declare type WebhookUpdate = IUpdateable<"webhook">;
declare type PresenceUpdate = IUpdateable<"presence">;
declare type ShardManagement<T extends string = 'shard'> = `${T}Ready` | `${T}Reconnecting` | `${T}Resume` | `${T}Disconnect` | `${T}Error`;
export interface DiscordIntentEvents {
    GUILDS: GuildCrud | RoleCrud | ChannelCrud | ChannelPinsUpdate | ThreadCrud | 'threadListSync' | ThreadMembersUpdate | ThreadMemberUpdate | StageCrud;
    GUILD_MEMBERS: GuildMemberCrud | ThreadMembersUpdate;
    GUILD_BANS: GuildBanAddable;
    GUILD_EMOJIS_AND_STICKERS: EmojiUpdate | StickersUpdate;
    GUILD_INTEGRATIONS: GuildIntegrationUpdate | IntegrationCrud;
    GUILD_WEBHOOKS: WebhookUpdate;
    GUILD_INVITES: InviteCreateable;
    GUILD_VOICE_STATES: VoiceStateUpdate;
    GUILD_PRESENCES: PresenceUpdate;
    GUILD_MESSAGES: MessageCrud | 'messageDeleteBulk';
    GUILD_MESSAGE_REACTIONS: MessageReactionCrud;
    GUILD_MESSAGE_TYPING: 'typingStart';
    DIRECT_MESSAGES: MessageCrud | ChannelPinsUpdate;
    DIRECT_MESSAGE_REACTIONS: MessageReactionCrud;
    DIRECT_MESSAGE_TYPING: 'typingStart';
    CLIENT: 'error' | 'debug' | 'warn' | 'ready' | 'invalidated' | 'rateLimit';
    SHARD: ShardManagement;
}
declare type IChosenOnes<T extends string> = `chosen${T}`;
declare type IOn<T extends keyof ClientEvents> = `on${T}`;
declare type ChosenOnes = IChosenOnes<"Guild"> | IChosenOnes<"User">;
export declare type Events<Intents> = Intents[keyof Intents];
export interface PinguIntentEvents extends DiscordIntentEvents {
    CHOSEN_ONES: ChosenOnes;
    MOST_KNOWN: 'mostKnownUser';
    ON: IOn<"ready">;
}
declare type IConnectable<T extends string = 'voiceChannel'> = `${T}Join` | `${T}Disconnect`;
declare type Playable = 'commandPauseResume' | 'play' | 'resetClient' | 'controlPanelRequest';
declare type IDispatchable<T extends string = 'dispatcher'> = `${T}Start` | `${T}Error` | `${T}Finish`;
export interface PinguMusicIntentEvents extends DiscordIntentEvents {
    MUSIC: IConnectable | Playable | IDispatchable;
}
export {};
