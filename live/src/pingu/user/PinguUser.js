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
exports.PinguUser = exports.cache = exports.GetUpdatedProperty = exports.GetPinguUsers = exports.DeletePUser = exports.UpdatePUser = exports.GetPUser = exports.WritePUser = void 0;
const discord_js_1 = require("discord.js");
const database_1 = require("../../database");
const items_1 = require("./items");
const UserAchievementConfig_1 = require("../achievements/config/UserAchievementConfig");
const PinguUser_1 = require("../../MongoSchemas/PinguUser");
const PinguLibrary_1 = require("../library/PinguLibrary");
const helpers_1 = require("../../helpers");
//#region CRUD
function WritePUser(client, user, scriptName, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        return PinguLibrary_1.DBExecute(client, (mongoose) => __awaiter(this, void 0, void 0, function* () {
            let pUser = new PinguUser(user);
            let created = yield new PinguUser_1.PinguUserSchema(pUser).save();
            const log = new helpers_1.Reason('create', 'PinguUser', pUser.tag, reason);
            PinguLibrary_1.pUserLog(client, scriptName, (created ? log.succMsg : log.errMsg));
            exports.cache.set(user.id, pUser);
            let ownedPinguGuilds = client.guilds.cache.filter(g => g.ownerID == user.id).array();
            if (ownedPinguGuilds.length)
                yield PinguLibrary_1.AchievementCheckType(client, 'USER', user, 'EVENT', 'guildCreate', pUser.achievementConfig, 'EVENT', [ownedPinguGuilds[0]]);
            return pUser;
        }));
    });
}
exports.WritePUser = WritePUser;
function GetPUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let pUser = exports.cache.get(user.id);
        if (pUser)
            return pUser;
        let pUserDoc = yield PinguUser_1.PinguUserSchema.findOne({ _id: user.id }).exec();
        if (!pUserDoc)
            return null;
        pUser = pUserDoc.toObject();
        exports.cache.set(user.id, pUser);
        return pUser;
    });
}
exports.GetPUser = GetPUser;
function UpdatePUser(client, updatedProperties, pUser, scriptName, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        yield PinguUser_1.PinguUserSchema.updateOne({ _id: pUser._id }, getUpdatedProperty(), null, (err) => __awaiter(this, void 0, void 0, function* () {
            const log = new helpers_1.Reason('update', 'PinguUser', pUser.tag, reason);
            if (err)
                return PinguLibrary_1.pUserLog(client, scriptName, log.errMsg, err);
            PinguLibrary_1.pUserLog(client, scriptName, log.succMsg);
            exports.cache.set(pUser._id, pUser);
        }));
        return pUser;
        function getUpdatedProperty() {
            const result = {};
            for (const prop of updatedProperties) {
                switch (prop) {
                    case 'tag':
                        result.tag = pUser.tag;
                        break;
                    case 'sharedServers':
                        result.sharedServers = pUser.sharedServers;
                        break;
                    case 'marry':
                        result.marry = pUser.marry;
                        break;
                    case 'replyPerson':
                        result.replyPerson = pUser.replyPerson;
                        break;
                    case 'daily':
                        result.daily = pUser.daily;
                        break;
                    case 'playlists':
                        result.playlists = pUser.playlists;
                        break;
                    case 'achievementConfig':
                        result.achievementConfig = pUser.achievementConfig;
                        break;
                    default: throw new helpers_1.Error(`${prop} is not a recognized property!`);
                }
            }
            return result;
        }
    });
}
exports.UpdatePUser = UpdatePUser;
function DeletePUser(client, user, scriptName, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        yield PinguUser_1.PinguUserSchema.deleteOne({ _id: user.id }, null, err => {
            const log = new helpers_1.Reason('delete', 'PinguUser', user.tag, reason);
            if (err)
                return PinguLibrary_1.pUserLog(client, scriptName, log.errMsg, new helpers_1.Error(err));
            else
                PinguLibrary_1.pUserLog(client, scriptName, log.succMsg);
            exports.cache.delete(user.id);
        });
        return;
    });
}
exports.DeletePUser = DeletePUser;
function GetPinguUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield PinguUser_1.PinguUserSchema.find({}).exec()).map(collDoc => collDoc.toObject());
    });
}
exports.GetPinguUsers = GetPinguUsers;
//#endregion
function GetUpdatedProperty(preUser, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (user.bot)
            return;
        const updated = [];
        if (user.avatarURL() != preUser.avatarURL())
            updated.push('avatar');
        if (user.tag != preUser.tag)
            updated.push('tag');
        return updated;
    });
}
exports.GetUpdatedProperty = GetUpdatedProperty;
exports.cache = new discord_js_1.Collection();
class PinguUser {
    //#endregion
    constructor(user) {
        let pUser = new database_1.PUser(user);
        this._id = pUser._id;
        this.tag = pUser.name;
        this.sharedServers = user.client.guilds.cache.filter(g => g.members.cache.has(user.id)).map(g => new database_1.PGuild(g));
        this.marry = new items_1.Marry();
        this.replyPerson = null;
        this.daily = new items_1.Daily();
        this.avatar = user.avatarURL();
        this.playlists = new Array();
        this.achievementConfig = new UserAchievementConfig_1.UserAchievementConfig('NONE');
        this.joinedAt = new Date(Date.now());
    }
    //#region Statics
    /**Creates and adds a new PinguUser from provided User and returns the new PinguUser object
     * @param client Client that is creating a new PinguUser
     * @param user User that is being saved to the database
     * @param scriptName Script that the method is being called from
     * @param reason Reason to add PinguUser to database
     * @returns The PinguUser that was just created*/
    static Write(client, user, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () { return WritePUser(client, user, scriptName, reason); });
    }
    /**"Convert" from discord.js.User to PinguPackage.PinguUser
     * @param user The user to look for in the database
     * @returns PinguUser entry matching specified User*/
    static Get(user) {
        return __awaiter(this, void 0, void 0, function* () { return GetPUser(user); });
    }
    /**Updates specified Pingu User to MongoDB
     * @param client Client that called the method
     * @param updatedProperties List of property strings that should update in database, when method has ran
     * @param pUser User that is being updated
     * @param scriptName Name of the script that called this method
     * @param reason Reason for updating
     * @returns Updated Pingu User*/
    static Update(client, updatedProperties, pUser, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () { return UpdatePUser(client, updatedProperties, pUser, scriptName, reason); });
    }
    /**Deletes specified user from Pingu's database.
     * @param client Client that is running the function
     * @param user User that is being deleted
     * @param scriptName Name of the script that called the function
     * @param reason Successfully deleted PinguUser: reason
     * @returns what is there to return?*/
    static Delete(client, user, scriptName, reason) {
        return __awaiter(this, void 0, void 0, function* () { return DeletePUser(client, user, scriptName, reason); });
    }
    /**Gets all PinguUsers from databse
     * @returns All PinguUsers from database*/
    static GetUsers() {
        return __awaiter(this, void 0, void 0, function* () { return GetPinguUsers(); });
    }
    /**Get an object with properties, that matters to the PinguUser table
     * @param preUser Previous user before userUpdate event
     * @param user Current user after userUpdate event
     * @returns Object with properties that matters to the PinguUser table*/
    static GetUpdatedProperty(preUser, user) {
        return __awaiter(this, void 0, void 0, function* () { return GetUpdatedProperty(preUser, user); });
    }
}
exports.PinguUser = PinguUser;
