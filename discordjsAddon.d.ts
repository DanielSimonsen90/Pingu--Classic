declare module 'discord.js Addons' {
    import { Client, Collection, Guild, GuildEmoji, GuildMember, Invite, Message, MessageEmbed, MessageReaction, PermissionString, Presence, Role, User, VoiceState } from 'discord.js';

    interface PinguCommandData {
        name: string
        description: string
        usage: string
        guildOnly: boolean
        id: 1 | 2 | 3 | 4
        examples: string[]
        permissions: PermissionString[]
        execute(params: {
            message: Message,
            args: string[],
            pAuthor: import('./PinguPackage').PinguUser,
            pGuild: import('./PinguPackage').PinguGuild,
            pGuildClient: import('./PinguPackage').PClient
        })
    }
    export class PinguCommand {
        public name: string
        public description: string
        public usage: string
        public guildOnly: boolean
        public id: 1 | 2 | 3 | 4
        public examples: string[]
        public permissions: PermissionString[]
        public execute(params: {
            message: Message,
            args: string[],
            pAuthor: import('./PinguPackage').PinguUser,
            pGuild: import('./PinguPackage').PinguGuild,
            pGuildClient: import('./PinguPackage').PClient
        })
    }

    interface PinguEventData {
        client?: Client,
        messages?: Collection<string, Message>,
        reaction?: MessageReaction,
        invite?: Invite,

        guild?: Guild,
        preGuild?: Guild,

        message?: Message,
        preMessage?: Message,

        member?: GuildMember,
        preMember?: GuildMember,

        user?: User,
        preUser?: User,

        emote?: GuildEmoji,
        preEmote?: GuildEmoji,

        presence?: Presence,
        prePresence?: Presence,

        role?: Role,
        preRole?: Role,

        state?: VoiceState
        preState?: VoiceState
    }
    export class PinguEvent {
        public name: string
        public setContent(data: PinguEventData): MessageEmbed
        public content: MessageEmbed
        public execute(client: Client, data: PinguEventData);
    }
}