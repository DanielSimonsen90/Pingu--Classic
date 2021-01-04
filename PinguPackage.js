"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
exports.Song = exports.Queue = exports.TimeLeftObject = exports.GiveawayConfig = exports.PollConfig = exports.Suggestion = exports.Giveaway = exports.Poll = exports.PinguLibrary = exports.PinguGuild = exports.PinguUser = exports.PQueue = exports.PUser = exports.PClient = exports.PEmote = exports.PChannel = exports.PRole = exports.PGuildMember = exports.DiscordPermissions = exports.Error = void 0;
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
//#region JSON Classes
var PGuildMember = /** @class */ (function () {
    function PGuildMember(member) {
        this.id = member.id;
        this.user = member.user.tag;
    }
    PGuildMember.prototype.toString = function () {
        return "<@" + this.id + ">";
    };
    return PGuildMember;
}());
exports.PGuildMember = PGuildMember;
var PRole = /** @class */ (function () {
    function PRole(role) {
        try {
            this.name = role.name;
            this.id = role.id;
        }
        catch (_a) {
            return undefined;
        }
    }
    return PRole;
}());
exports.PRole = PRole;
var PChannel = /** @class */ (function () {
    function PChannel(channel) {
        this.id = channel.id;
        this.name = channel.name;
    }
    return PChannel;
}());
exports.PChannel = PChannel;
var PEmote = /** @class */ (function () {
    function PEmote(emote) {
    }
    return PEmote;
}());
exports.PEmote = PEmote;
var PClient = /** @class */ (function () {
    function PClient(client, guild) {
        this.displayName = guild.me.displayName;
    }
    return PClient;
}());
exports.PClient = PClient;
var PUser = /** @class */ (function () {
    function PUser(user) {
        this.name = user.tag;
        this.id = user.id;
    }
    return PUser;
}());
exports.PUser = PUser;
var PQueue = /** @class */ (function () {
    function PQueue(queue) {
        this.logChannel = new PChannel(queue.logChannel);
        this.voiceChannel = new PChannel(queue.voiceChannel);
        this.connection = queue.connection.voice;
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
//#endregion
//#region Custom Pingu classes 
var PinguUser = /** @class */ (function () {
    //#endregion
    function PinguUser(user, client) {
        var pUser = new PUser(user);
        this.id = pUser.id;
        this.tag = pUser.name;
        this.sharedServers = getSharedServers();
        this.replyPerson = null;
        this.dailyStreak = 0;
        this.avatar = user.avatarURL();
        this.playlists = new Array();
        function getSharedServers() {
            var servers = [];
            client.guilds.cache.forEach(function (g) { return g.members.cache.forEach(function (gm) {
                if (gm.user.id == user.id)
                    servers.push(g.name);
            }); });
            var result = "[" + servers.length + "]: ";
            for (var i = 0; i < servers.length; i++) {
                if (i == 0)
                    result += servers[i];
                else
                    result += " \u2022 " + servers[i];
            }
            return result;
        }
    }
    //#region Static PinguUser methods
    PinguUser.GetPUsers = function () {
        return require('./users.json');
    };
    PinguUser.GetPUser = function (user) {
        var result = this.GetPUsers().find(function (pu) { return pu.id == user.id; });
        if (!result)
            PinguLibrary.errorLog(user.client, "Unable to find a user in pUsers with id " + user.id);
        return result;
    };
    PinguUser.UpdatePUsersJSON = function (client, script, succMsg, errMsg) {
        var _this = this;
        fs.writeFile('./users.json', '', function (err) {
            if (err)
                PinguLibrary.pUserLog(client, script, "[writeFile]: " + errMsg, new Error(err));
            else
                fs.appendFile('./users.json', JSON.stringify(_this.GetPUsers(), null, 4), function (err) {
                    if (err)
                        PinguLibrary.pUserLog(client, script, "[appendFile]: " + errMsg, new Error(err));
                    else
                        PinguLibrary.pUserLog(client, script, succMsg);
                });
        });
    };
    PinguUser.UpdatePUsersJSONAsync = function (client, script, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.UpdatePUsersJSON(client, script, succMsg, errMsg)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PinguUser.WritePUser = function (user, client, callback) {
        var _this = this;
        try {
            var pUser_1 = new PinguUser(user, client);
            fs.writeFile("./users/" + user.tag + ".json", JSON.stringify(pUser_1, null, 2), function (err) { return __awaiter(_this, void 0, void 0, function () {
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
            console.log(ewwor);
        }
    };
    PinguUser.DeletePUser = function (user, callback) {
        var _this = this;
        try {
            var pUser_2 = this.GetPUser(user);
            fs.unlink("./users/" + user.tag + ".json", function (err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                PinguLibrary.pUserLog(user.client, "DeletePGuild", "Unable to delete json file for " + PinguUser.GetPUser(user).tag, new Error(err));
                            return [4 /*yield*/, callback];
                        case 1:
                            if (_a.sent())
                                callback(pUser_2);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        catch (ewwor) {
            console.log(ewwor);
        }
    };
    return PinguUser;
}());
exports.PinguUser = PinguUser;
var PinguGuild = /** @class */ (function () {
    //#endregion
    function PinguGuild(guild) {
        this.guildName = guild.name;
        this.guildID = guild.id;
        this.guildOwner = new PGuildMember(guild.owner);
        var Prefix = require('./config.json').Prefix;
        this.botPrefix = Prefix;
        this.embedColor = guild.me.roles.cache.find(function (role) { return role.name.includes('Pingu'); }) && guild.me.roles.cache.find(function (role) { return role.name.includes('Pingu'); }).color || 0;
        this.musicQueue = null;
        this.giveawayConfig = new GiveawayConfig();
        this.pollConfig = new PollConfig;
        this.suggestions = new Array();
        if (guild.id == '405763731079823380')
            this.themeWinners = new Array();
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
    PinguGuild.GetPGuild = function (guild) {
        var result = this.GetPGuilds().find(function (pg) { return pg.guildID == guild.id; });
        if (!result)
            PinguLibrary.errorLog(guild.client, "Unable to find a guild in pGuilds with id " + guild.id);
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
            console.log(ewwor);
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
                                PinguLibrary.pGuildLog(guild.client, "DeletePGuild", "Unable to delete json file for " + pGuild_2.guildName, new Error(err));
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
            console.log(ewwor);
        }
    };
    return PinguGuild;
}());
exports.PinguGuild = PinguGuild;
var PinguLibrary = /** @class */ (function () {
    function PinguLibrary() {
    }
    PinguLibrary.setActivity = function (client) {
        var Activity = /** @class */ (function () {
            function Activity(text, type) {
                this.text = text;
                this.type = type;
            }
            return Activity;
        }());
        internalSetActivity();
        setInterval(internalSetActivity, 86400000);
        function internalSetActivity() {
            var date = {
                day: new Date(Date.now()).getDate(),
                month: new Date(Date.now()).getMonth() + 1,
                year: new Date(Date.now()).getFullYear()
            };
            var activity = new Activity('your screams for', 'LISTENING');
            //date.getMonth is 0-indexed
            if (date.month == 12)
                activity = date.day < 26 ?
                    new Activity('Jingle Bells...', 'LISTENING') :
                    new Activity('fireworks go boom', 'WATCHING');
            else if (date.month == 5 && date.day == 3)
                activity = new Activity("Danho's birthday wishes", 'LISTENING');
            client.user.setActivity(activity.text + ' *help', { type: activity.type })
                .then(function (presence) {
                var activity = presence.activities[presence.activities.length - 1];
                PinguLibrary.activityLog(client, activity.type + " " + activity.name);
            });
        }
    };
    PinguLibrary.PermissionCheck = function (message, permissions) {
        var textChannel = message.channel;
        var testingMode = require('./config.json').testingMode;
        if (permissions[0].length == 1) {
            this.errorLog(message.client, "Permissions not defined correctly!", message.content);
            return "Permissions for this script was not defined correctly!";
        }
        for (var x = 0; x < permissions.length; x++) {
            var permString = permissions[x].toLowerCase().replace('_', ' ');
            if (!textChannel.permissionsFor(message.client.user).has(permissions[x]))
                return "I don't have permission to **" + permString + "** in " + textChannel.name + ".";
            else if (!textChannel.permissionsFor(message.author).has(permissions[x]) &&
                (this.isPinguDev(message.author) && testingMode || !this.isPinguDev(message.author)))
                return "<@" + message.author.id + "> you don't have permission to **" + permString + "** in #" + textChannel.name + ".";
        }
        return this.PermissionGranted;
    };
    PinguLibrary.getServer = function (client, id) {
        return client.guilds.cache.find(function (g) { return g.id == id; });
    };
    PinguLibrary.isPinguDev = function (user) {
        //console.log(`[${this.PinguDevelopers.join(', ')}].includes(${user.id})`);
        return this.PinguDevelopers.includes(user.id);
    };
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
                        console.log(message);
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
    PinguLibrary.errorLog = function (client, message, userContent, err) {
        var errorlogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'error-log');
        if (!errorlogChannel)
            return this.DanhoDM(client, 'Unable to find #error-log in Pingu Support');
        console.error(getErrorMessage(message.includes('`') ? message.replace('`', ' ') : message, userContent, err));
        return errorlogChannel.send(getErrorMessage(message, userContent, err));
        function getErrorMessage(message, userContent, err) {
            if (!userContent)
                return message;
            else if (!err)
                return ("```\n" +
                    "[Provided Message]\n" +
                    (message + "\n") +
                    "\n" +
                    "[Message content]\n" +
                    (userContent + "\n") +
                    "```");
            var returnMessage = ("```" +
                err.fileName && err.lineNumber ? err.fileName + " threw an error at line " + err.lineNumber + "!\n" : " " +
                "[Provided Message]\n" +
                (message + "\n") +
                "\n" +
                "[Message content]\n" +
                (userContent + "\n") +
                "\n" +
                "[Error message]: \n" +
                (err.message + "\n") +
                "\n" +
                "[Stack]\n" +
                (err.stack + "\n\n") +
                "```");
            console.log(returnMessage);
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
    PinguLibrary.tellLog = function (client, sender, reciever, message) {
        var tellLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'tell-log');
        if (!tellLogChannel)
            return this.DanhoDM(client, "Couldn't get #tell-log channel in Pingu Support, https://discord.gg/Mp4CH8eftv");
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
            console.log(consoleLog);
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
                this.errorLog(client, sender + " => " + reciever + " sent something that didn't have content or attachments")
                    .then(function () { return tellLogChannel.send("Ran else statement - reported to " + tellLogChannel.guild.channels.cache.find(function (c) { return c.name == 'error-log'; })); });
        }
        else if (message.constructor.name == "MessageEmbed") {
            console.log("The link between " + sender.username + " & " + reciever.username + " was unset.");
            tellLogChannel.send(message);
        }
    };
    PinguLibrary.LatencyCheck = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var pingChannel, pingChannelSent, latency, outages, outagesMessages, outageMessagesCount, lastPinguMessage, i, sendMessage, lastMessageArgs, lastLatencyExclaim, lastLatency;
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
                        lastPinguMessage = null;
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
    PinguLibrary.activityLog = function (client, message) {
        var activityLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'activity-log');
        if (!activityLogChannel)
            return this.DanhoDM(client, "Couldn't get #activity-log channel in Pingu Support, https://discord.gg/Mp4CH8eftv");
        return activityLogChannel.send(message);
    };
    PinguLibrary.getEmote = function (client, name, emoteGuild) {
        for (var _i = 0, _a = client.guilds.cache.array(); _i < _a.length; _i++) {
            var guild = _a[_i];
            if (guild.name != emoteGuild.name)
                continue;
            var emote = guild.emojis.cache.find(function (emote) { return emote.name == name; });
            if (emote)
                return emote;
        }
        PinguLibrary.errorLog(client, "Unable to find Emote **" + name + "** from " + emoteGuild.name);
        return '😵';
    };
    PinguLibrary.PermissionGranted = "Permission Granted";
    PinguLibrary.SavedServers = {
        DanhoMisc: function (client) {
            return PinguLibrary.getServer(client, '460926327269359626');
        },
        PinguSupport: function (client) {
            return PinguLibrary.getServer(client, '756383096646926376');
        },
        PinguEmotes: function (client) {
            return PinguLibrary.getServer(client, '791312245555855401');
        }
    };
    PinguLibrary.PinguDevelopers = [
        '245572699894710272',
        '405331883157880846',
        '290131910091603968',
    ];
    return PinguLibrary;
}());
exports.PinguLibrary = PinguLibrary;
//#endregion
var Decidable = /** @class */ (function () {
    function Decidable(value, id, author, channel) {
        this.value = value;
        this.id = id;
        this.author = author;
        this.channel = channel;
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
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
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
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
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
//#endregion
//#region Music
var Queue = /** @class */ (function () {
    function Queue(client, logChannel, voiceChannel, songs, playing) {
        if (playing === void 0) { playing = true; }
        this.logChannel = logChannel;
        this.voiceChannel = voiceChannel;
        this.songs = songs;
        this.volume = .5;
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
        var songToMove = this.songs[posA];
        this.songs.unshift(null);
        for (var i = 1; i < this.songs.length; i++) {
            if (i == posB)
                this.songs[i - 1] = songToMove;
            else if (i == posA + 1)
                continue;
            else
                this.songs[i - 1] = this.songs[i];
        }
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
        this.requestedBy = new PUser(author);
        this.id = 0;
        this.loop = false;
        this.endsAt = null;
    }
    Song.prototype.play = function () {
        this.endsAt = new Date(Date.now() + this.lengthMS);
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
//# sourceMappingURL=PinguPackage.js.map