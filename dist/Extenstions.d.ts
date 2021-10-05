import { VoiceConnection } from "@discordjs/voice";
import { Snowflake } from "discord-api-types";
import PinguClientBase from './pingu/client/PinguClientBase';
import PinguGuildMemberCollection from "./pingu/collection/PinguGuildMemberCollection";
import PinguGuild from "./pingu/guild/PinguGuild";
import ReactionRole from "./pingu/guild/items/ReactionRole";
import PinguGuildMember from "./pingu/guildMember/PinguGuildMember";
import PinguUser from "./pingu/user/PinguUser";
import PinguArray from './helpers/Array';
import { ReplyReturn } from ".";
declare type Pingu = PinguClientBase;
declare global {
    interface Array<T> {
        pArray(): PinguArray<T>;
    }
    interface String {
        toPascalCase(): string;
        clip(start: number, end?: number): string;
    }
}
declare module 'discord.js' {
    interface Base {
        doIn<T>(callback: (self?: this) => T | Promise<T>, time: number | string): Promise<T>;
    }
    interface BaseGuildVoiceChannel {
        join(): VoiceConnection;
    }
    interface Channel {
        client: Pingu;
    }
    interface Collection<K, V> {
        array(): PinguArray<[K, V]>;
        keyArr(): PinguArray<K>;
        valueArr(): PinguArray<V>;
        /**
         * @param value Id | tag | displayName | name
         */
        findFromString(value: string): V;
    }
    interface CommandInteraction {
        replyPrivate(options: ReplyOptions): ReplyReturn;
    }
    interface Guild {
        client: Pingu;
        owner(): GuildMember;
        pGuild(): PinguGuild;
        member(user: User): GuildMember;
        pGuildMembers(): PinguGuildMemberCollection;
        welcomeChannel(): TextChannel;
    }
    interface GuildMember {
        client: Pingu;
        pGuildMember(): PinguGuildMember;
    }
    interface Interaction {
        client: Pingu;
    }
    interface Message {
        client: Pingu;
        reactioRoles(): Collection<EmojiResolvable, ReactionRole>;
        editEmbeds(...embeds: MessageEmbed[]): Promise<this>;
        editFiles(...files: MessageAttachment[]): Promise<this>;
    }
    interface MessageMentions {
        messages(message: Message): Collection<Snowflake, Message>;
    }
    interface PartialTextBasedChannelFields {
        sendEmbeds(...embeds: MessageEmbed[]): Promise<Message>;
        sendFiles(...files: MessageAttachment[]): Promise<Message>;
    }
    interface Role {
        addPermissions(options: {
            reason?: string;
            permissions: PermissionString[];
        }): Promise<Role>;
        addPermissions(permissions: PermissionString[]): Promise<Role>;
        removePermissions(options: {
            reason?: string;
            permissions: PermissionString[];
        }): Promise<Role>;
        removePermissions(permissions: PermissionString[]): Promise<Role>;
    }
    interface User {
        client: Pingu;
        isPinguDev(): boolean;
        pUser(): PinguUser;
    }
}
export {};
