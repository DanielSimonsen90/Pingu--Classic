import { ClientEvents } from 'discord.js'

type ICreateable<T extends string> = `${T}Create` | `${T}Delete`;
type IUpdateable<T extends string> = `${T}Update`;
type ICrud<T extends string> = ICreateable<T> | IUpdateable<T>;
type IAddable<T extends string> = `${T}Add` | `${T}Remove`

type GuildBanAddable = IAddable<"guildBan">
type GuildCrud = ICrud<"guild">;
type GuildMemberCrud = ICrud<"guildMember">;
type IntegrationCrud = ICrud<"integration">;
type InviteCreateable = ICreateable<"invite">;
type MessageCrud = ICrud<"message">;
type RoleCrud = ICrud<"role">;
type ChannelCrud = ICrud<"channel">;
type ThreadCrud = ICrud<"thread">;
type StageCrud = ICrud<"stage">;
type MessageReactionCrud<T extends string = "messageReaction"> = IAddable<T> | `${T}RemoveAll` | `${T}RemoveEmoji`;

type ChannelPinsUpdate = IUpdateable<"channelPins">;
type ThreadMemberUpdate = IUpdateable<"threadMember">;
type ThreadMembersUpdate = IUpdateable<"threadMembers">;
type VoiceStateUpdate = IUpdateable<"voiceState">;
type EmojiUpdate = IUpdateable<"emoji">;
type StickersUpdate = IUpdateable<"stickers">;
type GuildIntegrationUpdate = IUpdateable<"guildIntegration">;
type WebhookUpdate = IUpdateable<"webhook">;
type PresenceUpdate = IUpdateable<"presence">;

type ShardManagement<T extends string = 'shard'> = 
    `${T}Ready` |
    `${T}Reconnecting` |
    `${T}Resume` |
    `${T}Disconnect` |
    `${T}Error`;

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
    SHARD: ShardManagement
}

type IChosenOnes<T extends string> = `chosen${T}`;
type IOn<T extends keyof ClientEvents> = `on${T}`;

type ChosenOnes = IChosenOnes<"Guild"> | IChosenOnes<"User">;

export type Events<Intents> = Intents[keyof Intents];

export interface PinguIntentEvents extends DiscordIntentEvents {
    CHOSEN_ONES: ChosenOnes;
    MOST_KNOWN: 'mostKnownUser'
    ON: IOn<"ready">;
}

type IConnectable<T extends string = 'voiceChannel'> = `${T}Join` | `${T}Disconnect`;
type Playable = 'commandPauseResume' | 'play' | 'resetClient' | 'controlPanelRequest';
type IDispatchable<T extends string = 'dispatcher'> =
    `${T}Start` |
    `${T}Error` |
    `${T}Finish` 

export interface PinguMusicIntentEvents extends DiscordIntentEvents {
    MUSIC: IConnectable | Playable | IDispatchable
}