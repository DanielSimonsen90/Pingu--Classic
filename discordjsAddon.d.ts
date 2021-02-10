import { PinguUser, PinguGuild, PClient } from 'PinguPackage'
import {
    Client, Collection, Guild, GuildEmoji, GuildMember,
    Invite, Message, MessageEmbed, MessageReaction,
    PermissionString, Presence, Role, User, VoiceState
} from 'discord.js';


declare module 'pingu-discord.js-addons' {
    export enum CommandIDs {
        Utility = 1,
        Fun = 2,
        Support = 3,
        DevOnly = 4
    }
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
            pAuthor: PinguUser,
            pGuild: PinguGuild,
            pGuildClient: PClient
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