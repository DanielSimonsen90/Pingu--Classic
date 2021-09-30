import { 
    Base, BaseCommandInteraction, BaseGuildVoiceChannel, Collection, CommandInteraction, CommandInteractionOptionResolver, DMChannel, 
    EmojiResolvable, Guild, GuildChannel, GuildMember, InteractionReplyOptions, Message, 
    MessageAttachment, MessageEmbed, MessageMentions, NewsChannel, 
    PartialTextBasedChannelFields, PermissionString, Role, TextChannel, 
    ThreadChannel, User 
} from "discord.js";
import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import ms from 'ms';

import PinguClientBase from './pingu/client/PinguClientBase';
import PinguGuildMemberCollection from "./pingu/collection/PinguGuildMemberCollection";
import PinguGuild from "./pingu/guild/PinguGuild";
import PinguGuildMember from "./pingu/guildMember/PinguGuildMember";
import ReactionRole from "./pingu/guild/items/ReactionRole";
import PChannel from "./database/json/PChannel";
import PinguUser from "./pingu/user/PinguUser";
import { APIMessage, Snowflake } from "discord-api-types";
import Arguments from "./helpers/Arguments";

type Pingu = PinguClientBase;

declare module 'discord.js' {
    interface Base {
        doIn<T>(callback: (self?: this) => T |Promise<T>, time: number | string): Promise<T>
    }
    interface BaseGuildVoiceChannel {
        join(): VoiceConnection
    }
    interface Channel { client: Pingu }
    interface Collection<K, V> {
        // array(): Array<[K, V]>
        // keyArray(): Array<K>
        // valueArray(): Array<V>
        /**
         * @param value Id | tag | displayName | name
         */
        findFromString(value: string): V
    }
    interface BaseCommandInteraction {
        replyPrivate(options: InteractionReplyOptions | string): Promise<Message | APIMessage>
    }
    interface Guild { 
        client: Pingu 

        owner(): GuildMember
        pGuild(): PinguGuild
        member(user: User): GuildMember
        pGuildMembers(): PinguGuildMemberCollection
        welcomeChannel(): TextChannel
    }
    interface GuildMember { 
        client: Pingu
        pGuildMember(): PinguGuildMember
    }
    interface Interaction {
        client: Pingu
    }
    interface Message { 
        client: Pingu 
        reactioRoles(): Collection<EmojiResolvable, ReactionRole>;

        editEmbeds(...embeds: MessageEmbed[]): Promise<this>;
        editFiles(...files: MessageAttachment[]): Promise<this>;
    }
    interface MessageMentions {
        messages(message: Message): Collection<Snowflake, Message>
    }
    interface PartialTextBasedChannelFields {
        sendEmbeds(...embeds: MessageEmbed[]): Promise<Message>
        sendFiles(...files: MessageAttachment[]): Promise<Message>
    }
    interface Role {
        addPermissions(options: { reason?: string, permissions: PermissionString[] }): Promise<Role>
        addPermissions(permissions: PermissionString[]): Promise<Role>
        removePermissions(options: { reason?: string, permissions: PermissionString[] }): Promise<Role>
        removePermissions(permissions: PermissionString[]): Promise<Role>
    }
    interface User { 
        client: Pingu 

        isPinguDev(): boolean
        pUser(): PinguUser
    }
}

//#region Base
Base.prototype.doIn = function<ReturnType>(this: Base, callback: (self?: Base) => ReturnType | Promise<ReturnType>, time: number) {
    const timeout = typeof time == 'number' ? time : ms(time);
    return new Promise<ReturnType>((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(callback(this));
            }, timeout);
        } catch (err) {
            reject(err);
        }
    })
}
//#endregion

//#region BaseGuildVoiceChannel
BaseGuildVoiceChannel.prototype.join = function(this: BaseGuildVoiceChannel) {
    if (!this.joinable) throw new Error(`Voice channel is not joinable!`);

    return joinVoiceChannel({
        channelId: this.id,
        guildId: this.guildId,
        adapterCreator: this.guild.voiceAdapterCreator
    });
}
//#endregion

//#region Collection
// Collection.prototype.array = function<K, V>(this: Collection<K, V>) {
//     return this.reduce((arr, v, k) => {
//         arr.push([k, v]);
//         return arr;
//     }, new Array<[K, V]>())
// }
// Collection.prototype.keyArray = function<K, V>(this: Collection<K, V>) {
//     return [...this.keys()];
// }
// Collection.prototype.valueArray = function<K, V>(this: Collection<K, V>) {
//     return [...this.values()];
// }

type CollectionItem = User & GuildMember & Guild & Role & GuildChannel;
Collection.prototype.findFromString = function<K, V extends CollectionItem>(this: Collection<K, V>, value: string) {
    return [
        this.find(v => v.id == value),
        this.find(v => v.tag == value),
        this.find(v => v.name == value),
        this.find(v => v.displayName == value),
    ].filter(v => v)[0];
}
//#endregion

