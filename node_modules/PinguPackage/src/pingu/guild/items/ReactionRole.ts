import { Message, Role, GuildChannel, MessageReaction, Client, User, MessageEmbed } from "discord.js";
import { GetPGuild, UpdatePGuild, PinguGuild } from "../PinguGuild";
import { PRole, PChannel } from "../../../database/json";
import { PermissionCheck, PermissionGranted, errorLog, consoleLog } from "../../library/PinguLibrary";
import { ToPinguClient } from '../../client/PinguClient'

export async function GetReactionRole(client: Client, reaction: MessageReaction, user: User) {
    let guild = reaction.message.guild;
    if (!guild) return;

    let pGuild = await GetPGuild(guild);
    var rr = pGuild.settings.reactionRoles.find(rr =>
        rr.messageID == reaction.message.id &&
        (rr.emoteName == reaction.emoji.name) &&
        rr.channel._id == reaction.message.channel.id
    );
    if (!rr) return null;

    let { pRole } = rr;
    let member = guild.member(user);

    let permCheck = PermissionCheck({
        author: client.user,
        client,
        channel: reaction.message.channel as GuildChannel,
        content: "No content provided"
    }, 'MANAGE_ROLES');
    if (permCheck != PermissionGranted) {
        guild.owner.send(`I tried to give ${member.displayName} the ${pRole.name}, as ${permCheck}`);
        user.send(`I'm unable to give you the reactionrole at the moment! I've contacted ${user.username} about this.`);
        return null;
    }

    return guild.roles.fetch(pRole._id);
}
export async function OnReactionAdd(reaction: MessageReaction, user: User) {
    const { client } = user;
    try {
        var role = await GetReactionRole(client, reaction, user);
        if (!role) return;

        var member = reaction.message.guild.member(user);

        member.roles.add(role, `ReactionRole in ${(reaction.message.channel as GuildChannel).name}.`)
            .catch(err => errorLog(client, `Unable to give ${user.username} the ${role.name} role for reacting!`, null, err, {
                params: { client, reaction, user },
                trycatch: { role, member }
            }))
            .then(() => consoleLog(client, `Gave ${user.username} ${role.name} for ReactionRole`));

    } catch (err) {
        errorLog(client, `${module.exports.name} error`, null, err, {
            params: { client, reaction, user },
            trycatch: { role, member }
        });
    }
}
export async function OnReactionRemove(reaction: MessageReaction, user: User) {
    const { client } = reaction.message;
    try {
        var role = await GetReactionRole(client, reaction, user);
        if (!role) return;

        var member = reaction.message.guild.member(user);

        member.roles.remove(role, `ReactionRole in ${(reaction.message.channel as GuildChannel).name}.`)
            .catch(err => errorLog(client, `Unable to remove ${user.username}'s ${role.name} role for unreacting!`, null, err, {
                params: { client, reaction, user },
                trycatch: { role, member }
            }));
        consoleLog(client, `Removed ${user.username}'s ${role.name} role for ReactionRole`);
    } catch (err) {
        errorLog(client, `ReactionRole.OnReactionRemove error`, null, err, {
            params: { client, reaction, user },
            trycatch: { role, member }
        });
    }
}
export async function OnReactionRemoveAll(message: Message, client?: Client) {
    if (!client) client = message.client;

    let pGuild = await GetPGuild(message.guild);
    if (!pGuild.settings.reactionRoles[0]) return;

    for (var rr of pGuild.settings.reactionRoles) {
        if (rr.messageID != message.id) continue;

        let i = pGuild.settings.reactionRoles.indexOf(rr)
        pGuild.settings.reactionRoles.splice(i, 1);

        consoleLog(message.client, `Removed ${rr.emoteName} => ${rr.pRole.name}`);
    }

    return UpdatePGuild(message.client, ['settings'], pGuild, module.exports.name, `Removed **${message.guild.name}**'s reactionroles for ${message.id}`)
}
export async function RemoveReaction(reaction: MessageReaction): Promise<void> {
    let guild = reaction.message.guild;
    if (!guild) return;

    let pGuild = await GetPGuild(guild);
    if (!pGuild) return;

    let { reactionRoles } = pGuild.settings;
    if (!reactionRoles) return;

    let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name && rr.messageID == reaction.message.id);
    if (!rr) return;

    return RemoveReactionRole(rr, reactionRoles, pGuild, reaction.client);
}
export async function RemoveReactionRole(rr: ReactionRole, reactionRoles: ReactionRole[], pGuild: PinguGuild, client: Client): Promise<void> {
    let index = reactionRoles.indexOf(rr);
    reactionRoles[index] = null;

    UpdatePGuild(client, ['settings'], pGuild, module.exports.name, `Removed ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`)
    return;
}
export async function OnMessageDelete(message: Message) {
    let client = ToPinguClient(message.client);

    let { guild } = message;
    if (!guild) return;

    let pGuild = await PinguGuild.Get(guild);
    if (!pGuild) return;

    let pGuildClient = client.toPClient(pGuild);

    let { reactionRoles } = pGuild.settings;
    let rrFromMessage = reactionRoles.filter(rr => rr.messageID == message.id && rr.pRole)

    if (!rrFromMessage) return;

    let rrEmotes = rrFromMessage.map(rr => rr.emoteName);

    let warningMessageInfo = rrFromMessage.map(rr => `${guild.emojis.cache.find(e => e.name == rr.emoteName)}: ${guild.roles.cache.find(r => r.id == rr.pRole._id)}`);
    if (!warningMessageInfo[0]) return;

    for (var reaction of message.reactions.cache.array()) {
        if (!rrEmotes.includes(reaction.emoji.name)) continue;

        let gMembers = reaction.users.cache.array().map(u => guild.member(u));
        let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name);
        let role = await guild.roles.fetch(rr.pRole._id);

        for (var gm of gMembers) await gm.roles.remove(role, `ReactionRole message deleted`);
    }

    return message.author.send(new MessageEmbed()
        .setTitle(`ReactionRole message deleted!`)
        .setColor(pGuildClient.embedColor)
        .setTimestamp(Date.now())
        .setDescription(
            `**Your reactionrole message in ${message.channel} was deleted!**\n` +
            `It had these reactionroles assigned to it:\n` +
            warningMessageInfo.join(`\n`)
        )
    )
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

    public static async GetReactionRole(client: Client, reaction: MessageReaction, user: User) { return GetReactionRole(client, reaction, user); }
    public static async OnReactionAdd(reaction: MessageReaction, user: User) { return OnReactionAdd(reaction, user); }
    public static async OnReactionRemove(reaction: MessageReaction, user: User) { return OnReactionRemove(reaction, user); }
    public static async OnReactionRemoveAll(message: Message, client?: Client) { return OnReactionRemoveAll(message, client); }
    public static async RemoveReaction(reaction: MessageReaction) { return RemoveReaction(reaction); }
    public static async RemoveReactionRole(rr: ReactionRole, reactionRoles: ReactionRole[], pGuild: PinguGuild, client: Client) { return RemoveReactionRole(rr, reactionRoles, pGuild, client) }
    public static async OnMessageDelete(message: Message) { return OnMessageDelete(message); }
}

export default ReactionRole;