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
exports.GuildMemberAchievement = void 0;
const AchievementBase_1 = require("./AchievementBase");
const GuildAchievement_1 = require("./GuildAchievement");
const helpers_1 = require("../../../helpers");
const PinguClient_1 = require("../../client/PinguClient");
const PinguGuild_1 = require("../../guild/PinguGuild");
const PinguUser_1 = require("../../user/PinguUser");
class GuildMemberAchievement extends AchievementBase_1.AchievementBase {
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
    getPercentage(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            let pGuildMembersMap = ((yield PinguGuild_1.GetPGuild(guild)).members);
            let whole = pGuildMembersMap.size;
            let pGuildMembers = [];
            pGuildMembersMap.forEach(v => pGuildMembers.push(v));
            let part = pGuildMembers.filter(pGuildMember => pGuildMember.achievementConfig.achievements.find(a => a._id == this._id)).length;
            return new helpers_1.Percentage(whole, part);
        });
    }
    static DecidablesCheck(message, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.guild)
                return false;
            let pGuild = yield PinguGuild_1.GetPGuild(message.guild);
            return callback(pGuild.settings.config.decidables).find(d => d._id == message.id) != null;
        });
    }
}
exports.GuildMemberAchievement = GuildMemberAchievement;
GuildMemberAchievement.Achievements = [
    new GuildMemberAchievement(1, "Hello there", 'EVENT', 'guildMemberAdd', "Join a server that has Pingu in it is"),
    new GuildMemberAchievement(2, "I have spoken.", 'EVENT', 'guildMemberSpeaking', "Say something in a voice channel"),
    new GuildMemberAchievement(3, "Mom? Can I have a friend over?", 'EVENT', 'inviteCreate', "Create an invite to the Discord"),
    new GuildMemberAchievement(4, "I never said anything!", 'EVENT', 'messageDelete', "Delete or have a message deleted"),
    new GuildMemberAchievement(5, "Nobody saw that...", 'EVENT', 'messageUpdate', "Edit a sent message"),
    new GuildMemberAchievement(6, "I could be one in a million...", 'EVENT', 'messageReactionAdd', "Participate in a giveaway")
        .setCallback('messageReactionAdd', ([reaction, user]) => __awaiter(void 0, void 0, void 0, function* () { return GuildMemberAchievement.DecidablesCheck(reaction.message, (c => c.giveawayConfig.giveaways)); })),
    new GuildMemberAchievement(7, "What did you guys vote?", 'EVENT', 'messageReactionAdd', "Participate in a poll")
        .setCallback('messageReactionAdd', ([reaction, user]) => __awaiter(void 0, void 0, void 0, function* () { return GuildMemberAchievement.DecidablesCheck(reaction.message, (c => c.pollConfig.polls)); })),
    new GuildMemberAchievement(7, "OK, I have left a comment down below", 'COMMAND', 'suggestion', GuildMemberAchievement.useCommand('suggestion', "suggest an improvement to the server")),
    new GuildMemberAchievement(8, "What is this server?", 'COMMAND', 'serverinfo', GuildMemberAchievement.useCommand('serverinfo', "display information about the server")),
    new GuildMemberAchievement(9, "New phone who dis", 'COMMAND', 'whois', GuildMemberAchievement.useCommand('whois', "display information about a user")),
    new GuildMemberAchievement(10, "I am inevitable", 'COMMAND', 'clear', GuildMemberAchievement.useCommand('clear', "\"snap\" messages in a chat")),
    new GuildMemberAchievement(11, "I see only what I want to see", 'EVENT', 'messageReactionAdd', "Use the server's ReactionRole feature")
        .setCallback('messageReactionAdd', ([reaction, user]) => __awaiter(void 0, void 0, void 0, function* () {
        const { guild } = reaction.message;
        if (!guild)
            return false;
        const pGuild = yield PinguGuild_1.GetPGuild(guild);
        if (!pGuild)
            return false;
        const { reactionRoles } = pGuild.settings;
        if (!(reactionRoles === null || reactionRoles === void 0 ? void 0 : reactionRoles.length))
            return false;
        return reactionRoles.find(rr => rr.messageID == reaction.message.id) != undefined;
    })),
    new GuildMemberAchievement(12, "OK Boomer", 'COMMAND', 'boomer', GuildMemberAchievement.useCommand('boomer', "express your inner Gen-Z")),
    new GuildMemberAchievement(13, "Proffesional DJ", 'COMMAND', 'music', GuildMemberAchievement.useCommand('music', "play some sick tunes in a voice channel")),
    new GuildMemberAchievement(14, "I said that?", 'COMMAND', 'quote', "Be quoted by someone that used the `quote` command")
        .setCallback('0', ([params]) => __awaiter(void 0, void 0, void 0, function* () {
        const { message } = params;
        const member = message.mentions.members.first();
        if (!member || message.member.id == member.id)
            return false;
        const pMention = yield PinguUser_1.GetPUser(member.user);
        return pMention != null;
    })),
    new GuildMemberAchievement(15, "I'm vibin!", 'COMMAND', 'viberate', "Use the `viberate` command and be rated higher than 7")
        .setCallback('0', ([params]) => __awaiter(void 0, void 0, void 0, function* () {
        return params.response && params.response.author.bot &&
            [PinguClient_1.Clients.BetaID, PinguClient_1.Clients.PinguID].includes(params.response.author.id) &&
            params.response.content.includes('7');
    })),
    new GuildMemberAchievement(16, "Text-To-Image", 'CHANNEL', "Emotes", GuildAchievement_1.useChannel('Emotes', "create an emote")),
    new GuildMemberAchievement(17, "I have spoken", 'EVENT', 'guildMemberSpeaking', "Say something in a voice channel"),
    new GuildMemberAchievement(18, "Twitch might as well partner me now", 'VOICE', 'Streaming', "Livestream in a voice channel"),
    new GuildMemberAchievement(19, "Subscribe to my OnlyFans!", 'VOICE', 'Video', "Turn on your camera in a voice channel"),
    new GuildMemberAchievement(20, "Noice", 'VOICE', 'Noice', "Use the `noice` command in a voice channel"),
    new GuildMemberAchievement(21, "I don't ever want to see you again.", 'MODERATION', 'Ban', "Ban someone from the server"),
    new GuildMemberAchievement(22, "Just like football", 'MODERATION', 'Kick', "Kick someone from the server"),
    new GuildMemberAchievement(23, "Silence!", 'MODERATION', 'Mute', "Mute someone"),
    new GuildMemberAchievement(24, "Jeez, I didn't actually think you'd shush...", 'MODERATION', 'Unmute', "Unmute someone"),
    new GuildMemberAchievement(25, "You are forgiven", 'MODERATION', 'Unban', "Unban someone you banned")
        .setCallback('0', ([guild, moderator, user]) => __awaiter(void 0, void 0, void 0, function* () {
        const audit = (yield guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' }))
            .entries.find(e => e.target.id == user.id && e.executor.id == moderator.id);
        return audit != undefined;
    })),
    new GuildMemberAchievement(26, "You're on my watchlist...", 'MODERATION', 'Warn', "Warn a member")
];
