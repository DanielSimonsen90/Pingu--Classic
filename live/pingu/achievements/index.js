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
exports.AchievementCheck = exports.AchievementCheckType = void 0;
const UserAchievement_1 = require("./items/UserAchievement");
const GuildMemberAchievement_1 = require("./items/GuildMemberAchievement");
const GuildAchievement_1 = require("./items/GuildAchievement");
const UserAchievementConfig_1 = require("./config/UserAchievementConfig");
const GuildMemberAchievementConfig_1 = require("./config/GuildMemberAchievementConfig");
const GuildAchievementConfig_1 = require("./config/GuildAchievementConfig");
const PAchievement_1 = require("../../database/json/PAchievement");
function AchievementCheckType(client, achieverType, achiever, key, keyType, config, callbackKey, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = (arr) => arr.filter(i => i.key == key && i.type == keyType);
        let allAchievements = filter((function getAllAchievements() {
            switch (achieverType) {
                case 'USER': return UserAchievement_1.UserAchievement.Achievements;
                case 'GUILDMEMBER': return GuildMemberAchievement_1.GuildMemberAchievement.Achievements;
                case 'GUILD': return GuildAchievement_1.GuildAchievement.Achievements;
                default: return null;
            }
        })());
        if (!allAchievements)
            return null;
        let pAchievements = ((yield (function getAllPAchievements() {
            return __awaiter(this, void 0, void 0, function* () {
                switch (achieverType) {
                    case 'USER':
                        const user = client.pUsers.get(achiever);
                        return user === null || user === void 0 ? void 0 : user.achievementConfig.achievements;
                    case 'GUILDMEMBER':
                        const guildMember = achiever;
                        const member = client.pGuilds.get(guildMember.guild).members.get(guildMember.id);
                        return member === null || member === void 0 ? void 0 : member.achievementConfig.achievements;
                    case 'GUILD': return client.pGuilds.get(achiever).settings.config.achievements.achievements;
                    default: return null;
                }
            });
        })()) || []).map(pa => pa._id);
        //Find an achievement matching Key & Type, that achiever doesn't have, and the achievement's callback returns true
        let achievements = yield (function Find() {
            return __awaiter(this, void 0, void 0, function* () {
                const result = [];
                for (const a of allAchievements)
                    if (!pAchievements.includes(a._id) && (yield a.callback(callback)))
                        result.push(a);
                return result;
            });
        })();
        if (!achievements.length)
            return null;
        return (yield Promise.all(achievements.map((achievement) => __awaiter(this, void 0, void 0, function* () {
            let pAchievement = new PAchievement_1.default({ _id: achievement._id, achievedAt: new Date() });
            try {
                const notificationType = config.notificationType || config.notificationTypes.guild;
            }
            catch (err) {
                config = (function newConfig() {
                    switch (achieverType) {
                        case 'USER': return new UserAchievementConfig_1.default('NONE');
                        case 'GUILDMEMBER': return new GuildMemberAchievementConfig_1.default('NONE');
                        case 'GUILD': return new GuildAchievementConfig_1.default({ guild: 'NONE', members: 'NONE' }, achiever.id);
                        default: return null;
                    }
                })();
            }
            yield (function UpdateDB() {
                return __awaiter(this, void 0, void 0, function* () {
                    const scriptName = 'PinguLibrary.AchievementCheckType()';
                    switch (achieverType) {
                        case 'USER':
                            let pUser = client.pUsers.get(achiever);
                            pUser.achievementConfig.achievements.push(pAchievement);
                            return client.pUsers.update(pUser, scriptName, `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${achiever.tag}**'s PinguUser achievements collection`);
                        case 'GUILDMEMBER':
                            const guildMember = achiever;
                            let pGuildMember = client.pGuilds.get(guildMember.guild).members.get(guildMember.id);
                            pGuildMember.achievementConfig.achievements.push(pAchievement);
                            return client.pGuildMembers.get(guildMember.guild).update(pGuildMember, scriptName, `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${achiever.user.tag}**'s PinguGuildMember achievements collection`);
                        case 'GUILD':
                            let pGuild = client.pGuilds.get(achiever);
                            pGuild.settings.config.achievements.achievements.push(pAchievement);
                            return client.pGuilds.update(pGuild, scriptName, `Added ${achieverType.toLowerCase()} achievement, #${pAchievement._id} "${achievement.name}" to **${achiever.name}**'s PinguGuild achievements collection`);
                        default: return null;
                    }
                });
            })();
            return (function notify() {
                switch (achieverType) {
                    case 'USER': return UserAchievementConfig_1.default.notify(client, achiever, achievement, config);
                    case 'GUILDMEMBER': return GuildMemberAchievementConfig_1.default.notify(client, achiever, achievement, config);
                    case 'GUILD': return GuildAchievementConfig_1.default.notify(client, achiever, achievement, config);
                    default: return null;
                }
            })();
        }))))[0];
    });
}
exports.AchievementCheckType = AchievementCheckType;
function AchievementCheck(client, data, key, type, callback) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (data.user && !data.user.bot) {
            const pUser = client.pUsers.get(data.user);
            if (!pUser)
                return false;
            var givenAchievement = yield AchievementCheckType(client, 'USER', data.user, key, type, pUser.achievementConfig, key, callback);
        }
        if (data.guild) {
            let pGuild = client.pGuilds.get(data.guild);
            if (!pGuild)
                return false;
            givenAchievement = yield AchievementCheckType(client, 'GUILD', data.guild, key, type, pGuild.settings.config.achievements, key, callback);
        }
        if (data.guildMember && !((_a = data.guildMember.user) === null || _a === void 0 ? void 0 : _a.bot)) {
            let pGuildMember = client.pGuilds.get(data.guildMember.guild).members.get(data.guildMember.id);
            if (!pGuildMember)
                return false;
            givenAchievement = yield AchievementCheckType(client, 'GUILDMEMBER', data.guildMember, key, type, pGuildMember.achievementConfig, key, callback);
        }
        return givenAchievement != null;
    });
}
exports.AchievementCheck = AchievementCheck;