//#region BaseCommandInteraction
BaseCommandInteraction.prototype.replyPrivate = function(this: CommandInteraction, options: InteractionReplyOptions | string) {
    if (typeof options == 'string') return this.reply({ content: options, ephemeral: true }) as any as Promise<Message | APIMessage>;

    return this.reply({
        ...options,
        ephemeral: true
    }) as any as Promise<Message | APIMessage>
}
//#endregion

//#region Guild
Guild.prototype.owner = function(this: Guild) {
    return this.members.cache.get(this.ownerId);
}
Guild.prototype.pGuild = function(this: Guild) {
    return this.client.pGuilds.get(this);
}
Guild.prototype.member = function(this: Guild, user: User) {
    return this.members.cache.get(user.id);
}
Guild.prototype.pGuildMembers = function(this: Guild) {
    return this.client.pGuildMembers.get(this);
}
Guild.prototype.welcomeChannel =  function(this: Guild) {
    const pGuild = this.pGuild();
    const pWelcomeChannel = pGuild.settings.welcomeChannel;

    if (pWelcomeChannel) return this.channels.cache.get(pWelcomeChannel._id) as TextChannel;

    const welcomeChannel = (this.channels.cache.find(c => c.isText() && ['welcome', 'door', '🚪'].includes(c.name)) || 
        this.systemChannel ||
        this.channels.cache.find(c => c.isText() && c.name == 'general')) as TextChannel;

    pGuild.settings.welcomeChannel = new PChannel(welcomeChannel);

    if (welcomeChannel) this.client.pGuilds.update(pGuild, module.exports.name, `Added welcome channel to **${this}**'s Pingu Guild.`);

    return welcomeChannel;
}
//#endregion

//#region GuildMember
GuildMember.prototype.pGuildMember = function(this: GuildMember) {
    return this.client.pGuildMembers.get(this.guild).get(this);
}
//#endregion

//#region Message
Message.prototype.reactioRoles = function(this: Message) {
    try {
        const { guild } = this;
        if (!guild) throw { reason: 'No guild' }
    
        const pGuild = guild.pGuild();
        if (!pGuild) throw { reason: 'No pGuild' }

        return pGuild.settings.reactionRoles.reduce((result, rr) => {
            const emoji = guild.emojis.cache.find(e => e.name === rr.emoteName) || rr.emoteName;
            return result.set(emoji, rr);
        }, new Collection<EmojiResolvable, ReactionRole>())
    } catch (err) {
        if (err.reason) return new Collection<EmojiResolvable, ReactionRole>();
        throw err;
    }
}

Message.prototype.editEmbeds = function(this: Message, ...embeds: MessageEmbed[]) {
    return this.edit({ embeds })
}
Message.prototype.editFiles = function(this: Message, ...files: MessageAttachment[]) {
    return this.edit({ files })
}
//#endregion

//#region MessageMentions
MessageMentions.prototype.messages = function(this: MessageMentions, message: Message): Collection<Snowflake, Message> {
    const args = new Arguments(message.content);
    const messageMentions = args.getAll(args.mentions.get('SNOWFLAKE').regex);
    if (!messageMentions.length) return new Collection();

    const messages = messageMentions.map(id => 
        this.client.channels.cache.filter(c => c.isText())
        .map(c => c.isText() && c.messages.cache.get(id))
    ).flat().filter(v => v);

    return messages.reduce((result, m) => result.set(m.id, m), new Collection<Snowflake, Message>())
}
//#endregion

//#region PartialTextBasedChannelFields
//#region sendEmbed
function sendEmbed(this: PartialTextBasedChannelFields, ...embeds: MessageEmbed[]) {
    return this.send({ embeds })
}
TextChannel.prototype.sendEmbeds = sendEmbed;
NewsChannel.prototype.sendEmbeds = sendEmbed;
DMChannel.prototype.sendEmbeds = sendEmbed;
ThreadChannel.prototype.sendEmbeds = sendEmbed;
//#endregion

//#region sendFiles
function sendFiles(this: PartialTextBasedChannelFields, ...files: MessageAttachment[]) {
    return this.send({ files });
}
TextChannel.prototype.sendFiles = sendFiles;
NewsChannel.prototype.sendFiles = sendFiles;
DMChannel.prototype.sendFiles = sendFiles;
ThreadChannel.prototype.sendFiles = sendFiles;
//#endregion
//#endregion

//#region Role
Role.prototype.addPermissions = function(this: Role, idk: PermissionString[] | { reason?: string, permissions: PermissionString[] }): Promise<Role> {
    const permissions: PermissionString[] = (idk as any).reason ? (idk as any).permissions : idk;
    const reason = (idk as any).reason
    return this.setPermissions([...this.permissions, ...permissions], reason);
}
Role.prototype.removePermissions = function(this: Role, idk: PermissionString[] | { reason?: string, permissions: PermissionString[] }): Promise<Role> {
    const permissions: PermissionString[] = (idk as any).reason ? (idk as any).permissions : idk;
    const reason = (idk as any).reason
    return this.setPermissions(this.permissions.toArray().filter(p => !permissions.includes(p)), reason);
}
//#endregion

//#region User
User.prototype.isPinguDev = function(this: User) {
    return this.client.developers.isPinguDev(this);
}
User.prototype.pUser = function(this: User) {
    return this.client.pUsers.get(this);
}
//#endregion