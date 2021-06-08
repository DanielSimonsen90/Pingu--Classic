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
exports.PinguGuild = exports.cache = exports.GetPinguGuilds = exports.DeletePGuild = exports.UpdatePGuild = exports.GetPGuild = exports.WritePGuild = void 0;
const discord_js_1 = require("discord.js");
const json_1 = require("../../database/json");
const PinguGuildSettings_1 = require("./PinguGuildSettings");
const PinguLibrary_1 = require("../library/PinguLibrary");
const PinguLibrary = { SavedServers: PinguLibrary_1.SavedServers, errorLog: PinguLibrary_1.errorLog, pGuildLog: PinguLibrary_1.pGuildLog, DBExecute: PinguLibrary_1.DBExecute };
const PinguClient_1 = require("../client/PinguClient");
const helpers_1 = require("../../helpers");
//#region CRUD
const PinguGuild_1 = require("../../MongoSchemas/PinguGuild");
function WritePGuild(client, guild, scriptName, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        return PinguLibrary.DBExecute(client, (mongoose) => __awaiter(this, void 0, void 0, function* () {
            let pGuild = new PinguGuild(guild, !guild.owner ? guild.member(yield client.users.fetch(guild.ownerID)) : null);
            let created = new PinguGuild_1.default(pGuild).save();
            const log = new helpers_1.Reason('create', 'PinguGuild', pGuild.name, reason);
            PinguLibrary.pGuildLog(client, scriptName, (created ? log.succMsg : log.errMsg));
            exports.cache.set(guild.id, pGuild);
            return pGuild;
        }));
    });
}
exports.WritePGuild = WritePGuild;
function GetPGuild(guild) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!guild)
            return null;
        let pGuild = exports.cache.get(guild.id);
        if (pGuild)
            return pGuild;
        let pGuildDoc = yield PinguGuild_1.default.findOne({ _id: guild.id }).exec();
        if (!pGuildDoc)
            return null;
        pGuild = pGuildDoc.toObject();
        exports.cache.set(guild.id, pGuild);
        return pGuild;
    });
}
exports.GetPGuild = GetPGuild;
function UpdatePGuild(client, updatedProperties, pGuild, scriptName, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        let guild = yield client.guilds.fetch(pGuild._id);
        if (!guild)
            throw new helpers_1.Error(`Guild not found!`);
        yield PinguGuild_1.default.updateOne({ _id: pGuild._id }, getUpdatedProperty(), null, (err) => __awaiter(this, void 0, void 0, function* () {
            const log = new helpers_1.Reason('update', 'PinguGuild', pGuild.name, reason);
            if (err)
                return PinguLibrary.pGuildLog(client, scriptName, log.errMsg, err);
            PinguLibrary.pGuildLog(client, scriptName, log.succMsg);
            exports.cache.set(pGuild._id, yield GetPGuild(client.guilds.cache.get(pGuild._id)));
        }));
        return pGuild;
        function getUpdatedProperty() {
            const result = {};
            for (const prop of updatedProperties) {
                switch (prop) {
                    case 'name':
                        result.name = pGuild.name;
                        break;
                    case 'guildOwner':
                        result.guildOwner = pGuild.guildOwner;
                        break;
                    case 'clients':
                        result.clients = pGuild.clients;
                        break;
                    case 'members':
                        result.members = pGuild.members;
                        break;
                    case 'settings':
                        result.settings = pGuild.settings;
                        break;
                    default: throw new helpers_1.Error(`${prop} is not a recognized property!`);
                }
            }
            return result;
        }
    });
}
exports.UpdatePGuild = UpdatePGuild;
function DeletePGuild(client, guild, scriptName, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        yield PinguGuild_1.default.deleteOne({ _id: guild.id }, null, err => {
            const log = new helpers_1.Reason('delete', 'PinguGuild', guild.name, reason);
            if (err)
                return PinguLibrary.pGuildLog(client, scriptName, log.errMsg, new helpers_1.Error(err));
            else
                PinguLibrary.pGuildLog(client, scriptName, log.succMsg);
            exports.cache.delete(guild.id);
        });
        return;
    });
}
exports.DeletePGuild = DeletePGuild;
function GetPinguGuilds() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield PinguGuild_1.default.find({}).exec()).map(collDoc => collDoc.toObject());
    });
}
exports.GetPinguGuilds = GetPinguGuilds;
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
        this.settings = new PinguGuildSettings_1.default(guild);
        this.members = new Map();
        this.joinedAt = new Date(Date.now());
    }
    //#region Statics
    /**Creates and saves Guild as a PinguGuild and returns the new PinguGuild object
     * @param client Client that called the method
     * @param guild Guild to create a PinguGuild for
     * @param scriptName Script that called the write method
     * @param reason Reason for creating a new PinguGuild
     * @returns Guild converted to PinguGuild*/
    static Write(client, guild, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () { return WritePGuild(client, guild, scriptName, reason); });
    }
    /**Get PinguGuild from Guild
     * @param guild Guild to get the PinguGuild for
     * @returns The Guild converted to PinguGuild*/
    static Get(guild) {
        return __awaiter(this, void 0, void 0, function* () { return GetPGuild(guild); });
    }
    /**Updates specified PinguGuild to the database
     * @param client Client that called the method
     * @param updatedProperties List of property names that are being updated
     * @param pGuild Pingu Guild object that is being updated
     * @param scriptName Script that called the method
     * @param reason Reason for updating the PinguGuild
     * @returns The updated PinguGuild*/
    static Update(client, updatedProperties, pGuild, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () { return UpdatePGuild(client, updatedProperties, pGuild, scriptName, reason); });
    }
    /**Deletes the guild from the PinguGuild database
     * @param client Client that called the method
     * @param guild Guild to be deleted
     * @param scriptName Script that called the method
     * @param reason Reason for deleting the PinguGuild
     * @returns what should it return?*/
    static Delete(client, guild, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () { return DeletePGuild(client, guild, scriptName, reason); });
    }
    /**Get an array of all PinguGuilds
     * @returns All PinguGuilds*/
    static GetGuilds() {
        return __awaiter(this, void 0, void 0, function* () { return GetPinguGuilds(); });
    }
}
exports.PinguGuild = PinguGuild;
exports.default = PinguGuild;
