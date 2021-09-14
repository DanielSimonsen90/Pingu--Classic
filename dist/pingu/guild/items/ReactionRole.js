"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionRole = exports.OnMessageDelete = exports.RemoveReactionRole = exports.RemoveReaction = exports.OnReactionRemoveAll = exports.OnReactionRemove = exports.OnReactionAdd = exports.GetReactionRole = void 0;
const discord_js_1 = require("discord.js");
const json_1 = require("../../../database/json");
const PinguClientBase_1 = require("../../client/PinguClientBase");
async function GetReactionRole(reaction, user) {
    let { guild } = reaction.message;
    if (!guild)
        return;
    const { client } = reaction.message;
    let pGuild = client.pGuilds.get(guild);
    const rr = pGuild.settings.reactionRoles.find(rr => rr.messageID == reaction.message.id &&
        (rr.emoteName == reaction.emoji.name) &&
        rr.channel._id == reaction.message.channel.id);
    if (!rr)
        return null;
    let { pRole } = rr;
    let member = guild.member(user);
    let permCheck = client.permissions.checkFor({
        member: guild.member(client.user),
        channel: reaction.message.channel,
    }, 'MANAGE_ROLES');
    if (permCheck != client.permissions.PermissionGranted) {
        guild.owner().send(`I tried to give ${member.displayName} "${pRole.name}", as ${permCheck}`);
        user.send(`I'm unable to give you the reactionrole at the moment! I've contacted ${guild.members.cache.get(guild.ownerId)} about this.`);
        return null;
    }
    return guild.roles.fetch(pRole._id);
}
exports.GetReactionRole = GetReactionRole;
async function OnReactionAdd(reaction, user) {
    const { client } = reaction.message;
    try {
        const role = await GetReactionRole(reaction, user);
        if (!role)
            return;
        const member = reaction.message.guild.member(user);
        member.roles.add(role, `ReactionRole in ${reaction.message.channel.name}.`)
            .catch(err => client.log('error', `Unable to give **${user.tag}** "${role.name}" role for reacting!`, null, err, {
            params: { client, reaction, user },
            trycatch: { role, member }
        }))
            .then(() => client.log('console', `Gave **${user.tag}** "${role.name}" for ReactionRole`));
    }
    catch (err) {
        client.log('error', `${module.exports.name} error`, null, err, { params: { reaction, user } });
    }
}
exports.OnReactionAdd = OnReactionAdd;
async function OnReactionRemove(reaction, user) {
    const { client } = reaction.message;
    if (client.id == user.id) {
        const pGuild = client.pGuilds.get(reaction.message.guild);
        const rr = pGuild.settings.reactionRoles.find(rr => rr.messageID == reaction.message.id && rr.emoteName == reaction.emoji.name);
        return RemoveReactionRole(rr, pGuild.settings.reactionRoles, pGuild, client);
    }
    try {
        const role = await GetReactionRole(reaction, user);
        if (!role)
            return;
        const member = reaction.message.guild.member(user);
        member.roles.remove(role, `ReactionRole in ${reaction.message.channel.name}.`)
            .catch(err => client.log('error', `Unable to remove ${user.username}'s ${role.name} role for unreacting!`, null, err, {
            params: { client, reaction, user },
            trycatch: { role, member }
        }));
        client.log('error', `Removed ${user.tag}'s "${role.name}" role for ReactionRole`);
    }
    catch (err) {
        client.log('error', `ReactionRole.OnReactionRemove error`, null, err, { params: { client, reaction, user } });
    }
}
exports.OnReactionRemove = OnReactionRemove;
async function OnReactionRemoveAll(message) {
    const { guild, id, client } = message;
    let pGuild = client.pGuilds.get(guild);
    if (!pGuild.settings.reactionRoles[0])
        return;
    for (var rr of pGuild.settings.reactionRoles) {
        if (rr.messageID != id)
            continue;
        let i = pGuild.settings.reactionRoles.indexOf(rr);
        pGuild.settings.reactionRoles.splice(i, 1);
        client.log('error', `Removed ${rr.emoteName} => ${rr.pRole.name}`);
    }
    return client.pGuilds.update(pGuild, 'ReactionRole.OnreactionRemoveAll()', `Removed **${guild.name}**'s reactionroles for ${id}`);
}
exports.OnReactionRemoveAll = OnReactionRemoveAll;
async function RemoveReaction(reaction) {
    const { guild, client, id } = reaction.message;
    if (!guild)
        return;
    let pGuild = client.pGuilds.get(guild);
    if (!pGuild)
        return;
    let { reactionRoles } = pGuild.settings;
    if (!reactionRoles)
        return;
    let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name && rr.messageID == id);
    if (!rr)
        return;
    return RemoveReactionRole(rr, reactionRoles, pGuild, client);
}
exports.RemoveReaction = RemoveReaction;
async function RemoveReactionRole(rr, reactionRoles, pGuild, client) {
    let i = reactionRoles.indexOf(rr);
    reactionRoles.splice(i);
    pGuild.settings.reactionRoles = reactionRoles;
    return client.pGuilds.update(pGuild, `ReactionRole.RemoveReactionRole()`, `Removed ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`);
}
exports.RemoveReactionRole = RemoveReactionRole;
async function OnMessageDelete(message) {
    const { guild, id, client: _client } = message;
    if (!guild)
        return;
    const client = _client;
    const pGuild = client.pGuilds.get(guild);
    if (!pGuild)
        return;
    const pGuildClient = client.toPClient(pGuild);
    const { reactionRoles } = pGuild.settings;
    const rrFromMessage = reactionRoles.filter(rr => rr.messageID == id && rr.pRole);
    if (!rrFromMessage)
        return;
    const rrEmotes = rrFromMessage.map(rr => rr.emoteName);
    const warningMessageInfo = await Promise.all(rrFromMessage.map(async (rr) => `${guild.emojis.cache.find(r => r.name == rr.emoteName) || rr.emoteName}: ${await guild.roles.fetch(rr.pRole._id) || rr.pRole.name}`));
    if (!warningMessageInfo[0])
        return;
    for (var [_, reaction] of message.reactions.cache) {
        if (!rrEmotes.includes(reaction.emoji.name))
            continue;
        let gMembers = reaction.users.cache.map(u => guild.member(u));
        let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name);
        let role = await guild.roles.fetch(rr.pRole._id);
        for (var gm of gMembers)
            await gm.roles.remove(role, `ReactionRole message deleted`);
    }
    const bots = new discord_js_1.Collection(...message.reactions.cache.map(r => r.users.cache
        .filter(u => u.bot && [PinguClientBase_1.Clients.BetaID, PinguClientBase_1.Clients.PinguID].includes(u.id))
        .map((v, k) => [k, v])));
    const PinguReacted = bots.get(PinguClientBase_1.Clients.PinguID) != null;
    const PinguOnline = client.savedServers.get('Pingu Support').member(client.clients.get('Live')).presence.status == 'online';
    if (PinguReacted && PinguOnline && !client.isLive)
        return;
    pGuild.settings.reactionRoles == pGuild.settings.reactionRoles.filter(rr => !rrFromMessage.includes(rr));
    client.pGuilds.update(pGuild, `ReactionRole.OnMessageDelete()`, `Reaction Roles removed due to reaction role message being deleted.`);
    return message.author.sendEmbeds(new discord_js_1.MessageEmbed({
        title: `ReactionRole message deleted!`,
        color: pGuildClient.embedColor,
        timestamp: Date.now(),
        description: [
            `**Your reactionrole message in ${message.channel} was deleted!**`,
            `It had these reactionroles assigned to it:`,
            warningMessageInfo.join(`\n`)
        ].join('\n')
    }));
}
exports.OnMessageDelete = OnMessageDelete;
class ReactionRole {
    constructor(message, reactionName, role) {
        this.emoteName = reactionName;
        this.pRole = new json_1.PRole(role);
        this.channel = new json_1.PChannel(message.channel);
        this.messageID = message.id;
    }
    channel;
    messageID;
    emoteName;
    pRole;
    static async GetReactionRole(reaction, user) { return GetReactionRole(reaction, user); }
    static async OnReactionAdd(reaction, user) { return OnReactionAdd(reaction, user); }
    static async OnReactionRemove(reaction, user) { return OnReactionRemove(reaction, user); }
    static async OnReactionRemoveAll(message) { return OnReactionRemoveAll(message); }
    static async RemoveReaction(reaction) { return RemoveReaction(reaction); }
    static async RemoveReactionRole(rr, reactionRoles, pGuild, client) { return RemoveReactionRole(rr, reactionRoles, pGuild, client); }
    static async OnMessageDelete(message) { return OnMessageDelete(message); }
}
exports.ReactionRole = ReactionRole;
exports.default = ReactionRole;
