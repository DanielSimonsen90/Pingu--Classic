declare module 'discord.js Addons' {
    import {
        Client, Collection, Guild, GuildEmoji, GuildMember,
        Invite, Message, MessageEmbed, MessageReaction,
        PermissionString, Presence, Role, User, VoiceState
    } from 'discord.js';

    export class PinguCommand {
        public name: string
        public path: string
        public description: string
        public usage: string
        public guildOnly: boolean
        public id: 1 | 2 | 3 | 4
        public examples: string[]
        public permissions: PermissionString[]
        public aliases: string[]
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
        public path: string
        public setContent(data: PinguEventData): MessageEmbed
        public content: MessageEmbed
        public execute(client: Client, data: PinguEventData);
    }
}
