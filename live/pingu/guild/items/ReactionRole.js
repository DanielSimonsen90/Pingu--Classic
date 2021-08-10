"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionRole = exports.OnMessageDelete = exports.RemoveReactionRole = exports.RemoveReaction = exports.OnReactionRemoveAll = exports.OnReactionRemove = exports.OnReactionAdd = exports.GetReactionRole = void 0;
const discord_js_1 = require("discord.js");
const json_1 = require("../../../database/json");
const BasePinguClient_1 = require("../../client/BasePinguClient");
const PinguClient_1 = require("../../client/PinguClient");
function GetReactionRole(reaction, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let { guild } = reaction.message;
        if (!guild)
            return;
        const client = PinguClient_1.ToPinguClient(reaction.client);
        let pGuild = client.pGuilds.get(guild);
        const rr = pGuild.settings.reactionRoles.find(rr => rr.messageID == reaction.message.id &&
            (rr.emoteName == reaction.emoji.name) &&
            rr.channel._id == reaction.message.channel.id);
        if (!rr)
            return null;
        let { pRole } = rr;
        let member = guild.member(user);
        let permCheck = client.permissions.checkFor({
            author: client.user,
            channel: reaction.message.channel,
        }, 'MANAGE_ROLES');
        if (permCheck != client.permissions.PermissionGranted) {
            guild.owner.send(`I tried to give ${member.displayName} "${pRole.name}", as ${permCheck}`);
            user.send(`I'm unable to give you the reactionrole at the moment! I've contacted ${guild.owner} about this.`);
            return null;
        }
        return guild.roles.fetch(pRole._id);
    });
}
exports.GetReactionRole = GetReactionRole;
function OnReactionAdd(reaction, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = PinguClient_1.ToPinguClient(reaction.client);
        try {
            const role = yield GetReactionRole(reaction, user);
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
    });
}
exports.OnReactionAdd = OnReactionAdd;
function OnReactionRemove(reaction, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = PinguClient_1.ToPinguClient(reaction.client);
        if (client.id == user.id) {
            const pGuild = client.pGuilds.get(reaction.message.guild);
            const rr = pGuild.settings.reactionRoles.find(rr => rr.messageID == reaction.message.id && rr.emoteName == reaction.emoji.name);
            return RemoveReactionRole(rr, pGuild.settings.reactionRoles, pGuild, client);
        }
        try {
            const role = yield GetReactionRole(reaction, user);
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
    });
}
exports.OnReactionRemove = OnReactionRemove;
function OnReactionRemoveAll(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const { guild, id, client: _client } = message;
        const client = PinguClient_1.ToPinguClient(_client);
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
    });
}
exports.OnReactionRemoveAll = OnReactionRemoveAll;
function RemoveReaction(reaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const { guild, client: _client, id } = reaction.message;
        if (!guild)
            return;
        const client = PinguClient_1.ToPinguClient(_client);
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
    });
}
exports.RemoveReaction = RemoveReaction;
function RemoveReactionRole(rr, reactionRoles, pGuild, _client) {
    return __awaiter(this, void 0, void 0, function* () {
        let i = reactionRoles.indexOf(rr);
        reactionRoles.splice(i);
        pGuild.settings.reactionRoles = reactionRoles;
        return PinguClient_1.ToPinguClient(_client).pGuilds.update(pGuild, `ReactionRole.RemoveReactionRole()`, `Removed ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`);
    });
}
exports.RemoveReactionRole = RemoveReactionRole;
function OnMessageDelete(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const { guild, id, client: _client } = message;
        if (!guild)
            return;
        const client = PinguClient_1.ToPinguClient(_client);
        const pGuild = client.pGuilds.get(guild);
        if (!pGuild)
            return;
        const pGuildClient = client.toPClient(pGuild);
        const { reactionRoles } = pGuild.settings;
        const rrFromMessage = reactionRoles.filter(rr => rr.messageID == id && rr.pRole);
        if (!rrFromMessage)
            return;
        const rrEmotes = rrFromMessage.map(rr => rr.emoteName);
        const warningMessageInfo = yield Promise.all(rrFromMessage.map((rr) => __awaiter(this, void 0, void 0, function* () { return `${guild.emojis.cache.find(r => r.name == rr.emoteName) || rr.emoteName}: ${(yield guild.roles.fetch(rr.pRole._id)) || rr.pRole.name}`; })));
        if (!warningMessageInfo[0])
            return;
        for (var [_, reaction] of message.reactions.cache) {
            if (!rrEmotes.includes(reaction.emoji.name))
                continue;
            let gMembers = reaction.users.cache.map(u => guild.member(u));
            let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name);
            let role = yield guild.roles.fetch(rr.pRole._id);
            for (var gm of gMembers)
                yield gm.roles.remove(role, `ReactionRole message deleted`);
        }
        const bots = new discord_js_1.Collection(...message.reactions.cache.map(r => r.users.cache
            .filter(u => u.bot && [BasePinguClient_1.Clients.BetaID, BasePinguClient_1.Clients.PinguID].includes(u.id))
            .map((v, k) => [k, v])));
        const PinguReacted = bots.get(BasePinguClient_1.Clients.PinguID) != null;
        const PinguOnline = (yield client.clients.get('Live').fetch(true)).presence.status == 'online';
        if (PinguReacted && PinguOnline && !client.isLive)
            return;
        pGuild.settings.reactionRoles == pGuild.settings.reactionRoles.filter(rr => !rrFromMessage.includes(rr));
        client.pGuilds.update(pGuild, `ReactionRole.OnMessageDelete()`, `Reaction Roles removed due to reaction role message being deleted.`);
        return message.author.send(new discord_js_1.MessageEmbed({
            title: `ReactionRole message deleted!`,
            color: pGuildClient.embedColor,
            timestamp: Date.now(),
            description: [
                `**Your reactionrole message in ${message.channel} was deleted!**`,
                `It had these reactionroles assigned to it:`,
                warningMessageInfo.join(`\n`)
            ].join('\n')
        }));
    });
}
exports.OnMessageDelete = OnMessageDelete;
class ReactionRole {
    constructor(message, reactionName, role) {
        this.emoteName = reactionName;
        this.pRole = new json_1.PRole(role);
        this.channel = new json_1.PChannel(message.channel);
        this.messageID = message.id;
    }
    static GetReactionRole(reaction, user) {
        return __awaiter(this, void 0, void 0, function* () { return GetReactionRole(reaction, user); });
    }
    static OnReactionAdd(reaction, user) {
        return __awaiter(this, void 0, void 0, function* () { return OnReactionAdd(reaction, user); });
    }
    static OnReactionRemove(reaction, user) {
        return __awaiter(this, void 0, void 0, function* () { return OnReactionRemove(reaction, user); });
    }
    static OnReactionRemoveAll(message) {
        return __awaiter(this, void 0, void 0, function* () { return OnReactionRemoveAll(message); });
    }
    static RemoveReaction(reaction) {
        return __awaiter(this, void 0, void 0, function* () { return RemoveReaction(reaction); });
    }
    static RemoveReactionRole(rr, reactionRoles, pGuild, client) {
        return __awaiter(this, void 0, void 0, function* () { return RemoveReactionRole(rr, reactionRoles, pGuild, client); });
    }
    static OnMessageDelete(message) {
        return __awaiter(this, void 0, void 0, function* () { return OnMessageDelete(message); });
    }
}
exports.ReactionRole = ReactionRole;
exports.default = ReactionRole;
