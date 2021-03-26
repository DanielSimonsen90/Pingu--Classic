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
exports.PinguUser = exports.cache = exports.GetPUsers = exports.DeletePUser = exports.UpdatePUser = exports.GetPUser = exports.WritePUser = void 0;
const discord_js_1 = require("discord.js");
const database_1 = require("../../database");
const items_1 = require("./items");
const UserAchievementConfig_1 = require("../achievements/config/UserAchievementConfig");
const PinguUser_1 = require("../../MongoSchemas/PinguUser");
const PinguLibrary_1 = require("../library/PinguLibrary");
const helpers_1 = require("../../helpers");
function WritePUser(client, user, scriptName, succMsg, errMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        PinguLibrary_1.DBExecute(client, (mongoose) => __awaiter(this, void 0, void 0, function* () {
            let created = yield new PinguUser_1.PinguUserSchema(new PinguUser(user)).save();
            if (!created)
                PinguLibrary_1.pUserLog(client, scriptName, errMsg);
            else
                PinguLibrary_1.pUserLog(client, scriptName, succMsg);
        }));
    });
}
exports.WritePUser = WritePUser;
function GetPUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let pUserDoc = yield PinguUser_1.PinguUserSchema.findOne({ _id: user.id }).exec();
        if (!pUserDoc)
            return null;
        exports.cache.set(user.id, pUserDoc.toObject());
        return pUserDoc.toObject();
    });
}
exports.GetPUser = GetPUser;
function UpdatePUser(client, updatedProperty, pUser, scriptName, succMsg, errMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield PinguUser_1.PinguUserSchema.updateOne({ _id: pUser._id }, updatedProperty, null, (err) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return PinguLibrary_1.pUserLog(client, scriptName, errMsg, err);
            PinguLibrary_1.pUserLog(client, scriptName, succMsg);
            exports.cache.set(pUser._id, yield GetPUser({ id: pUser._id }));
        }));
    });
}
exports.UpdatePUser = UpdatePUser;
function DeletePUser(client, user, scriptName, succMsg, errMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield PinguUser_1.PinguUserSchema.deleteOne({ _id: user.id }, null, err => {
            if (err)
                PinguLibrary_1.pUserLog(client, scriptName, errMsg, new helpers_1.Error(err));
            else
                PinguLibrary_1.pUserLog(client, scriptName, succMsg);
        });
    });
}
exports.DeletePUser = DeletePUser;
function GetPUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield PinguUser_1.PinguUserSchema.find({}).exec()).map(collDoc => collDoc.toObject());
    });
}
exports.GetPUsers = GetPUsers;
exports.cache = new discord_js_1.Collection();
class PinguUser {
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
        this.achievementConfig = new UserAchievementConfig_1.UserAchievementConfig('DM');
    }
    static WritePUser(client, user, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function* () {
            return WritePUser(client, user, scriptName, succMsg, errMsg);
        });
    }
    static GetPUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return GetPUser(user);
        });
    }
    static UpdatePUser(client, updatedProperty, pUser, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function* () {
            return UpdatePUser(client, updatedProperty, pUser, scriptName, succMsg, errMsg);
        });
    }
    static DeletePUser(client, user, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function* () {
            return DeletePUser(client, user, scriptName, succMsg, errMsg);
        });
    }
    static GetPUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return GetPUsers();
        });
    }
}
exports.PinguUser = PinguUser;
