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
exports.PinguGuild = exports.cache = exports.GetPGuilds = exports.DeletePGuild = exports.UpdatePGuild = exports.GetPGuild = exports.WritePGuild = void 0;
const discord_js_1 = require("discord.js");
const json_1 = require("../../database/json");
const PinguGuildSettings_1 = require("./PinguGuildSettings");
const PinguLibrary_1 = require("../library/PinguLibrary");
const PinguLibrary = { SavedServers: PinguLibrary_1.SavedServers, errorLog: PinguLibrary_1.errorLog, pGuildLog: PinguLibrary_1.pGuildLog, DBExecute: PinguLibrary_1.DBExecute };
const PinguClient_1 = require("../client/PinguClient");
const helpers_1 = require("../../helpers");
const PinguGuildMember_1 = require("../guildMember/PinguGuildMember");
//#region CRUD
const PinguGuild_1 = require("../../MongoSchemas/PinguGuild");
function WritePGuild(client, guild, scriptName, succMsg, errMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        PinguLibrary.DBExecute(client, (mongoose) => __awaiter(this, void 0, void 0, function* () {
            let created = new PinguGuild_1.PinguGuildSchema(new PinguGuild(guild, !guild.owner ? guild.member(yield client.users.fetch(guild.ownerID)) : null));
            if (!created)
                return PinguLibrary.pGuildLog(client, scriptName, errMsg);
            created.save();
            return PinguLibrary.pGuildLog(client, scriptName, succMsg);
        }));
    });
}
exports.WritePGuild = WritePGuild;
function GetPGuild(guild) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!guild)
            return null;
        let pGuildDoc = yield PinguGuild_1.PinguGuildSchema.findOne({ _id: guild.id }).exec();
        if (!pGuildDoc)
            return null;
        exports.cache.set(guild.id, pGuildDoc.toObject());
        return pGuildDoc.toObject();
    });
}
exports.GetPGuild = GetPGuild;
function UpdatePGuild(client, updatedProperty, pGuild, scriptName, succMsg, errMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        let guild = yield client.guilds.fetch(pGuild._id);
        if (!guild)
            throw new helpers_1.Error(`Guild not found!`);
        return yield PinguGuild_1.PinguGuildSchema.updateOne({ _id: pGuild._id }, updatedProperty, null, (err) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return PinguLibrary.pGuildLog(client, scriptName, errMsg, err);
            PinguLibrary.pGuildLog(client, scriptName, succMsg);
            exports.cache.set(pGuild._id, yield GetPGuild({ id: pGuild._id }));
        }));
    });
}
exports.UpdatePGuild = UpdatePGuild;
function DeletePGuild(client, guild, scriptName, succMsg, errMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield PinguGuild_1.PinguGuildSchema.deleteOne({ _id: guild.id }, null, err => {
            if (err)
                PinguLibrary.pGuildLog(client, scriptName, errMsg, new helpers_1.Error(err));
            else
                PinguLibrary.pGuildLog(client, scriptName, succMsg);
        });
    });
}
exports.DeletePGuild = DeletePGuild;
function GetPGuilds() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield PinguGuild_1.PinguGuildSchema.find({}).exec()).map(collDoc => collDoc.toObject());
    });
}
exports.GetPGuilds = GetPGuilds;
//#endregion
exports.cache = new discord_js_1.Collection();
class PinguGuild extends json_1.PItem {
    //#endregion
    constructor(guild, owner) {
        super(guild);
        if (guild.owner)
            this.guildOwner = new json_1.PGuildMember(guild.owner);
        else if (owner)
            this.guildOwner = new json_1.PGuildMember(owner);
        else
            PinguLibrary.errorLog(guild.client, `Owner wasn't set when making Pingu Guild for "${guild.name}".`);
        this.clients = new Array();
        let clientIndex = PinguClient_1.ToPinguClient(guild.client).isLive ? 0 : 1;
        if (clientIndex != 0)
            this.clients.push(null);
        this.clients[clientIndex] = new json_1.PClient(guild.client, guild);
        this.settings = new PinguGuildSettings_1.PinguGuildSettings(guild);
        this.members = new Map();
        guild.members.cache.array().forEach(gm => this.members.set(gm.id, new PinguGuildMember_1.PinguGuildMember(gm, this.settings.config.achievements.notificationTypes.members)));
    }
    //#region Statics
    static WritePGuild(client, guild, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function* () { return WritePGuild(client, guild, scriptName, succMsg, errMsg); });
    }
    static GetPGuild(guild) {
        return __awaiter(this, void 0, void 0, function* () { return GetPGuild(guild); });
    }
    static UpdatePGuild(client, updatedProperty, pGuild, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function* () { return UpdatePGuild(client, updatedProperty, pGuild, scriptName, succMsg, errMsg); });
    }
    static DeletePGuild(client, guild, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function* () { return DeletePGuild(client, guild, scriptName, succMsg, errMsg); });
    }
    static GetPGuilds() {
        return __awaiter(this, void 0, void 0, function* () { return GetPGuilds(); });
    }
}
exports.PinguGuild = PinguGuild;
