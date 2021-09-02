import './GuildMember';
import './Message';
import './PartialTextBasedChannelFields';
import './TextChannel';
import './User';
import { VoiceConnection } from "@discordjs/voice";
import ReactionRole from "../pingu/guild/items/ReactionRole";
import BasePinguClient from "../pingu/client/BasePinguClient";
import PinguGuild from '../pingu/guild/PinguGuild';
import PinguGuildMemberCollection from '../pingu/collection/PinguGuildMemberCollection';
import PinguGuildMember from "../pingu/guildMember/PinguGuildMember";
import PinguUser from '../pingu/user/PinguUser';
declare type Pingu = BasePinguClient;
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
        array(): Array<V>;
        keyArray(): Array<K>;
        findByDisplayName(name: string): V;
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
    interface Message {
        client: Pingu;
        reactioRoles(): Collection<EmojiResolvable, ReactionRole>;
        editEmbeds(...embeds: MessageEmbed[]): Promise<this>;
        editFiles(...files: MessageAttachment[]): Promise<this>;
    }
    interface PartialTextBasedChannelFields {
        sendEmbeds(...embeds: MessageEmbed[]): Promise<Message>;
        sendFiles(...files: MessageAttachment[]): Promise<Message>;
    }
    interface User {
        client: Pingu;
        isPinguDev(): boolean;
        pUser(): PinguUser;
    }
}
export {};