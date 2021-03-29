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
exports.GuildAchievement = exports.useChannel = void 0;
const AchievementBase_1 = require("./AchievementBase");
function useChannel(channel, extraInfo) {
    return `Use the #${channel.toLowerCase()} channel to ${extraInfo}`;
}
exports.useChannel = useChannel;
const helpers_1 = require("../../../helpers");
const PinguGuild_1 = require("../../guild/PinguGuild");
class GuildAchievement extends AchievementBase_1.AchievementBase {
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
            let pGuilds = yield PinguGuild_1.GetPGuilds();
            let whole = pGuilds.length;
            let part = pGuilds.filter(pGuild => pGuild.settings.config.achievements.achievements.find(a => a._id == this._id)).length;
            return new helpers_1.Percentage(whole, part);
        });
    }
    static useCommand(command, extraInfo) {
        return `Have a member use the \`${command}\` command to ${extraInfo}`;
    }
}
exports.GuildAchievement = GuildAchievement;
GuildAchievement.Achievements = [
    new GuildAchievement(1, "What message?", 'EVENT', 'messageDelete', "Have a message deleted in a channel"),
    new GuildAchievement(2, "The forgotten mesages", 'EVENT', 'messageDeleteBulk', "Have multiple messages deleted in a channel"),
    new GuildAchievement(3, "It's a gift!", 'COMMAND', 'giveaway', "Have a giveaway hosted in the server")
        .setCallback('0', ([params]) => __awaiter(void 0, void 0, void 0, function* () { var _a, _b, _c; return (_c = (_b = (_a = params.response) === null || _a === void 0 ? void 0 : _a.embeds[0]) === null || _b === void 0 ? void 0 : _b.title) === null || _c === void 0 ? void 0 : _c.includes('New Giveaway!'); })),
    new GuildAchievement(4, "The senate will decide your fate", 'COMMAND', 'poll', "Have a poll hosted in the server")
        .setCallback('0', ([params]) => __awaiter(void 0, void 0, void 0, function* () { var _d, _e, _f; return (_f = (_e = (_d = params.response) === null || _d === void 0 ? void 0 : _d.embeds[0]) === null || _e === void 0 ? void 0 : _e.title) === null || _f === void 0 ? void 0 : _f.includes('New Poll!'); })),
    new GuildAchievement(5, "There's still room for improvement...", 'COMMAND', 'suggestion', "Have a server member use the `suggestion` command")
        .setCallback('0', ([params]) => __awaiter(void 0, void 0, void 0, function* () { var _g, _h, _j; return (_j = (_h = (_g = params.response) === null || _g === void 0 ? void 0 : _g.embeds[0]) === null || _h === void 0 ? void 0 : _h.title) === null || _j === void 0 ? void 0 : _j.includes('New Suggestion!'); })),
    new GuildAchievement(6, "Poof!", 'COMMAND', 'clear', GuildAchievement.useCommand('clear', 'clear one or more messages')),
    new GuildAchievement(7, "Pretty message!", 'COMMAND', 'embed', GuildAchievement.useCommand('embed', "make a custom embed")),
    new GuildAchievement(8, "Let's give yo uanew look...", 'COMMAND', 'prefix', "Change the prefix of Pingu"),
    new GuildAchievement(9, 'Out to the followers!', 'COMMAND', 'publish', GuildAchievement.useCommand('publish', "publish a message in an announcement channel")),
    new GuildAchievement(10, "You decide your view of the server!", 'COMMAND', 'reactionroles', 'Set up ReactionRoles on the server')
        .setCallback('0', ([params]) => __awaiter(void 0, void 0, void 0, function* () { var _k, _l, _m; return (_m = (_l = (_k = params.response) === null || _k === void 0 ? void 0 : _k.embeds[0]) === null || _l === void 0 ? void 0 : _l.title) === null || _m === void 0 ? void 0 : _m.includes('ReactionRole Created!'); })),
    new GuildAchievement(11, "Slow down there!", 'COMMAND', 'slowmode', GuildAchievement.useCommand('slowmode', "setup a custom slowmode number")),
    new GuildAchievement(12, "From Discord to roleplay", 'COMMAND', 'activity', GuildAchievement.useCommand('activity', '"roleplay" with someone')),
    new GuildAchievement(13, "We gotta get schwifty!", 'COMMAND', 'music', GuildAchievement.useCommand('music', "play some music in a voice channel")),
    new GuildAchievement(14, "I love my members!", 'CHANNEL', 'Giveaway', 'Setup a giveaway channel to the server'),
    new GuildAchievement(15, "What do you guys think?", 'CHANNEL', 'Poll', 'Setup a poll channel to the server'),
    new GuildAchievement(16, "I will listen- I promise!", 'CHANNEL', 'Suggestion', 'Setup a suggestion channel to the server'),
    new GuildAchievement(17, "Discord? More like another streaming service", 'VOICE', 'Streaming', "Have a member live stream in a channel"),
    new GuildAchievement(18, "Ewww you guys use Zoom?", 'VOICE', 'Video', "Have a member enable their camera in a voice channel"),
    new GuildAchievement(19, "The Government of China", 'MODERATION', 'Logs', "Setup a logs channel to moderate the server's events"),
    new GuildAchievement(20, "We are the chosen ones!", 'EVENT', 'chosenGuild', 'Become the chosen server in Pingu Support')
];
