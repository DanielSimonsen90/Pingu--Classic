"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marry = exports.ReactionRole = exports.Daily = exports.Song = exports.Queue = exports.TimeLeftObject = exports.GiveawayConfig = exports.PollConfig = exports.Suggestion = exports.Giveaway = exports.Poll = exports.PinguEvents = exports.PinguLibrary = exports.PinguGuild = exports.PinguUser = exports.PMarry = exports.PQueue = exports.PClient = exports.PGuild = exports.PUser = exports.PChannel = exports.PRole = exports.PGuildMember = exports.PItem = exports.DiscordPermissions = exports.Error = void 0;
var discord_js_1 = require("discord.js");
var fs = require("fs");
var Error = /** @class */ (function () {
    function Error(err) {
        this.message = err.message;
        this.stack = err.stack;
        this.fileName = err.fileName;
        this.lineNumber = err.lineNumber;
    }
    return Error;
}());
exports.Error = Error;
var DiscordPermissions = /** @class */ (function () {
    function DiscordPermissions() {
    }
    DiscordPermissions.bitOf = function (value) {
        return discord_js_1.Permissions.resolve(value);
    };
    DiscordPermissions['CREATE_INSTANT_INVITE'] = 'CREATE_INSTANT_INVITE';
    DiscordPermissions['KICK_MEMBERS'] = 'KICK_MEMBERS';
    DiscordPermissions['BAN_MEMBERS'] = 'BAN_MEMBERS';
    DiscordPermissions['ADMINISTRATOR'] = 'ADMINISTRATOR';
    DiscordPermissions['MANAGE_CHANNELS'] = 'MANAGE_CHANNELS';
    DiscordPermissions['MANAGE_GUILD'] = 'MANAGE_GUILD';
    DiscordPermissions['ADD_REACTIONS'] = 'ADD_REACTIONS';
    DiscordPermissions['VIEW_AUDIT_LOG'] = 'VIEW_AUDIT_LOG';
    DiscordPermissions['PRIORITY_SPEAKER'] = 'PRIORITY_SPEAKER';
    DiscordPermissions['STREAM'] = 'STREAM';
    DiscordPermissions['VIEW_CHANNEL'] = 'VIEW_CHANNEL';
    DiscordPermissions['SEND_MESSAGES'] = 'SEND_MESSAGES';
    DiscordPermissions['SEND_TTS_MESSAGES'] = 'SEND_TTS_MESSAGES';
    DiscordPermissions['MANAGE_MESSAGES'] = 'MANAGE_MESSAGES';
    DiscordPermissions['EMBED_LINKS'] = 'EMBED_LINKS';
    DiscordPermissions['ATTACH_FILES'] = 'ATTACH_FILES';
    DiscordPermissions['READ_MESSAGE_HISTORY'] = 'READ_MESSAGE_HISTORY';
    DiscordPermissions['MENTION_EVERYONE'] = 'MENTION_EVERYONE';
    DiscordPermissions['USE_EXTERNAL_EMOJIS'] = 'USE_EXTERNAL_EMOJIS';
    DiscordPermissions['VIEW_GUILD_INSIGHTS'] = 'VIEW_GUILD_INSIGHTS';
    DiscordPermissions['CONNECT'] = 'CONNECT';
    DiscordPermissions['SPEAK'] = 'SPEAK';
    DiscordPermissions['MUTE_MEMBERS'] = 'MUTE_MEMBERS';
    DiscordPermissions['DEAFEN_MEMBERS'] = 'DEAFEN_MEMBERS';
    DiscordPermissions['MOVE_MEMBERS'] = 'MOVE_MEMBERS';
    DiscordPermissions['USE_VAD'] = 'USE_VAD';
    DiscordPermissions['CHANGE_NICKNAME'] = 'CHANGE_NICKNAME';
    DiscordPermissions['MANAGE_NICKNAMES'] = 'MANAGE_NICKNAMES';
    DiscordPermissions['MANAGE_ROLES'] = 'MANAGE_ROLES';
    DiscordPermissions['MANAGE_WEBHOOKS'] = 'MANAGE_WEBHOOKS';
    DiscordPermissions['MANAGE_EMOJIS'] = 'MANAGE_EMOJIS';
    return DiscordPermissions;
}());
exports.DiscordPermissions = DiscordPermissions;
var BitPermission = /** @class */ (function () {
    function BitPermission(permString, bit) {
        this.permString = permString;
        this.bit = bit;
    }
    return BitPermission;
}());
//#region JSON Classes
var PItem = /** @class */ (function () {
    function PItem(object) {
        this.id = object.id;
        this.name = object.name;
    }
    return PItem;
}());
exports.PItem = PItem;
var PGuildMember = /** @class */ (function (_super) {
    __extends(PGuildMember, _super);
    function PGuildMember(member) {
        return _super.call(this, {
            id: member.id,
            name: member.user.tag
        }) || this;
    }
    PGuildMember.prototype.toString = function () {
        return "<@" + this.id + ">";
    };
    return PGuildMember;
}(PItem));
exports.PGuildMember = PGuildMember;
var PRole = /** @class */ (function (_super) {
    __extends(PRole, _super);
    function PRole(role) {
        var _this = this;
        try {
            _this = _super.call(this, role) || this;
        }
        catch (_a) {
            return undefined;
        }
        return _this;
    }
    return PRole;
}(PItem));
exports.PRole = PRole;
var PChannel = /** @class */ (function (_super) {
    __extends(PChannel, _super);
    function PChannel(channel) {
        return _super.call(this, channel) || this;
    }
    return PChannel;
}(PItem));
exports.PChannel = PChannel;
var PUser = /** @class */ (function (_super) {
    __extends(PUser, _super);
    function PUser(user) {
        return _super.call(this, { id: user.id, name: user.tag }) || this;
    }
    return PUser;
}(PItem));
exports.PUser = PUser;
var PGuild = /** @class */ (function (_super) {
    __extends(PGuild, _super);
    function PGuild(guild) {
        return _super.call(this, guild) || this;
    }
    return PGuild;
}(PItem));
exports.PGuild = PGuild;
var PClient = /** @class */ (function () {
    function PClient(client, guild) {
        this.displayName = guild.me.displayName;
    }
    return PClient;
}());
exports.PClient = PClient;
var PQueue = /** @class */ (function () {
    function PQueue(queue) {
        this.logChannel = new PChannel(queue.logChannel);
        this.voiceChannel = new PChannel(queue.voiceChannel);
        this.index = queue.index;
        this.songs = queue.songs;
        this.volume = queue.volume;
        this.client = queue.client;
        this.loop = queue.loop;
        this.playing = queue.playing;
    }
    PQueue.prototype.ToQueue = function (guild) {
        return __awaiter(this, void 0, void 0, function () {
            var queue, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        queue = new Queue(this.client, guild.channels.cache.find(function (c) { return c.id == _this.logChannel.id; }), guild.channels.cache.find(function (c) { return c.id == _this.voiceChannel.id; }), this.songs, this.playing);
                        _a = queue;
                        return [4 /*yield*/, queue.voiceChannel.join()];
                    case 1:
                        _a.connection = _b.sent();
                        queue.client.displayName = this.client.displayName;
                        queue.volume = this.volume;
                        queue.loop = this.loop;
                        queue.index = this.index;
                        return [2 /*return*/, queue];
                }
            });
        });
    };
    return PQueue;
}());
exports.PQueue = PQueue;
var PMarry = /** @class */ (function () {
    function PMarry(marry) {
        this.partner = marry.partner;
        this.internalDate = marry.internalDate.toString();
    }
    PMarry.prototype.ToMarry = function () {
        return new Marry(this.partner, this.internalDate);
    };
    return PMarry;
}());
exports.PMarry = PMarry;
//#endregion
//#region Custom Pingu classes 
var PinguUser = /** @class */ (function () {
    //#endregion
    function PinguUser(user, client) {
        var pUser = new PUser(user);
        this.id = pUser.id;
        this.tag = pUser.name;
        this.sharedServers = PinguLibrary.getSharedServers(client, user).map(function (guild) { return new PGuild(guild); });
        this.marry = new Marry();
        this.replyPerson = null;
        this.daily = new Daily();
        this.avatar = user.avatarURL();
        this.playlists = new Array();
    }
    //#region Static PinguUser methods
    PinguUser.GetPUsers = function () {
        var userCollection = fs.readdirSync("./users/").filter(function (file) { return file.endsWith('.json'); });
        var pUserArr = [];
        for (var _i = 0, userCollection_1 = userCollection; _i < userCollection_1.length; _i++) {
            var userFile = userCollection_1[_i];
            pUserArr.push(require("./users/" + userFile));
        }
        return pUserArr;
    };
    PinguUser.GetPUser = function (user, suppressError) {
        if (user.bot)
            return null;
        var result = this.GetPUsers().find(function (pu) { return pu.id == user.id; });
        if (!result && !suppressError) {
            PinguLibrary.errorLog(user.client, "Unable to find a user in pUsers with id " + user.id + " - Created one...");
            PinguUser.WritePUser(user);
            result = new PinguUser(user, user.client);
        }
        return result;
    };
    PinguUser.UpdatePUsersJSON = function (client, user, script, succMsg, errMsg) {
        var fileName = this.PUserFileName(user);
        var path = "./users/" + fileName + ".json";
        try {
            var pUserObj = require(path);
        }
        catch (err) {
            return PinguLibrary.pUserLog(client, script, "Unable to get pUser from " + fileName, new Error(err));
        }
        fs.writeFile(path, '', function (err) {
            if (err)
                PinguLibrary.pUserLog(client, script, "[writeFile]: " + errMsg, new Error(err));
            else
                fs.appendFile(path, JSON.stringify(pUserObj, null, 4), function (err) {
                    if (err)
                        PinguLibrary.pUserLog(client, script, "[appendFile]: " + errMsg, new Error(err));
                    else
                        PinguLibrary.pUserLog(client, script, succMsg);
                });
        });
    };
    PinguUser.UpdatePUsersJSONAsync = function (client, user, script, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.UpdatePUsersJSON(client, user, script, succMsg, errMsg)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PinguUser.WritePUser = function (user, callback) {
        var _this = this;
        try {
            var pUser_1 = new PinguUser(user, user.client);
            fs.writeFile("./users/" + this.PUserFileName(user) + ".json", JSON.stringify(pUser_1, null, 2), function (err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                PinguLibrary.pUserLog(user.client, "WritePUser", null, new Error(err));
                            return [4 /*yield*/, callback];
                        case 1:
                            if (_a.sent())
                                callback(pUser_1);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (ewwor) {
            PinguLibrary.errorLog(user.client, "WritePUser Error", null, ewwor);
        }
    };
    PinguUser.UpdatePUser = function (from, to, callback) {
        var _this = this;
        var data = SetDifference();
        this.DeletePUser(from, function () {
            try {
                fs.writeFile("./users/" + _this.PUserFileName(to) + ".json", JSON.stringify(data, null, 2), function (err) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err)
                                    PinguLibrary.pUserLog(to.client, "UpdatePUser", null, new Error(err));
                                return [4 /*yield*/, callback];
                            case 1:
                                if (_a.sent())
                                    callback(data);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            catch (ewwor) {
                PinguLibrary.errorLog(to.client, "UpdatePUser Error", null, ewwor);
            }
        });
        function SetDifference() {
            var result = PinguUser.GetPUser(from);
            var diff = new PinguUser(to, to.client);
            if (result.avatar != diff.avatar)
                result.avatar = diff.avatar;
            if (result.tag != diff.tag)
                result.tag = diff.tag;
            return result;
        }
    };
    PinguUser.DeletePUser = function (user, callback) {
        var _this = this;
        try {
            fs.unlink("./users/" + this.PUserFileName(user) + ".json", function (err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                PinguLibrary.pUserLog(user.client, "DeletePUser", "Unable to delete json file for **" + PinguUser.GetPUser(user).tag + "**", new Error(err));
                            return [4 /*yield*/, callback];
                        case 1:
                            if (_a.sent())
                                callback();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (ewwor) {
            PinguLibrary.errorLog(user.client, "DeletePUser Error", null, ewwor);
        }
    };
    PinguUser.PUserFileName = function (user) {
        var specialCharacters = ["/", "\\", "<", ">"];
        var writableName = user.tag;
        for (var _i = 0, writableName_1 = writableName; _i < writableName_1.length; _i++) {
            var c = writableName_1[_i];
            if (specialCharacters.includes(c))
                writableName = writableName.replace(c, " ");
        }
        return writableName;
    };
    return PinguUser;
}());
exports.PinguUser = PinguUser;
var PinguGuild = /** @class */ (function (_super) {
    __extends(PinguGuild, _super);
    //#endregion
    function PinguGuild(guild) {
        var _this = _super.call(this, guild) || this;
        _this.guildOwner = new PGuildMember(guild.owner);
        var Prefix = require('./config.json').Prefix;
        _this.botPrefix = Prefix;
        var welcomeChannel = guild.channels.cache.find(function (c) { return c.isText() && c.name.includes('welcome'); }) ||
            guild.channels.cache.find(function (c) { return c.isText() && c.name == 'general'; });
        _this.welcomeChannel = welcomeChannel ? new PChannel(welcomeChannel) : null;
        _this.embedColor = guild.me.roles.cache.find(function (role) { return role.name.includes('Pingu'); }) && guild.me.roles.cache.find(function (role) { return role.name.includes('Pingu'); }).color || PinguLibrary.DefaultEmbedColor;
        _this.musicQueue = null;
        _this.reactionRoles = new Array();
        _this.giveawayConfig = new GiveawayConfig();
        _this.pollConfig = new PollConfig;
        _this.suggestions = new Array();
        if (guild.id == '405763731079823380')
            _this.themeWinners = new Array();
        return _this;
    }
    //#region Static PinguGuild methods
    PinguGuild.GetPGuilds = function () {
        var guildCollection = fs.readdirSync("./servers/").filter(function (file) { return file.endsWith('.json'); });
        var pGuildArr = [];
        for (var _i = 0, guildCollection_1 = guildCollection; _i < guildCollection_1.length; _i++) {
            var guildFile = guildCollection_1[_i];
            pGuildArr.push(require("./servers/" + guildFile));
        }
        return pGuildArr;
    };
    PinguGuild.GetPGuild = function (guild, suppressError) {
        var result = this.GetPGuilds().find(function (pg) { return pg.id == guild.id; });
        if (!result && !suppressError) {
            var error = "Unable to find a guild in pGuilds with id " + guild.id;
            PinguLibrary.errorLog(guild.client, error);
            throw error;
        }
        return result;
    };
    PinguGuild.UpdatePGuildJSON = function (client, guild, script, succMsg, errMsg) {
        var path = "./servers/" + guild.name + ".json";
        try {
            var pGuildObj = require(path);
        }
        catch (err) {
            return PinguLibrary.pGuildLog(client, script, "Unable to get pGuild from " + guild.name, err);
        }
        fs.writeFile(path, '', null, function (err) {
            if (err)
                PinguLibrary.pGuildLog(client, script, "[writeFile]: " + errMsg, new Error(err));
            else
                fs.appendFile(path, JSON.stringify(pGuildObj, null, 2), function (err) {
                    if (err)
                        PinguLibrary.pGuildLog(client, script, "[appendFile]: " + errMsg, new Error(err));
                    else
                        PinguLibrary.pGuildLog(client, script, succMsg);
                });
        });
    };
    PinguGuild.UpdatePGuildJSONAsync = function (client, guild, script, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.UpdatePGuildJSON(client, guild, script, succMsg, errMsg)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PinguGuild.WritePGuild = function (guild, callback) {
        var _this = this;
        try {
            var pGuild_1 = new PinguGuild(guild);
            fs.writeFile("./servers/" + guild.name + ".json", JSON.stringify(pGuild_1, null, 2), function (err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                PinguLibrary.pGuildLog(guild.client, "WritePGuild", null, new Error(err));
                            return [4 /*yield*/, callback];
                        case 1:
                            if (_a.sent())
                                callback(pGuild_1);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (ewwor) {
            PinguLibrary.errorLog(guild.client, "WritePGuild Error", null, ewwor);
        }
    };
    PinguGuild.UpdatePGuild = function (from, to, callback) {
        var _this = this;
        var data = SetDifference();
        this.DeletePGuild(from, function () {
            try {
                fs.writeFile("./servers/" + to.name + ".json", JSON.stringify(data, null, 2), function (err) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err)
                                    PinguLibrary.pGuildLog(to.client, "UpdatePGuild", null, new Error(err));
                                return [4 /*yield*/, callback];
                            case 1:
                                if (_a.sent())
                                    callback(data);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            catch (ewwor) {
                PinguLibrary.errorLog(to.client, "UpdatePGuild Error", null, ewwor);
            }
        });
        function SetDifference() {
            var result = PinguGuild.GetPGuild(from);
            var diff = new PinguGuild(to);
            if (result.name != diff.name)
                result.name = diff.name;
            if (result.botPrefix != diff.botPrefix)
                result.botPrefix = diff.botPrefix;
            if (result.embedColor != diff.embedColor)
                result.embedColor = diff.embedColor;
            if (result.guildOwner != diff.guildOwner)
                result.guildOwner = diff.guildOwner;
            var resultChannels = result.reactionRoles.map(function (rr) { return rr.channel.id; });
            var guildChannels = to.channels.cache.filter(function (c) { return resultChannels.includes(c.id); });
            guildChannels.array().forEach(function (c, i) {
                if (c.name != result.reactionRoles[i].channel.name)
                    result.reactionRoles[i] = null;
            });
            result.reactionRoles = result.reactionRoles.filter(function (v) { return v; });
            var welcomePChannel = result.welcomeChannel;
            var welcomeChannel = to.channels.cache.find(function (c) { return c.id == welcomePChannel.id; });
            if (!welcomeChannel || welcomeChannel.name != welcomePChannel.name)
                result.welcomeChannel = null;
            return result;
        }
    };
    PinguGuild.DeletePGuild = function (guild, callback) {
        var _this = this;
        try {
            var pGuild_2 = this.GetPGuild(guild);
            fs.unlink("./servers/" + guild.name + ".json", function (err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                PinguLibrary.pGuildLog(guild.client, "DeletePGuild", "Unable to delete json file for " + pGuild_2.name, new Error(err));
                            return [4 /*yield*/, callback];
                        case 1:
                            if (_a.sent())
                                callback(pGuild_2);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (ewwor) {
            PinguLibrary.errorLog(guild.client, "DeletePGuild Error", null, ewwor);
        }
    };
    return PinguGuild;
}(PItem));
exports.PinguGuild = PinguGuild;
var PinguLibrary = /** @class */ (function () {
    function PinguLibrary() {
    }
    //#region Client
    PinguLibrary.setActivity = function (client) {
        var Activity = /** @class */ (function () {
            function Activity(text, type) {
                this.text = text;
                this.type = type;
            }
            return Activity;
        }());
        internalSetActivity();
        var updateStats = require('./config.json').updateStats;
        if (updateStats)
            UpdateStats();
        setInterval(internalSetActivity, 86400000);
        try {
            setInterval(UpdateStats, 86400000);
        }
        catch (err) {
            PinguLibrary.errorLog(client, "Updating Stats failed", null, err);
        }
        function internalSetActivity() {
            var date = {
                day: new Date(Date.now()).getDate(),
                month: new Date(Date.now()).getMonth() + 1,
                year: new Date(Date.now()).getFullYear()
            };
            var activity = new Activity('your screams for', 'LISTENING');
            if (date.month == 12)
                activity = date.day < 26 ?
                    new Activity('Jingle Bells...', 'LISTENING') :
                    new Activity('fireworks go boom', 'WATCHING');
            else if (date.month == 5)
                activity =
                    date.day == 3 ? new Activity("Danho's birthday wishes", 'LISTENING') :
                        date.day == 4 ? new Activity('Star Wars', 'WATCHING') : null;
            if (!activity)
                activity = new Activity('your screams for', 'LISTENING');
            client.user.setActivity(activity.text + ' *help', { type: activity.type });
            PinguLibrary.raspberryLog(client);
        }
        function UpdateStats() {
            var getChannel = function (client, channelID) { return PinguLibrary.SavedServers.PinguSupport(client).channels.cache.get(channelID); };
            var channels = [
                getChannel(client, '799596588859129887'),
                getChannel(client, '799597092107583528'),
                getChannel(client, '799597689792757771'),
                getChannel(client, '799598372217683978'),
                getChannel(client, '799598024971518002'),
                getChannel(client, '799598765187137537') //Most known member
            ];
            var setName = function (channel) {
                var getInfo = function (channel) {
                    switch (channel.id) {
                        case '799596588859129887': return getServersInfo(); //Servers
                        case '799597092107583528': return getUsersInfo(); //Users
                        case '799597689792757771': return getDailyLeader(); //Daily Leader
                        case '799598372217683978': return getRandomServer(); //Server of the Day
                        case '799598024971518002': return getRandomUser(); //User of the Day
                        case '799598765187137537': return getMostKnownUser(); //Most known User
                        default:
                            PinguLibrary.errorLog(client, "ID of " + channel.name + " was not recognized!");
                            return "No Info";
                    }
                    function getServersInfo() {
                        return client.guilds.cache.size.toString();
                    }
                    function getUsersInfo() {
                        return client.users.cache.size.toString();
                    }
                    function getDailyLeader() {
                        try {
                            var pUser = PinguUser.GetPUsers().sort(function (a, b) {
                                try {
                                    return b.daily.streak - a.daily.streak;
                                }
                                catch (err) {
                                    PinguLibrary.errorLog(client, "Unable to get daily streak difference between " + a.tag + " and " + b.tag, null, err);
                                }
                            })[0];
                            return pUser.tag + " #" + pUser.daily.streak;
                        }
                        catch (err) {
                            PinguLibrary.errorLog(client, "Unable to get Daily Leader", null, err);
                        }
                    }
                    function getRandomServer() {
                        var availableGuilds = client.guilds.cache.array().map(function (g) { return ![
                            PinguLibrary.SavedServers.DanhoMisc(client).id,
                            PinguLibrary.SavedServers.PinguEmotes(client).id,
                            PinguLibrary.SavedServers.PinguSupport(client).id,
                        ].includes(g.id) && g.name != undefined && g; }).filter(function (v) { return v; });
                        var index = Math.floor(Math.random() * availableGuilds.length);
                        return availableGuilds[index].name;
                    }
                    function getRandomUser() {
                        var availableUsers = client.users.cache.array().map(function (u) { return !u.bot && u; }).filter(function (v) { return v; });
                        return availableUsers[Math.floor(Math.random() * availableUsers.length)].tag;
                    }
                    function getMostKnownUser() {
                        var Users = new discord_js_1.Collection();
                        client.guilds.cache.forEach(function (guild) {
                            guild.members.cache.forEach(function (gm) {
                                var user = gm.user;
                                if (user.bot)
                                    return;
                                if (!Users.has(user))
                                    return Users.set(user, 1);
                                var userServers = Users.get(user) + 1;
                                Users.delete(user);
                                Users.set(user, userServers);
                            });
                        });
                        var sorted = Users.sort(function (a, b) { return b - a; });
                        var strings = sorted.filter(function (v, u) { return sorted.first() == v; }).map(function (v, u) { return u.tag + " | #" + v; });
                        return strings[Math.floor(Math.random() * strings.length)];
                    }
                };
                var channelName = channel.name.split(':')[0];
                var info = getInfo(channel);
                var newName = channelName + ": " + info;
                if (channel.name == newName)
                    return;
                return channel.setName(newName);
            };
            for (var _i = 0, channels_1 = channels; _i < channels_1.length; _i++) {
                var channel = channels_1[_i];
                setName(channel);
            }
        }
    };
    Object.defineProperty(PinguLibrary, "DefaultPrefix", {
        get: function () {
            var Prefix = require('./config.json').Prefix;
            return Prefix;
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    //#region Permissions
    PinguLibrary.PermissionCheck = function (check, permissions) {
        var testingMode = require('./config.json').testingMode;
        if (permissions[0].length == 1) {
            this.errorLog(check.client, "Permissions not defined correctly!", check.content);
            return "Permissions for this script was not defined correctly!";
        }
        for (var x = 0; x < permissions.length; x++) {
            var permString = permissions[x].toLowerCase().replace('_', ' ');
            if (!checkPermisson(check.channel, check.client.user, permissions[x]))
                return "I don't have permission to **" + permString + "** in " + check.channel.name + ".";
            else if (!checkPermisson(check.channel, check.author, permissions[x]) &&
                (this.isPinguDev(check.author) && testingMode || !this.isPinguDev(check.author)))
                return "<@" + check.author.id + "> you don't have permission to **" + permString + "** in #" + check.channel.name + ".";
        }
        return this.PermissionGranted;
        function checkPermisson(channel, user, permission) {
            return channel.permissionsFor(user).has(permission);
        }
    };
    Object.defineProperty(PinguLibrary, "Permissions", {
        get: function () {
            //let all = Array.from(getPermissions()).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
            var givenStrings = [
                DiscordPermissions.MANAGE_ROLES,
                DiscordPermissions.MANAGE_CHANNELS,
                DiscordPermissions.CHANGE_NICKNAME,
                DiscordPermissions.VIEW_CHANNEL,
                DiscordPermissions.SEND_MESSAGES,
                DiscordPermissions.SEND_TTS_MESSAGES,
                DiscordPermissions.MANAGE_MESSAGES,
                DiscordPermissions.EMBED_LINKS,
                DiscordPermissions.ATTACH_FILES,
                DiscordPermissions.MANAGE_EMOJIS,
                DiscordPermissions.READ_MESSAGE_HISTORY,
                DiscordPermissions.USE_EXTERNAL_EMOJIS,
                DiscordPermissions.ADD_REACTIONS,
                DiscordPermissions.CONNECT,
                DiscordPermissions.SPEAK,
                DiscordPermissions.USE_VAD,
                DiscordPermissions.VIEW_AUDIT_LOG
            ];
            var given = [], missing = [], all = [];
            for (var _i = 0, _a = Array.from(getPermissions()); _i < _a.length; _i++) {
                var perm = _a[_i];
                var permObj = new BitPermission(perm[0], perm[1]);
                if (givenStrings.includes(perm[0]))
                    given.push(permObj);
                else
                    missing.push(permObj);
                all.push(permObj);
            }
            return { given: given, missing: missing, all: all };
            function getPermissions() {
                var temp = new Map();
                var bits = getBitValues();
                for (var prop in DiscordPermissions) {
                    if (prop == 'bitOf')
                        continue;
                    temp.set(prop, bits.find(function (bits) { return bits.permString == prop; }).bit);
                }
                return temp;
            }
            function getBitValues() {
                var permissions = Object.keys(DiscordPermissions)
                    .map(function (permString) { return new BitPermission(permString, 0); })
                    .filter(function (perm) { return perm.permString != 'bitOf'; });
                for (var i = 0; i < permissions.length; i++)
                    permissions[i].bit = i == 0 ? 1 : permissions[i - 1].bit * 2;
                return permissions;
            }
        },
        enumerable: false,
        configurable: true
    });
    PinguLibrary.getServer = function (client, id) {
        return client.guilds.cache.find(function (g) { return g.id == id; });
    };
    PinguLibrary.getSharedServers = function (client, user) {
        var servers = [];
        client.guilds.cache.forEach(function (g) { return g.members.cache.forEach(function (gm) {
            if (gm.user.id == user.id)
                servers.push(g);
        }); });
        return servers;
    };
    PinguLibrary.isPinguDev = function (user) {
        //console.log(`[${this.PinguDevelopers.join(', ')}].includes(${user.id})`);
        return this.PinguDevelopers.includes(user.id);
    };
    //#endregion
    //#region Channels
    PinguLibrary.getChannel = function (client, guildID, channelname) {
        var guild = client.guilds.cache.find(function (guild) { return guild.id == guildID; });
        if (!guild) {
            console.error("Unable to get guild from " + guildID);
            return null;
        }
        var channel = guild.channels.cache.find(function (channel) { return channel.name == channelname; });
        if (!channel) {
            console.error("Unable to get channel from " + channelname);
            return null;
        }
        return channel;
    };
    PinguLibrary.outages = function (client, message) {
        return __awaiter(this, void 0, void 0, function () {
            var outageChannel, sent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        outageChannel = this.getChannel(client, '756383096646926376', 'outages');
                        if (!outageChannel)
                            return [2 /*return*/, this.DanhoDM(client, "Couldn't get #outage channel in Pingu Support, https://discord.gg/Mp4CH8eftv")];
                        this.consoleLog(client, message);
                        return [4 /*yield*/, outageChannel.send(message)];
                    case 1:
                        sent = _a.sent();
                        return [2 /*return*/, sent.crosspost()];
                }
            });
        });
    };
    PinguLibrary.DanhoDM = function (client, message) {
        return __awaiter(this, void 0, void 0, function () {
            var DanhoMisc, DanhoDM;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.error(message);
                        DanhoMisc = this.SavedServers.DanhoMisc(client);
                        if (!DanhoMisc) {
                            console.error('Unable to find Danho Misc guild!', client.guilds.cache.array().forEach(function (g) { return console.log("[" + g.id + "] " + g.name); }));
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, DanhoMisc.owner.createDM()];
                    case 1:
                        DanhoDM = _a.sent();
                        return [2 /*return*/, DanhoDM.send(message)];
                }
            });
        });
    };
    //#endregion
    //#region Log Channels
    PinguLibrary.errorLog = function (client, message, messageContent, err) {
        var errorlogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'error-log');
        if (!errorlogChannel)
            return this.DanhoDM(client, 'Unable to find #error-log in Pingu Support');
        console.error(getErrorMessage(message.includes('`') ? message.replace('`', ' ') : message, messageContent, err));
        return errorlogChannel.send(getErrorMessage(message, messageContent, err));
        function getErrorMessage(message, messageContent, err) {
            var result = {
                format: "```\n",
                providedMessage: "[Provided Message]\n" + message + "\n\n",
                errorMessage: "[Error message]: \n" + (err && err.message) + "\n\n",
                messageContent: "[Message content]\n" + messageContent + "\n\n",
                stack: "[Stack]\n" + (err && err.stack) + "\n\n\n",
                fileMessage: (err && err.fileName) + " threw an error at line " + (err && err.lineNumber) + "!\n\n"
            };
            var returnMessage = (result.format +
                (err && err.fileName && err.lineNumber ? result.fileMessage : "") +
                result.providedMessage +
                (messageContent ? result.messageContent : "") +
                (err ? result.errorMessage + result.stack : "") +
                result.format);
            PinguLibrary.consoleLog(client, returnMessage);
            return returnMessage;
        }
    };
    PinguLibrary.pGuildLog = function (client, script, message, err) {
        return __awaiter(this, void 0, void 0, function () {
            var pinguGuildLog, errorLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pinguGuildLog = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "pingu-guild-log");
                        if (!err) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.errorLog(client, "pGuild Error: \"" + message + "\"", null, err)];
                    case 1:
                        errorLink = (_a.sent()).url;
                        return [2 /*return*/, pinguGuildLog.send("[**Failed**] [**" + script + "**]: " + message + "\n" + err.message + "\n\n" + errorLink + "\n\n<@&756383446871310399>")];
                    case 2: return [2 /*return*/, pinguGuildLog.send("[**Success**] [**" + script + "**]: " + message)];
                }
            });
        });
    };
    PinguLibrary.pUserLog = function (client, script, message, err) {
        return __awaiter(this, void 0, void 0, function () {
            var pinguUserLog, errorLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pinguUserLog = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "pingu-user-log");
                        if (!err) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.errorLog(client, "pUser Error (**" + script + "**): \"" + message + "\"", null, err)];
                    case 1:
                        errorLink = (_a.sent()).url;
                        return [2 /*return*/, pinguUserLog.send("[**Failed**] [**" + script + "**]: " + message + "\n" + err.message + "\n\n" + errorLink + "\n\n<@&756383446871310399>")];
                    case 2: return [2 /*return*/, pinguUserLog.send("[**Success**] [**" + script + "**]: " + message)];
                }
            });
        });
    };
    PinguLibrary.consoleLog = function (client, message) {
        var timeFormat = "[" + new Date(Date.now()).toLocaleTimeString() + "]";
        console.log(timeFormat + " " + message);
        var consoleLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "console-log");
        if (!consoleLogChannel)
            return this.DanhoDM(client, 'Unable to find #console-log in Pingu Support');
        consoleLogChannel.send(message);
    };
    PinguLibrary.eventLog = function (client, content) {
        return __awaiter(this, void 0, void 0, function () {
            var eventLogChannel, lastCache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (client.user.id == PinguLibrary.Clients.BetaID)
                            return [2 /*return*/];
                        eventLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "event-log");
                        if (!eventLogChannel)
                            return [2 /*return*/, this.DanhoDM(client, "Couldn't get #event-log channel in Pingu Support, https://discord.gg/gbxRV4Ekvh")];
                        if (!PinguEvents.LoggedCache)
                            PinguEvents.LoggedCache = new Array();
                        lastCache = PinguEvents.LoggedCache[0];
                        if (lastCache && (lastCache.description && lastCache.description == content.description ||
                            lastCache.fields[0] && content.fields[0] && lastCache.fields[0].value == content.fields[0].value))
                            return [2 /*return*/];
                        PinguEvents.LoggedCache.unshift(content);
                        return [4 /*yield*/, eventLogChannel.send(content)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PinguLibrary.tellLog = function (client, sender, reciever, message) {
        if (client.user.id == PinguLibrary.Clients.BetaID)
            return;
        var tellLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'tell-log');
        if (!tellLogChannel)
            return this.DanhoDM(client, "Couldn't get #tell-log channel in Pingu Support, https://discord.gg/gbxRV4Ekvh");
        if (message.constructor.name == "Message") {
            var messageAsMessage = message;
            var consoleLog = messageAsMessage.content ?
                sender.username + " sent a message to " + reciever.username + " saying " :
                messageAsMessage.attachments.array().length == 1 ?
                    sender.username + " sent a file to " + reciever.username :
                    messageAsMessage.attachments.array().length > 1 ?
                        sender.username + " sent " + messageAsMessage.attachments.array().length + " files to " + reciever.username :
                        sender.username + " sent something unknown to " + reciever.username + "!";
            if (messageAsMessage.content)
                consoleLog += messageAsMessage.content;
            if (messageAsMessage.attachments)
                consoleLog += messageAsMessage.attachments.map(function (a) { return "\n" + a.url; });
            PinguLibrary.consoleLog(client, consoleLog);
            var format = function (ping) { return new Date(Date.now()).toLocaleTimeString() + " [<@" + (ping ? sender : sender.username) + "> \u27A1\uFE0F <@" + (ping ? reciever : reciever.username) + ">]"; };
            if (messageAsMessage.content && messageAsMessage.attachments)
                tellLogChannel.send(format(false) + (": ||" + messageAsMessage.content + "||"), messageAsMessage.attachments.array())
                    .then(function (sent) { return sent.edit(format(true) + (": ||" + messageAsMessage.content + "||")); });
            else if (messageAsMessage.content)
                tellLogChannel.send(format(false) + (": ||" + messageAsMessage.content + "||"))
                    .then(function (sent) { return sent.edit(format(true) + (": ||" + messageAsMessage.content + "||")); });
            else if (messageAsMessage.attachments)
                tellLogChannel.send(format(false), messageAsMessage.attachments.array())
                    .then(function (sent) { return sent.edit(format(true)); });
            else
                this.errorLog(client, sender + " \u27A1\uFE0F " + reciever + " sent something that didn't have content or attachments")
                    .then(function () { return tellLogChannel.send("Ran else statement - reported to " + tellLogChannel.guild.channels.cache.find(function (c) { return c.name == 'error-log'; })); });
        }
        else if (message.constructor.name == "MessageEmbed") {
            this.consoleLog(client, "The link between " + sender.username + " & " + reciever.username + " was unset.");
            tellLogChannel.send(message);
        }
    };
    PinguLibrary.LatencyCheck = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var pingChannel, pingChannelSent, latency, outages, outagesMessages, outageMessagesCount, i, lastPinguMessage, sendMessage, lastMessageArgs, lastLatencyExclaim, lastLatency;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pingChannel = this.getChannel(message.client, this.SavedServers.PinguSupport(message.client).id, "ping-log");
                        if (message.channel == pingChannel || message.author.bot)
                            return [2 /*return*/];
                        return [4 /*yield*/, pingChannel.send("Calculating ping")];
                    case 1:
                        pingChannelSent = _a.sent();
                        latency = pingChannelSent.createdTimestamp - message.createdTimestamp;
                        pingChannelSent.edit(latency);
                        outages = this.getChannel(message.client, this.SavedServers.PinguSupport(message.client).id, "outages");
                        if (!outages)
                            return [2 /*return*/, this.errorLog(message.client, "Unable to find outages channel from LatencyCheck!")];
                        outagesMessages = outages.messages.cache.array();
                        outageMessagesCount = outagesMessages.length - 1;
                        //Find Pingu message
                        for (i = outageMessagesCount - 1; i >= 0; i--) {
                            if (outagesMessages[i].author != message.client.user)
                                continue;
                            lastPinguMessage = outagesMessages[i];
                        }
                        if (!lastPinguMessage)
                            return [2 /*return*/];
                        sendMessage = !lastPinguMessage.content.includes("I have a latency delay on");
                        if (!sendMessage) {
                            lastMessageArgs = lastPinguMessage.content.split(" ");
                            lastLatencyExclaim = lastMessageArgs[lastMessageArgs.length - 1];
                            lastLatency = parseInt(lastLatencyExclaim.substring(0, lastLatencyExclaim.length - 1));
                            if (lastLatency > 1000)
                                return [2 /*return*/, lastPinguMessage.edit("I have a latency delay on " + latency + "!")];
                        }
                        if (latency > 1000)
                            PinguLibrary.outages(message.client, "I have a latency delay on " + latency + "!");
                        return [2 /*return*/];
                }
            });
        });
    };
    PinguLibrary.raspberryLog = function (client) {
        if (client.user.id == PinguLibrary.Clients.BetaID)
            return;
        var activityLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'raspberry-log');
        if (!activityLogChannel)
            return this.DanhoDM(client, "Couldn't get #raspberry-log channel in Pingu Support, https://discord.gg/gbxRV4Ekvh");
        var version = require('./config.json').version;
        return activityLogChannel.send("Pulled from Repository - Now running version " + version);
    };
    //#endregion
    PinguLibrary.getEmote = function (client, name, emoteGuild) {
        if (!client || !name || !emoteGuild)
            return '😵';
        var emote = client.guilds.cache.find(function (g) { return g.id == emoteGuild.id; }).emojis.cache.find(function (e) { return e.name == name; });
        if (emote)
            return emote;
        PinguLibrary.errorLog(client, "Unable to find Emote **" + name + "** from " + emoteGuild.name);
        return '😵';
    };
    PinguLibrary.getImage = function (script, imageName) {
        return "./embedImages/" + script + "_" + imageName + ".png";
    };
    PinguLibrary.DefaultEmbedColor = 3447003;
    PinguLibrary.Clients = {
        PinguID: '562176550674366464',
        BetaID: '778288722055659520'
    };
    PinguLibrary.PermissionGranted = "Permission Granted";
    //#endregion
    //#region Servers
    PinguLibrary.SavedServers = {
        DanhoMisc: function (client) {
            return PinguLibrary.getServer(client, '460926327269359626');
        },
        PinguSupport: function (client) {
            return PinguLibrary.getServer(client, '756383096646926376');
        },
        PinguEmotes: function (client) {
            return PinguLibrary.getServer(client, '791312245555855401');
        },
        DeadlyNinja: function (client) {
            return PinguLibrary.getServer(client, '405763731079823380');
        }
    };
    //#endregion
    //#region Pingu Developers
    PinguLibrary.PinguDevelopers = [
        '245572699894710272',
        '405331883157880846',
        '795937270569631754',
        '803903863706484756' //Slothman
    ];
    return PinguLibrary;
}());
exports.PinguLibrary = PinguLibrary;
var PinguEvents = /** @class */ (function () {
    function PinguEvents() {
    }
    PinguEvents.GetAuditLogs = function (guild, type, key, target, seconds) {
        if (target === void 0) { target = null; }
        if (seconds === void 0) { seconds = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var now, logs, filteredLogs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!guild.me.hasPermission(DiscordPermissions.VIEW_AUDIT_LOG))
                            return [2 /*return*/, this.noAuditLog];
                        now = new Date(Date.now());
                        return [4 /*yield*/, guild.fetchAuditLogs({ type: type })];
                    case 1:
                        logs = (_a.sent());
                        now.setSeconds(now.getSeconds() - seconds);
                        filteredLogs = logs.entries.filter(function (e) { return e.createdTimestamp > now.getTime(); });
                        try {
                            return [2 /*return*/, key ? filteredLogs.find(function (e) { return e.changes.find(function (change) { return change.key == key; }) && (target ? e.target == target : true); }).executor.tag : filteredLogs.first().executor.tag];
                        }
                        catch (err) {
                            if (err.message == "Cannot read property 'executor' of undefined")
                                return [2 /*return*/, this.noAuditLog];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PinguEvents.UnknownUpdate = function (old, current) {
        var oldArr = Object.keys(old);
        var currentArr = Object.keys(current);
        for (var i = 0; i < currentArr.length || i < oldArr.length; i++) {
            if (currentArr[i] != oldArr[i])
                return PinguEvents.SetDescriptionValues('Unknown', oldArr[i], currentArr[i]);
        }
        return null;
    };
    PinguEvents.SetDescription = function (type, description) {
        return "[**" + type + "**]\n\n" + description;
    };
    PinguEvents.SetRemove = function (type, oldValue, newValue, SetString, RemoveString, descriptionMethod) {
        return newValue && !oldValue ? PinguEvents.SetDescription(type, SetString) :
            !newValue && oldValue ? PinguEvents.SetDescription(type, RemoveString) : descriptionMethod(type, oldValue, newValue);
    };
    PinguEvents.SetDescriptionValues = function (type, oldValue, newValue) {
        return PinguEvents.SetDescription(type, "Old: " + oldValue + "\n\nNew: " + newValue);
    };
    PinguEvents.SetDescriptionValuesLink = function (type, oldValue, newValue) {
        return PinguEvents.SetDescription(type, "[Old](" + oldValue + ")\n[New](" + newValue + ")");
    };
    PinguEvents.GoThroughArrays = function (type, preArr, newArr, callback) {
        var updateMessage = "[**" + type + "**] ";
        var removed = [], added = [];
        for (var _i = 0, newArr_1 = newArr; _i < newArr_1.length; _i++) {
            var newItem = newArr_1[_i];
            var old = preArr.find(function (i) { return callback(i, newItem); });
            if (!old)
                added.push(newItem);
        }
        for (var _a = 0, preArr_1 = preArr; _a < preArr_1.length; _a++) {
            var oldItem = preArr_1[_a];
            var add = newArr.find(function (i) { return callback(i, newItem); });
            if (!add)
                removed.push(oldItem);
        }
        if (added.length == 0 && removed.length != 0)
            return updateMessage += removed.join(", ").substring(removed.join(', ').length - 2);
        else if (removed.length == 0 && added.length != 0)
            return updateMessage += added.join(", ").substring(added.join(', ').length - 2);
        return updateMessage += "Unable to find out what changed!";
    };
    PinguEvents.Colors = {
        Create: "#18f151",
        Update: "#ddfa00",
        Delete: "#db1108"
    };
    PinguEvents.noAuditLog = "**No Audit Log Permissions**";
    return PinguEvents;
}());
exports.PinguEvents = PinguEvents;
//#endregion
var Decidable = /** @class */ (function () {
    function Decidable(value, id, author, channel) {
        this.value = value;
        this.id = id;
        this.author = author;
        this.channel = new PChannel(channel);
    }
    return Decidable;
}());
//#region extends Decideables
var Poll = /** @class */ (function (_super) {
    __extends(Poll, _super);
    function Poll() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Poll.prototype.Decide = function (yesVotes, noVotes) {
        this.YesVotes = yesVotes;
        this.NoVotes = noVotes;
        this.approved =
            this.YesVotes > this.NoVotes ? 'Yes' :
                this.NoVotes > this.YesVotes ? 'No' : 'Undecided';
    };
    return Poll;
}(Decidable));
exports.Poll = Poll;
var Giveaway = /** @class */ (function (_super) {
    __extends(Giveaway, _super);
    function Giveaway(value, id, author, channel) {
        var _this = _super.call(this, value, id, author, channel) || this;
        _this.winners = new Array();
        return _this;
    }
    return Giveaway;
}(Decidable));
exports.Giveaway = Giveaway;
var Suggestion = /** @class */ (function (_super) {
    __extends(Suggestion, _super);
    function Suggestion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Suggestion.prototype.Decide = function (approved, decidedBy) {
        this.approved = approved;
        this.decidedBy = decidedBy;
    };
    return Suggestion;
}(Decidable));
exports.Suggestion = Suggestion;
var PollConfig = /** @class */ (function () {
    function PollConfig(options) {
        this.pollRole = options ? options.pollRole : undefined;
        this.channel = options ? options.channel : undefined;
        if (options)
            this.polls = options.polls;
    }
    return PollConfig;
}());
exports.PollConfig = PollConfig;
var GiveawayConfig = /** @class */ (function () {
    function GiveawayConfig(options) {
        this.allowSameWinner = options ? options.allowSameWinner : undefined;
        this.hostRole = options ? options.hostRole : undefined;
        this.winnerRole = options ? options.winnerRole : undefined;
        this.channel = options ? options.channel : undefined;
        if (options)
            this.giveaways = options.giveaways;
    }
    return GiveawayConfig;
}());
exports.GiveawayConfig = GiveawayConfig;
var TimeLeftObject = /** @class */ (function () {
    function TimeLeftObject(Now, EndsAt) {
        /*
        console.clear();
        console.log(`EndsAt: ${EndsAt.getDate()}d ${EndsAt.getHours()}h ${EndsAt.getMinutes()}m ${EndsAt.getSeconds()}s`)
        console.log(`Now: ${Now.getDate()}d ${Now.getHours()}h ${Now.getMinutes()}m ${Now.getSeconds()}s`)
        console.log(`this.days = Math.round(${EndsAt.getDate()} - ${Now.getDate()})`)
        console.log(`this.hours = Math.round(${EndsAt.getHours()} - ${Now.getHours()})`)
        console.log(`this.minutes = Math.round(${EndsAt.getMinutes()} - ${Now.getMinutes()})`)
        console.log(`this.seconds = Math.round(${EndsAt.getSeconds()} - ${Now.getSeconds()})`)
        */
        this.endsAt = EndsAt;
        var Minutes = this.includesMinus(Math.round(EndsAt.getSeconds() - Now.getSeconds()), 60, EndsAt.getMinutes(), Now.getMinutes());
        var Hours = this.includesMinus(Minutes[0], 60, EndsAt.getHours(), Now.getHours());
        var Days = this.includesMinus(Hours[0], 24, EndsAt.getDate(), Now.getDate());
        this.seconds = Minutes[1];
        this.minutes = Hours[1];
        this.hours = Days[1];
        this.days = Days[0];
    }
    /**Minus check, cus sometimes preprop goes to minus, while preprop isn't being subtracted
     * @param preprop Previous property, for this.minutes, this would be this.seconds
     * @param maxPreProp Max number preprop can be, everything is 60 but this.hours is 24
     * @param EndsAt EndsAt variable
     * @param Now Now variable*/
    TimeLeftObject.prototype.includesMinus = function (preprop, maxPreProp, EndsAt, Now) {
        var returnValue = Math.round(EndsAt - Now);
        if (preprop.toString().includes('-')) {
            preprop = maxPreProp + preprop;
            return [returnValue - 1, preprop];
        }
        return [returnValue, preprop];
    };
    TimeLeftObject.prototype.toString = function () {
        //console.log(`${this.days}d ${this.hours}h ${this.minutes}m ${this.seconds}s`);
        var returnMsg = '';
        var times = [this.days, this.hours, this.minutes, this.seconds], timeMsg = ["day", "hour", "minute", "second"];
        for (var i = 0; i < times.length; i++)
            if (times[i] > 0) {
                returnMsg += "**" + times[i] + "** " + timeMsg[i];
                if (times[i] != 1)
                    returnMsg += 's';
                returnMsg += ", ";
            }
        return returnMsg.substring(0, returnMsg.length - 2);
    };
    return TimeLeftObject;
}());
exports.TimeLeftObject = TimeLeftObject;
var Queue = /** @class */ (function () {
    function Queue(client, logChannel, voiceChannel, songs, playing) {
        if (playing === void 0) { playing = true; }
        this.logChannel = logChannel;
        this.voiceChannel = voiceChannel;
        this.songs = songs;
        this.volume = 1;
        this.connection = null;
        this.playing = playing;
        this.client = client;
        this.loop = false;
        this.index = 0;
    }
    Object.defineProperty(Queue.prototype, "currentSong", {
        get: function () {
            return this.songs[this.index];
        },
        enumerable: false,
        configurable: true
    });
    /** Adds song to the start of the queue
     * @param song song to add*/
    Queue.prototype.addFirst = function (song) {
        song.id = this.songs.length;
        this.songs.unshift(song);
    };
    /** Adds song to queue
     * @param song song to add*/
    Queue.prototype.add = function () {
        var _this = this;
        var songs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            songs[_i] = arguments[_i];
        }
        songs.forEach(function (song) {
            song.id = _this.songs.length;
            _this.songs.push(song);
        });
    };
    /** Removes song from queue
     * @param song song to remove*/
    Queue.prototype.remove = function (song) {
        this.songs = this.songs.filter(function (s) { return s != song; });
    };
    Queue.prototype.move = function (posA, posB) {
        var songToMove = this.songs[posA - 1];
        this.songs.unshift(null);
        for (var i = 1; i < this.songs.length; i++) {
            if (i == posB) {
                this.songs[i - 1] = songToMove;
                break;
            }
            else if (i == posA + 1)
                continue;
            else
                this.songs[i - 1] = this.songs[i];
        }
        this.songs.splice(this.songs.length - 1);
        return this;
    };
    Queue.prototype.includes = function (title) {
        var song = this.songs.find(function (s) { return s.title.includes(title); });
        return song != null;
    };
    Queue.prototype.find = function (title) {
        return this.songs.find(function (s) { return s.title.includes(title); });
    };
    return Queue;
}());
exports.Queue = Queue;
var Song = /** @class */ (function () {
    function Song(author, songInfo) {
        //YouTube
        this.link = songInfo.video_url;
        this.title = songInfo.title;
        this.author = songInfo.author && songInfo.author.name;
        this.length = this.GetLength(songInfo.lengthSeconds);
        this.lengthMS = parseInt(songInfo.lengthSeconds) * 1000;
        this.thumbnail = songInfo.thumbnails[0].url;
        this.requestedBy = new PUser(author);
        this.id = 0;
        this.volume = -1;
        this.loop = false;
        this.endsAt = null;
    }
    Song.prototype.play = function () {
        this.endsAt = new Date(Date.now() + this.lengthMS);
    };
    Song.prototype.stop = function () {
        this.endsAt = null;
    };
    Song.prototype.getTimeLeft = function () {
        return new TimeLeftObject(new Date(Date.now()), this.endsAt);
    };
    Song.prototype.GetLength = function (secondsLength) {
        var seconds = parseInt(secondsLength), minutes = 0, hours = 0, final = [];
        if (seconds > 59) {
            while (seconds > 59) {
                seconds -= 60;
                minutes++;
            }
        }
        if (minutes > 59) {
            while (minutes > 59) {
                minutes -= 60;
                hours++;
            }
        }
        final.push(hours, minutes, seconds);
        return final.map(function (i) { return i < 10 ? "0" + i : i; }).join('.');
    };
    return Song;
}());
exports.Song = Song;
//#endregion
var Daily = /** @class */ (function () {
    function Daily() {
        this.lastClaim = null;
        this.nextClaim = null;
        this.streak = 0;
    }
    return Daily;
}());
exports.Daily = Daily;
var ReactionRole = /** @class */ (function () {
    function ReactionRole(message, reactionName, role) {
        this.emoteName = reactionName;
        this.pRole = new PRole(role);
        this.channel = new PChannel(message.channel);
        this.messageID = message.id;
    }
    ReactionRole.GetReactionRole = function (client, reaction, user) {
        var guild = reaction.message.guild;
        var pGuild = PinguGuild.GetPGuild(guild);
        var rr = pGuild.reactionRoles.find(function (rr) {
            return rr.messageID == reaction.message.id &&
                (rr.emoteName == reaction.emoji.name) &&
                rr.channel.id == reaction.message.channel.id;
        });
        if (!rr)
            return null;
        var pRole = rr.pRole;
        var member = guild.member(user);
        var permCheck = PinguLibrary.PermissionCheck({
            author: client.user,
            client: client,
            channel: reaction.message.channel,
            content: "No content provided"
        }, [DiscordPermissions.MANAGE_ROLES]);
        if (permCheck != PinguLibrary.PermissionGranted) {
            guild.owner.send("I tried to give " + member.displayName + " the " + pRole.name + ", as " + permCheck);
            user.send("I'm unable to give you the reactionrole at the moment! I've contacted " + user.username + " about this.");
            return null;
        }
        return guild.roles.fetch(pRole.id);
    };
    return ReactionRole;
}());
exports.ReactionRole = ReactionRole;
var Marry = /** @class */ (function () {
    function Marry(partner, internalDate) {
        this.partner = partner;
        this.internalDate = new Date(internalDate);
    }
    Object.defineProperty(Marry.prototype, "marriedMessage", {
        get: function () {
            return "You have been " + (this.partner ? "married to <@" + this.partner.id + "> since" : "single since") + " **" + this.internalDate.toLocaleTimeString() + ", " + this.internalDate.toLocaleDateString().split('.').join('/') + "**";
        },
        enumerable: false,
        configurable: true
    });
    Marry.prototype.marry = function (partner) {
        this.internalDate = new Date(Date.now());
        this.partner = new PUser(partner);
    };
    Marry.prototype.divorce = function () {
        this.internalDate = new Date(Date.now());
        this.partner = null;
    };
    return Marry;
}());
exports.Marry = Marry;
//# sourceMappingURL=PinguPackage.js.map