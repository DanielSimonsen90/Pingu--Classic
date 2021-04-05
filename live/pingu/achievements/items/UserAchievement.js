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
exports.UserAchievement = void 0;
const AchievementBase_1 = require("./AchievementBase");
const PinguUser_1 = require("../../user/PinguUser");
const helpers_1 = require("../../../helpers");
const PinguLibrary_1 = require("../../library/PinguLibrary");
class UserAchievement extends AchievementBase_1.AchievementBase {
    constructor(id, name, key, type, description) {
        super(id, name, description);
        this.key = key;
        this.type = type;
    }
    setCallback(type, callback) {
        this.callback = callback;
        return this;
    }
    callback(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    getPercentage() {
        return __awaiter(this, void 0, void 0, function* () {
            let pUsers = yield PinguUser_1.GetPUsers();
            let whole = pUsers.length;
            let part = pUsers.filter(pUser => pUser.achievementConfig.achievements.find(a => a._id == this._id)).length;
            return new helpers_1.Percentage(whole, part);
        });
    }
    static DailyStreak(id, name, streak) {
        return new UserAchievement(id, name, 'COMMAND', 'daily', `Achieve a ${streak} streak`).setCallback('0', ([params]) => __awaiter(this, void 0, void 0, function* () {
            let pUser = yield PinguUser_1.GetPUser(params.message.author);
            return pUser.daily.streak >= streak;
        }));
    }
}
exports.UserAchievement = UserAchievement;
UserAchievement.Achievements = [
    new UserAchievement(1, "Pingu? Yeah he's my best friend!", 'EVENT', 'guildMemberAdd', "Of all Pingu Users, you share the most servers with Pingu")
        .setCallback('guildMemberAdd', ([member]) => __awaiter(void 0, void 0, void 0, function* () {
        const [pUser, pUsers] = yield Promise.all([PinguUser_1.GetPUser(member.user), PinguUser_1.GetPUsers()]);
        const mKUser = pUsers.sort((a, b) => a.sharedServers.length - b.sharedServers.length)[0];
        console.log(mKUser.tag, mKUser.sharedServers.length);
        return pUser._id == mKUser._id;
    })),
    new UserAchievement(2, 'Penguin Owner', 'EVENT', 'guildCreate', "Add Pingu to your server"),
    new UserAchievement(3, "Rest in Peace", 'EVENT', 'guildDelete', "Remove Pingu from your server"),
    new UserAchievement(4, "I'm trying something new...", 'EVENT', 'userUpdate', "Change your PinguUser information")
        .setCallback('userUpdate', ([pre, cur]) => __awaiter(void 0, void 0, void 0, function* () { return Object.keys(PinguUser_1.IsUpdated(pre, cur))[0] != null; })),
    new UserAchievement(5, "OwO whots dis", 'COMMAND', 'help', "Use the `help` command, to see everything you can do with Pingu"),
    new UserAchievement(6, "Curious...", 'COMMAND', 'info', "Use the `info` command to display Pingu's internal information"),
    new UserAchievement(7, 'Pong!', 'COMMAND', 'ping', "Use the `ping` command to see Pingu's latency"),
    new UserAchievement(8, "Let the penguin decide your fate", 'COMMAND', 'spinthewheel', "Use the `spinthewheel` command to get a random answer"),
    new UserAchievement(8, "50/50", 'COMMAND', 'spinthewheel', "Use the `spinthewheel` command to either yes or no")
        .setCallback('0', ([params]) => __awaiter(void 0, void 0, void 0, function* () { return !params.args[0]; })),
    new UserAchievement(9, "The dankest penguin", 'COMMAND', 'meme', "Use the `meme` command to get dank penguin memes"),
    new UserAchievement(10, "When did Discord get Snapchat streaks?", 'COMMAND', 'daily', "Use the `daily` command"),
    UserAchievement.DailyStreak(11, "The daily quarter", 25),
    UserAchievement.DailyStreak(12, "Half to 100", 50),
    UserAchievement.DailyStreak(13, "Half to 100", 50),
    UserAchievement.DailyStreak(14, "Nice", 69),
    UserAchievement.DailyStreak(15, "Dedication", 100),
    UserAchievement.DailyStreak(16, "Blaze it!", 420),
    new UserAchievement(17, "King of the Streaks", 'COMMAND', 'daily', "Achieve the highest streak among all Pingu users")
        .setCallback('0', ([params]) => __awaiter(void 0, void 0, void 0, function* () {
        const [pUser, pUsers] = yield Promise.all([PinguUser_1.GetPUser(params.message.author), PinguUser_1.GetPUsers()]);
        const highestStreak = pUsers.sort((a, b) => a.daily.streak - b.daily.streak)[0];
        console.log(highestStreak.tag, highestStreak.daily.streak);
        return pUser._id == highestStreak._id;
    })),
    new UserAchievement(18, "Now **this** is anonymous!", 'COMMAND', 'tell', "Use the `tell` command to message a member"),
    new UserAchievement(19, "I don't recall watching National Geographic", 'COMMAND', 'fact', "Use the `fact` command to get a random fact about penguins"),
    new UserAchievement(20, "I am penguin.", 'COMMAND', 'noot', "Use the `noot` command to say something using Pingu"),
    new UserAchievement(21, "Can I have your autograph?", 'COMMAND', 'contact', "Use the `contact` command to get information about Pingu's Owner"),
    new UserAchievement(22, "You! With me.", 'COMMAND', 'invite', "Use the `invite` command to invite Pingu to your server"),
    new UserAchievement(23, "Marry me!", 'COMMAND', 'marry', "Use the `marry` command to marry someone"),
    new UserAchievement(24, "I'm the chosen one!", 'EVENT', 'chosenUser', "Become the chosen user in Pingu Support")
        .setCallback('chosenUser', ([user, pUser]) => __awaiter(void 0, void 0, void 0, function* () { return pUser.sharedServers.find(pg => pg._id == PinguLibrary_1.SavedServers.PinguSupport(user.client).id) != null; }))
];
