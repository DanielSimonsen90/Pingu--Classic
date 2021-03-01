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
const PinguGuild_1 = require("../PinguGuild");
const json_1 = require("../../../database/json");
const PinguLibrary_1 = require("../../library/PinguLibrary");
const PinguClient_1 = require("../../client/PinguClient");
function GetReactionRole(client, reaction, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let guild = reaction.message.guild;
        let pGuild = yield PinguGuild_1.GetPGuild(guild);
        var rr = pGuild.settings.reactionRoles.find(rr => rr.messageID == reaction.message.id &&
            (rr.emoteName == reaction.emoji.name) &&
            rr.channel._id == reaction.message.channel.id);
        if (!rr)
            return null;
        let { pRole } = rr;
        let member = guild.member(user);
        let permCheck = PinguLibrary_1.PermissionCheck({
            author: client.user,
            client,
            channel: reaction.message.channel,
            content: "No content provided"
        }, 'MANAGE_ROLES');
        if (permCheck != PinguLibrary_1.PermissionGranted) {
            guild.owner.send(`I tried to give ${member.displayName} the ${pRole.name}, as ${permCheck}`);
            user.send(`I'm unable to give you the reactionrole at the moment! I've contacted ${user.username} about this.`);
            return null;
        }
        return guild.roles.fetch(pRole._id);
    });
}
exports.GetReactionRole = GetReactionRole;
function OnReactionAdd(reaction, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = user.client;
        try {
            var role = yield ReactionRole.GetReactionRole(client, reaction, user);
            if (!role)
                return;
            var member = reaction.message.guild.member(user);
            member.roles.add(role, `ReactionRole in ${reaction.message.channel.name}.`)
                .catch(err => PinguLibrary_1.errorLog(client, `Unable to give ${user.username} the ${role.name} role for reacting!`, null, err, {
                params: { client, reaction, user },
                trycatch: { role, member }
            }))
                .then(() => PinguLibrary_1.consoleLog(client, `Gave ${user.username} ${role.name} for ReactionRole`));
        }
        catch (err) {
            PinguLibrary_1.errorLog(client, `${module.exports.name} error`, null, err, {
                params: { client, reaction, user },
                trycatch: { role, member }
            });
        }
    });
}
exports.OnReactionAdd = OnReactionAdd;
function OnReactionRemove(reaction, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { client } = reaction.message;
        try {
            var role = yield GetReactionRole(client, reaction, user);
            if (!role)
                return;
            var member = reaction.message.guild.member(user);
            member.roles.remove(role, `ReactionRole in ${reaction.message.channel.name}.`)
                .catch(err => PinguLibrary_1.errorLog(client, `Unable to remove ${user.username}'s ${role.name} role for unreacting!`, null, err, {
                params: { client, reaction, user },
                trycatch: { role, member }
            }));
            PinguLibrary_1.consoleLog(client, `Removed ${user.username}'s ${role.name} role for ReactionRole`);
        }
        catch (err) {
            PinguLibrary_1.errorLog(client, `ReactionRole.OnReactionRemove error`, null, err, {
                params: { client, reaction, user },
                trycatch: { role, member }
            });
        }
    });
}
exports.OnReactionRemove = OnReactionRemove;
function OnReactionRemoveAll(message, client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!client)
            client = message.client;
        let pGuild = yield PinguGuild_1.GetPGuild(message.guild);
        if (!pGuild.settings.reactionRoles[0])
            return;
        for (var rr of pGuild.settings.reactionRoles) {
            if (rr.messageID != message.id)
                continue;
            let i = pGuild.settings.reactionRoles.indexOf(rr);
            pGuild.settings.reactionRoles.splice(i, 1);
            PinguLibrary_1.consoleLog(message.client, `Removed ${rr.emoteName} => ${rr.pRole.name}`);
        }
        return PinguGuild_1.UpdatePGuild(message.client, { settings: pGuild.settings }, pGuild, module.exports.name, `Successfully removed **${message.guild.name}**'s reactionroles for ${message.id}`, `Failed to remove **${message.guild.name}**'s reactionroles for ${message.id}`);
    });
}
exports.OnReactionRemoveAll = OnReactionRemoveAll;
function RemoveReaction(reaction) {
    return __awaiter(this, void 0, void 0, function* () {
        let guild = reaction.message.guild;
        if (!guild)
            return;
        let pGuild = yield PinguGuild_1.GetPGuild(guild);
        if (!pGuild)
            return;
        let { reactionRoles } = pGuild.settings;
        if (!reactionRoles)
            return;
        let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name && rr.messageID == reaction.message.id);
        if (!rr)
            return;
        return RemoveReactionRole(rr, reactionRoles, pGuild, reaction.client);
    });
}
exports.RemoveReaction = RemoveReaction;
function RemoveReactionRole(rr, reactionRoles, pGuild, client) {
    return __awaiter(this, void 0, void 0, function* () {
        let index = reactionRoles.indexOf(rr);
        reactionRoles[index] = null;
        return PinguGuild_1.UpdatePGuild(client, { settings: pGuild.settings }, pGuild, module.exports.name, `Successfully removed ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`, `Failed to remove ${rr.emoteName} from **${pGuild.name}**'s Pingu Guild.`);
    });
}
exports.RemoveReactionRole = RemoveReactionRole;
function OnMessageDelete(message) {
    return __awaiter(this, void 0, void 0, function* () {
        let client = PinguClient_1.ToPinguClient(message.client);
        let { guild } = message;
        if (!guild)
            return;
        let pGuild = yield PinguGuild_1.PinguGuild.GetPGuild(guild);
        if (!pGuild)
            return;
        let pGuildClient = client.toPClient(pGuild);
        let { reactionRoles } = pGuild.settings;
        let rrFromMessage = reactionRoles.filter(rr => rr.messageID == message.id && rr.pRole);
        if (!rrFromMessage)
            return;
        let rrEmotes = rrFromMessage.map(rr => rr.emoteName);
        let warningMessageInfo = rrFromMessage.map(rr => `${guild.emojis.cache.find(e => e.name == rr.emoteName)}: ${guild.roles.cache.find(r => r.id == rr.pRole._id)}`);
        if (!warningMessageInfo[0])
            return;
        for (var reaction of message.reactions.cache.array()) {
            if (!rrEmotes.includes(reaction.emoji.name))
                continue;
            let gMembers = reaction.users.cache.array().map(u => guild.member(u));
            let rr = reactionRoles.find(rr => rr.emoteName == reaction.emoji.name);
            let role = yield guild.roles.fetch(rr.pRole._id);
            for (var gm of gMembers)
                yield gm.roles.remove(role, `ReactionRole message deleted`);
        }
        return message.author.send(new discord_js_1.MessageEmbed()
            .setTitle(`ReactionRole message deleted!`)
            .setColor(pGuildClient.embedColor)
            .setTimestamp(Date.now())
            .setDescription(`**Your reactionrole message in ${message.channel} was deleted!**\n` +
            `It had these reactionroles assigned to it:\n` +
            warningMessageInfo.join(`\n`)));
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
    static GetReactionRole(client, reaction, user) {
        return __awaiter(this, void 0, void 0, function* () { return GetReactionRole(client, reaction, user); });
    }
    static OnReactionAdd(reaction, user) {
        return __awaiter(this, void 0, void 0, function* () { return OnReactionAdd(reaction, user); });
    }
    static OnReactionRemove(reaction, user) {
        return __awaiter(this, void 0, void 0, function* () { return OnReactionRemove(reaction, user); });
    }
    static OnReactionRemoveAll(message, client) {
        return __awaiter(this, void 0, void 0, function* () { return OnReactionRemoveAll(message, client); });
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
