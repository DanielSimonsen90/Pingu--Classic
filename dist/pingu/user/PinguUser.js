"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguUser = void 0;
const database_1 = require("../../database");
const items_1 = require("./items");
const UserAchievementConfig_1 = require("../achievements/config/UserAchievementConfig");
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
        this.achievementConfig = new UserAchievementConfig_1.default('NONE');
        this.joinedAt = new Date(Date.now());
    }
    _id;
    tag;
    sharedServers;
    marry;
    replyPerson;
    daily;
    avatar;
    playlists;
    achievementConfig;
    joinedAt;
}
exports.PinguUser = PinguUser;
exports.default = PinguUser;
