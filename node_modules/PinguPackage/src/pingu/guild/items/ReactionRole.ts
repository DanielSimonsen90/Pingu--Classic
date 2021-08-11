import { Message, Role, GuildChannel, MessageReaction, Client, User, MessageEmbed, Collection } from "discord.js";
import PinguGuild from '../PinguGuild';
import { PRole, PChannel } from '../../../database/json';
import { Clients } from '../../client/BasePinguClient';
import { ToPinguClient } from '../../client/PinguClient';

export async function GetReactionRole(reaction: MessageReaction, user: User) {
    let { guild } = reaction.message;
    if (!guild) return;

    const client = ToPinguClient(reaction.client);

    let pGuild = client.pGuilds.get(guild);
    const rr = pGuild.settings.reactionRoles.find(rr =>
        rr.messageID == reaction.message.id &&
        (rr.emoteName == reaction.emoji.name) &&
        rr.channel._id == reaction.message.channel.id
    );
    if (!rr) return null;

    let { pRole } = rr;
    let member = guild.members.cache.get(user.id);

    let permCheck = client.permissions.checkFor({
        author: client.user,
        channel: reaction.message.channel as GuildChannel,
    }, 'MANAGE_ROLES');
    if (permCheck != client.permissions.PermissionGranted) {
        guild.members.cache.get(guild.ownerId).send(`I tried to give ${member.displayName} "${pRole.name}", as ${permCheck}`);
        user.send(`I'm unable to give you the reactionrole at the moment! I've contacted ${guild.members.cache.get(guild.ownerId)} about this.`);
        return null;
    }

    return guild.roles.fetch(pRole._id);
}
export async function OnReactionAdd(reaction: MessageReaction, user: User) {
    const client = ToPinguClient(reaction.client);

    try {
        const role = await GetReactionRole(reaction, user);
        if (!role) return;

        const member = reaction.message.guild.members.cache.get(user.id);

        member.roles.add(role, `ReactionRole in ${(reaction.message.channel as GuildChannel).name}.`)
            .catch(err => client.log('error', `Unable to give **${user.tag}** "${role.name}" role for reacting!`, null, err, {
                params: { client, reaction, user },
                trycatch: { role, member }
            }))
            .then(() => client.log('console', `Gave **${user.tag}** "${role.name}" for ReactionRole`));

    } catch (err) {
        client.log('error', `${module.exports.name} error`, null, err, { params: { reaction, user } });
    }
}
export async function OnReactionRemove(reaction: MessageReaction, user: User) {
    const client = ToPinguClient(reaction.client);

    if (client.id == user.id) {
        const pGuild = client.pGuilds.get(reaction.message.guild);
        const rr = pGuild.settings.reactionRoles.find(rr => rr.messageID == reaction.message.id && rr.emoteName == reaction.emoji.name);

        return RemoveReactionRole(rr, pGuild.settings.reactionRoles, pGuild, client);
    }

    try {
        const role = await GetReactionRole(reaction, user);
        if (!role) return;

        const member = reaction.message.guild.members.cache.get(user.id);

        member.roles.remove(role, `ReactionRole in ${(reaction.message.channel as GuildChannel).name}.`)
            .catch(err => client.log('error', `Unable to remove ${user.username}'s ${role.name} role for unreacting!`, null, err, {
                params: { client, reaction, user },
                trycatch: { role, member }
            }));
        client.log('error', `Removed ${user.tag}'s "${role.name}" role for ReactionRole`);
    } catch (err) {
        client.log('error', `ReactionRole.OnReactionRemove error`, null, err, { params: { client, reaction, user } });
    }
}
export async function OnReactionRemoveAll(message: Message) {
    const { guild, id, client: _client } = message;
    const client = ToPinguClient(_client);

    let pGuild = client.pGuilds.get(guild);
    if (!pGuild.settings.reactionRoles[0]) return;

    for (var rr of pGuild.settings.reactionRoles) {
        if (rr.messageID != id) continue;

        let i = pGuild.settings.reactionRoles.indexOf(rr)
        pGuild.settings.reactionRoles.splice(i, 1);

        client.log('error', `Removed ${rr.emoteName} => ${rr.pRole.name}`);
    }

    return client.pGuilds.update(pGuild, 'ReactionRole.OnreactionRemoveAll()', `Removed **${guild.name}**'s reactionroles for ${id}`)
}
export async function RemoveReaction(reaction: MessageReaction) {
    const { guild, client: _client, id } = reaction.message;
    if (!guild) return;
    
    const client = ToPinguClient(_client);
    let pGuild = client.pGuilds.get(guild);
    if (!pGuild) return;

    let { reactionRoles } = pGuild.settings;
    if (!reactionRoles) return;

    let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name && rr.messageID == id);
    if (!rr) return;

    return RemoveReactionRole(rr, reactionRoles, pGuild, client);
}
export async function RemoveReactionRole(rr: ReactionRole, reactionRoles: ReactionRole[], pGuild: PinguGuild, _client: Client) {
    let i = reactionRoles.indexOf(rr);
    reactionRoles.splice(i);
    pGuild.settings.reactionRoles = reactionRoles;

    return ToPinguClient(_client).pGuilds.update(pGuild, `ReactionRole.RemoveReactionRole()`, `Removed ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`)
}
export async function OnMessageDelete(message: Message) {
    const { guild, id, client: _client } = message;
    if (!guild) return;

    const client = ToPinguClient(_client);
    const pGuild = client.pGuilds.get(guild);
    if (!pGuild) return;

    const pGuildClient = client.toPClient(pGuild);

    const { reactionRoles } = pGuild.settings;
    const rrFromMessage = reactionRoles.filter(rr => rr.messageID == id && rr.pRole)

    if (!rrFromMessage) return;

    const rrEmotes = rrFromMessage.map(rr => rr.emoteName);

    const warningMessageInfo = await Promise.all(rrFromMessage.map(async rr => `${guild.emojis.cache.find(r => r.name == rr.emoteName) || rr.emoteName}: ${await guild.roles.fetch(rr.pRole._id) || rr.pRole.name}`));
    if (!warningMessageInfo[0]) return;

    for (var [_, reaction] of message.reactions.cache) {
        if (!rrEmotes.includes(reaction.emoji.name)) continue;

        let gMembers = reaction.users.cache.map(u => guild.members.cache.get(u.id));
        let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name);
        let role = await guild.roles.fetch(rr.pRole._id);

        for (var gm of gMembers) await gm.roles.remove(role, `ReactionRole message deleted`);
    }
    
    const bots = new Collection<string, User>(
        ...message.reactions.cache.map(r => r.users.cache
            .filter(u => u.bot && [Clients.BetaID, Clients.PinguID].includes(u.id))
            .map((v, k) => [k, v] as readonly [string, User])
        )
    );
    
    const PinguReacted = bots.get(Clients.PinguID) != null;
    const PinguOnline = client.savedServers.get('Pingu Support').members.cache.get(client.clients.get('Live').id).presence.status == 'online';

    if (PinguReacted && PinguOnline && !client.isLive) return; 

    pGuild.settings.reactionRoles == pGuild.settings.reactionRoles.filter(rr => !rrFromMessage.includes(rr));
    client.pGuilds.update(pGuild, `ReactionRole.OnMessageDelete()`, `Reaction Roles removed due to reaction role message being deleted.`)

    return message.author.send({
        embeds: [
            new MessageEmbed({
                title: `ReactionRole message deleted!`,
                color: pGuildClient.embedColor,
                timestamp: Date.now(),
                description: [
                    `**Your reactionrole message in ${message.channel} was deleted!**`,
                    `It had these reactionroles assigned to it:`,
                    warningMessageInfo.join(`\n`)
                ].join('\n')
            })
        ]
    })
}

export class ReactionRole {
    constructor(message: Message, reactionName: string, role: Role) {
        this.emoteName = reactionName;
        this.pRole = new PRole(role);
        this.channel = new PChannel(message.channel as GuildChannel);
        this.messageID = message.id;
    }

    public channel: PChannel
    public messageID: string
    public emoteName: string
    public pRole: PRole

    public static async GetReactionRole(reaction: MessageReaction, user: User) { return GetReactionRole(reaction, user); }
    public static async OnReactionAdd(reaction: MessageReaction, user: User) { return OnReactionAdd(reaction, user); }
    public static async OnReactionRemove(reaction: MessageReaction, user: User) { return OnReactionRemove(reaction, user); }
    public static async OnReactionRemoveAll(message: Message) { return OnReactionRemoveAll(message); }
    public static async RemoveReaction(reaction: MessageReaction) { return RemoveReaction(reaction); }
    public static async RemoveReactionRole(rr: ReactionRole, reactionRoles: ReactionRole[], pGuild: PinguGuild, client: Client) { return RemoveReactionRole(rr, reactionRoles, pGuild, client) }
    public static async OnMessageDelete(message: Message) { return OnMessageDelete(message); }
}

export default ReactionRole;