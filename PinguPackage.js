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
exports.Achievement = exports.Marry = exports.Daily = exports.ReactionRole = exports.Song = exports.Queue = exports.TimeLeftObject = exports.GiveawayConfig = exports.PollConfig = exports.Suggestion = exports.Giveaway = exports.Poll = exports.PinguEvents = exports.PinguLibrary = exports.PinguGuild = exports.PinguUser = exports.PMarry = exports.PQueue = exports.PClient = exports.PGuild = exports.PUser = exports.PChannel = exports.PRole = exports.PGuildMember = exports.PItem = exports.DiscordPermissions = exports.EmbedField = exports.Error = void 0;
var discord_js_1 = require("discord.js");
var mongoose = require("mongoose");
var PinguGuildSchema = require("./MongoSchemas/PinguGuild");
var PinguUserSchema = require("./MongoSchemas/PinguUser");
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
var EmbedField = /** @class */ (function () {
    function EmbedField(title, value, inline) {
        if (inline === void 0) { inline = false; }
        this.name = title;
        this.value = value;
        this.inline = inline;
    }
    return EmbedField;
}());
exports.EmbedField = EmbedField;
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
        this._id = object.id;
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
        this._id = client.user.id;
        this.displayName = guild.me.displayName;
        var clientIndex = guild.client.user.id == PinguLibrary.Clients.PinguID ? 0 : 1;
        var Prefix = require('./config.json').Prefix;
        this.embedColor = guild.me.roles.cache.find(function (role) { return role.managed; }).color || PinguLibrary.DefaultEmbedColor;
        this.prefix = clientIndex == 1 ? 'b' + Prefix : Prefix;
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
        this.loop = queue.loop;
        this.playing = queue.playing;
    }
    PQueue.ToQueue = function (guild, pQueue) {
        return __awaiter(this, void 0, void 0, function () {
            var queue, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        queue = new Queue(guild.channels.cache.find(function (c) { return c.id == pQueue.logChannel._id; }), guild.channels.cache.find(function (c) { return c.id == pQueue.voiceChannel._id; }), pQueue.songs, pQueue.playing);
                        _a = queue;
                        return [4 /*yield*/, queue.voiceChannel.join()];
                    case 1:
                        _a.connection = _b.sent();
                        queue.volume = pQueue.volume;
                        queue.loop = pQueue.loop;
                        queue.index = pQueue.index;
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
    function PinguUser(user) {
        var pUser = new PUser(user);
        this._id = pUser._id;
        this.tag = pUser.name;
        this.sharedServers = user.client.guilds.cache.filter(function (g) { return g.members.cache.has(user.id); }).map(function (g) { return new PGuild(g); });
        this.marry = new Marry();
        this.replyPerson = null;
        this.daily = new Daily();
        this.avatar = user.avatarURL();
        this.playlists = new Array();
    }
    PinguUser.WritePUser = function (client, user, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                PinguLibrary.DBExecute(client, function (mongoose) { return __awaiter(_this, void 0, void 0, function () {
                    var created;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, new PinguUserSchema(new PinguUser(user)).save()];
                            case 1:
                                created = _a.sent();
                                if (!created)
                                    PinguLibrary.pUserLog(client, scriptName, errMsg);
                                else
                                    PinguLibrary.pUserLog(client, scriptName, succMsg);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    PinguUser.GetPUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var pUserDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PinguUserSchema.findOne({ _id: user.id }).exec()];
                    case 1:
                        pUserDoc = _a.sent();
                        return [2 /*return*/, pUserDoc ? pUserDoc.toObject() : null];
                }
            });
        });
    };
    PinguUser.UpdatePUser = function (client, updatedProperty, pUser, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PinguUserSchema.updateOne({ _id: pUser._id }, updatedProperty, null, function (err) {
                            if (err)
                                PinguLibrary.pUserLog(client, scriptName, errMsg, err);
                            else
                                PinguLibrary.pUserLog(client, scriptName, succMsg);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PinguUser.DeletePUser = function (client, user, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PinguUserSchema.deleteOne({ _id: user.id }, null, function (err) {
                            if (err)
                                PinguLibrary.pUserLog(client, scriptName, errMsg, new Error(err));
                            else
                                PinguLibrary.pUserLog(client, scriptName, succMsg);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PinguUser.GetPUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PinguUserSchema.find({}).exec()];
                    case 1: return [2 /*return*/, (_a.sent()).map(function (collDoc) { return collDoc.toObject(); })];
                }
            });
        });
    };
    return PinguUser;
}());
exports.PinguUser = PinguUser;
var PinguGuild = /** @class */ (function (_super) {
    __extends(PinguGuild, _super);
    function PinguGuild(guild, owner) {
        var _this = _super.call(this, guild) || this;
        if (guild.owner)
            _this.guildOwner = new PGuildMember(guild.owner);
        else if (owner)
            _this.guildOwner = new PGuildMember(owner);
        else
            PinguLibrary.errorLog(guild.client, "Owner wasn't set when making Pingu Guild for \"" + guild.name + "\".");
        _this.clients = new Array();
        var clientIndex = guild.client.user.id == PinguLibrary.Clients.PinguID ? 0 : 1;
        if (clientIndex != 0)
            _this.clients.push(null);
        _this.clients[clientIndex] = new PClient(guild.client, guild);
        var welcomeChannel = guild.channels.cache.find(function (c) { return c.isText() && c.name.includes('welcome'); }) ||
            guild.channels.cache.find(function (c) { return c.isText() && c.name == 'general'; });
        if (welcomeChannel)
            _this.welcomeChannel = new PChannel(welcomeChannel);
        _this.reactionRoles = new Array();
        _this.giveawayConfig = new GiveawayConfig();
        _this.pollConfig = new PollConfig();
        _this.suggestions = new Array();
        if (guild.id == '405763731079823380')
            _this.themeWinners = new Array();
        return _this;
    }
    PinguGuild.WritePGuild = function (client, guild, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                PinguLibrary.DBExecute(client, function (mongoose) { return __awaiter(_this, void 0, void 0, function () {
                    var created, _a, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                _a = PinguGuildSchema.bind;
                                _b = PinguGuild.bind;
                                _c = [void 0, guild];
                                if (!!guild.owner) return [3 /*break*/, 2];
                                _f = (_e = guild).member;
                                return [4 /*yield*/, client.users.fetch(guild.ownerID)];
                            case 1:
                                _d = _f.apply(_e, [_g.sent()]);
                                return [3 /*break*/, 3];
                            case 2:
                                _d = null;
                                _g.label = 3;
                            case 3: return [4 /*yield*/, new (_a.apply(PinguGuildSchema, [void 0, new (_b.apply(PinguGuild, _c.concat([_d])))()]))()];
                            case 4:
                                created = _g.sent();
                                if (!created)
                                    return [2 /*return*/, PinguLibrary.pGuildLog(client, scriptName, errMsg)];
                                created.save();
                                return [2 /*return*/, PinguLibrary.pGuildLog(client, scriptName, succMsg)];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    PinguGuild.GetPGuild = function (guild) {
        return __awaiter(this, void 0, void 0, function () {
            var pGuildDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!guild)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, PinguGuildSchema.findOne({ _id: guild.id }).exec()];
                    case 1:
                        pGuildDoc = _a.sent();
                        return [2 /*return*/, pGuildDoc ? pGuildDoc.toObject() : null];
                }
            });
        });
    };
    PinguGuild.UpdatePGuild = function (client, updatedProperty, pGuild, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function () {
            var guild;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.guilds.fetch(pGuild._id)];
                    case 1:
                        guild = _a.sent();
                        if (!guild)
                            throw new Error({ message: "Guild not found!" });
                        PinguGuildSchema.updateOne({ _id: pGuild._id }, updatedProperty, null, function (err) {
                            if (err)
                                PinguLibrary.pGuildLog(client, scriptName, errMsg, err);
                            else
                                PinguLibrary.pGuildLog(client, scriptName, succMsg);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    PinguGuild.DeletePGuild = function (client, guild, scriptName, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PinguGuildSchema.deleteOne({ _id: guild.id }, null, function (err) {
                            if (err)
                                PinguLibrary.pGuildLog(client, scriptName, errMsg, new Error(err));
                            else
                                PinguLibrary.pGuildLog(client, scriptName, succMsg);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PinguGuild.GetPGuilds = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PinguGuildSchema.find({}).exec()];
                    case 1: return [2 /*return*/, (_a.sent()).map(function (collDoc) { return collDoc.toObject(); })];
                }
            });
        });
    };
    PinguGuild.GetPClient = function (client, pGuild) {
        return pGuild.clients.find(function (c) { return c && c._id == client.user.id; });
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
        if (require('./config.json').updateStats)
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
            if (client.user.id == PinguLibrary.Clients.BetaID)
                activity = new Activity('Danho cry over bad code', 'WATCHING');
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
            client.user.setActivity(activity.text + (" " + PinguLibrary.DefaultPrefix(client) + "help"), { type: activity.type });
            PinguLibrary.raspberryLog(client);
        }
        function UpdateStats() {
            return __awaiter(this, void 0, void 0, function () {
                var getChannel, channels, setName, _i, channels_1, channel;
                var _this = this;
                return __generator(this, function (_a) {
                    getChannel = function (client, channelID) { return PinguLibrary.SavedServers.PinguSupport(client).channels.cache.get(channelID); };
                    channels = [
                        getChannel(client, '799596588859129887'),
                        getChannel(client, '799597092107583528'),
                        getChannel(client, '799597689792757771'),
                        getChannel(client, '799598372217683978'),
                        getChannel(client, '799598024971518002'),
                        getChannel(client, '799598765187137537') //Most known member
                    ];
                    setName = function (channel) { return __awaiter(_this, void 0, void 0, function () {
                        var getInfo, channelName, info, newName;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    getInfo = function (channel) { return __awaiter(_this, void 0, void 0, function () {
                                        function getServersInfo() {
                                            return client.guilds.cache.size.toString();
                                        }
                                        function getUsersInfo() {
                                            return client.users.cache.size.toString();
                                        }
                                        function getDailyLeader() {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var pUser, err_1;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            _a.trys.push([0, 2, , 3]);
                                                            return [4 /*yield*/, PinguUser.GetPUsers()];
                                                        case 1:
                                                            pUser = (_a.sent()).sort(function (a, b) {
                                                                try {
                                                                    return b.daily.streak - a.daily.streak;
                                                                }
                                                                catch (err) {
                                                                    PinguLibrary.errorLog(client, "unable to get daily streak difference between " + a.tag + " and " + b.tag, null, err);
                                                                }
                                                            })[0];
                                                            return [2 /*return*/, pUser.tag + " #" + pUser.daily.streak];
                                                        case 2:
                                                            err_1 = _a.sent();
                                                            PinguLibrary.errorLog(client, "Unable to get Daily Leader", null, err_1);
                                                            return [3 /*break*/, 3];
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            });
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
                                                    Users.set(user, Users.get(user) + 1);
                                                });
                                            });
                                            var sorted = Users.sort(function (a, b) { return b - a; });
                                            var strings = sorted.filter(function (v, u) { return sorted.first() == v; }).map(function (v, u) { return u.tag + " | #" + v; });
                                            return strings[Math.floor(Math.random() * strings.length)];
                                        }
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _a = channel.id;
                                                    switch (_a) {
                                                        case '799596588859129887': return [3 /*break*/, 1];
                                                        case '799597092107583528': return [3 /*break*/, 2];
                                                        case '799597689792757771': return [3 /*break*/, 3];
                                                        case '799598372217683978': return [3 /*break*/, 5];
                                                        case '799598024971518002': return [3 /*break*/, 6];
                                                        case '799598765187137537': return [3 /*break*/, 7];
                                                    }
                                                    return [3 /*break*/, 8];
                                                case 1: return [2 /*return*/, getServersInfo()]; //Servers
                                                case 2: return [2 /*return*/, getUsersInfo()]; //Users
                                                case 3: return [4 /*yield*/, getDailyLeader()];
                                                case 4: return [2 /*return*/, _b.sent()]; //Daily Leader
                                                case 5: return [2 /*return*/, getRandomServer()]; //Server of the Day
                                                case 6: return [2 /*return*/, getRandomUser()]; //User of the Day
                                                case 7: return [2 /*return*/, getMostKnownUser()]; //Most known User
                                                case 8:
                                                    PinguLibrary.errorLog(client, "ID of " + channel.name + " was not recognized!");
                                                    return [2 /*return*/, "No Info"];
                                                case 9: return [2 /*return*/];
                                            }
                                        });
                                    }); };
                                    channelName = channel.name.split(':')[0];
                                    return [4 /*yield*/, getInfo(channel)];
                                case 1:
                                    info = _a.sent();
                                    newName = channelName + ": " + info;
                                    if (channel.name == newName)
                                        return [2 /*return*/];
                                    return [2 /*return*/, channel.setName(newName)];
                            }
                        });
                    }); };
                    for (_i = 0, channels_1 = channels; _i < channels_1.length; _i++) {
                        channel = channels_1[_i];
                        setName(channel);
                    }
                    return [2 /*return*/];
                });
            });
        }
    };
    PinguLibrary.DefaultPrefix = function (client) {
        return client.user.id == PinguLibrary.Clients.PinguID ?
            require('./config.json').Prefix :
            require('./config.json').BetaPrefix;
    };
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
        return __awaiter(this, void 0, void 0, function () {
            var servers, _i, _a, guild;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        servers = new Array();
                        _i = 0, _a = client.guilds.cache.array();
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        guild = _a[_i];
                        return [4 /*yield*/, guild.members.fetch(user)];
                    case 2:
                        if (_b.sent())
                            servers.push(guild);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, servers];
                }
            });
        });
    };
    //#endregion
    //#region Pingu Developers
    PinguLibrary.Developers = function (client) {
        var obj = {
            get Danho() { return client.users.cache.get('245572699894710272'); },
            get SynthySytro() { return client.users.cache.get('405331883157880846'); },
            get Slohtman() { return client.users.cache.get('290131910091603968'); },
            get DefilerOfCats() { return client.users.cache.get('803903863706484756'); },
            includes: function (id) {
                return Object
                    .keys(obj)
                    .filter(function (v) { return v != 'includes'; })
                    .map(function (key) { return obj[key] && obj[key].id; })
                    .includes(id);
            }
        };
        return obj;
    };
    PinguLibrary.isPinguDev = function (user) {
        return this.Developers(user.client).includes(user.id);
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
            var Danho;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.error(message);
                        Danho = PinguLibrary.Developers(client).Danho;
                        if (!Danho)
                            return [2 /*return*/];
                        return [4 /*yield*/, Danho.createDM()];
                    case 1: return [2 /*return*/, (_a.sent()).send(message)];
                }
            });
        });
    };
    //#endregion
    //#region Log Channels
    PinguLibrary.errorLog = function (client, message, messageContent, err) {
        return __awaiter(this, void 0, void 0, function () {
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
            var errorlogChannel, sent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorlogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'error-log-⚠️');
                        if (!errorlogChannel)
                            return [2 /*return*/, this.DanhoDM(client, 'Unable to find #error-log in Pingu Support')];
                        console.error(getErrorMessage(message.includes('`') ? message.replace('`', ' ') : message, messageContent, err));
                        return [4 /*yield*/, errorlogChannel.send(getErrorMessage(message, messageContent, err))];
                    case 1:
                        sent = _a.sent();
                        return [4 /*yield*/, sent.react(PinguLibrary.SavedServers.DanhoMisc(client).emojis.cache.find(function (e) { return e.name == 'Checkmark'; }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, sent];
                }
            });
        });
    };
    PinguLibrary.pGuildLog = function (client, script, message, err) {
        return __awaiter(this, void 0, void 0, function () {
            var pinguGuildLog, errorLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pinguGuildLog = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "pingu-guild-log-🏡");
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
                        pinguUserLog = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "pingu-user-log-🧍");
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
        return __awaiter(this, void 0, void 0, function () {
            var timeFormat, consoleLogChannel;
            return __generator(this, function (_a) {
                timeFormat = "[" + new Date(Date.now()).toLocaleTimeString() + "]";
                console.log(timeFormat + " " + message);
                consoleLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "console-log-📝");
                if (!consoleLogChannel)
                    return [2 /*return*/, this.DanhoDM(client, 'Unable to find #console-log in Pingu Support')];
                consoleLogChannel.send(message);
                return [2 /*return*/];
            });
        });
    };
    PinguLibrary.eventLog = function (client, content) {
        return __awaiter(this, void 0, void 0, function () {
            var eventLogChannel, lastCache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (client.user.id == PinguLibrary.Clients.BetaID)
                            return [2 /*return*/];
                        eventLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "event-log-📹");
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
        return __awaiter(this, void 0, void 0, function () {
            var tellLogChannel, messageAsMessage, consoleLog, format;
            return __generator(this, function (_a) {
                if (client.user.id == PinguLibrary.Clients.BetaID)
                    return [2 /*return*/];
                tellLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'tell-log-💬');
                if (!tellLogChannel)
                    return [2 /*return*/, this.DanhoDM(client, "Couldn't get #tell-log channel in Pingu Support, https://discord.gg/gbxRV4Ekvh")];
                if (message.constructor.name == "Message") {
                    messageAsMessage = message;
                    consoleLog = messageAsMessage.content ?
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
                    format = function (ping) { return new Date(Date.now()).toLocaleTimeString() + " [<@" + (ping ? sender : sender.username) + "> \u27A1\uFE0F <@" + (ping ? reciever : reciever.username) + ">]"; };
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
                return [2 /*return*/];
            });
        });
    };
    PinguLibrary.LatencyCheck = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var pingChannel, pingChannelSent, latency, outages, outagesMessages, outageMessagesCount, i, lastPinguMessage, sendMessage, lastMessageArgs, lastLatencyExclaim, lastLatency;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pingChannel = this.getChannel(message.client, this.SavedServers.PinguSupport(message.client).id, "ping-log-🏓");
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
        return __awaiter(this, void 0, void 0, function () {
            var raspberryLogChannel;
            return __generator(this, function (_a) {
                if (client.user.id == PinguLibrary.Clients.BetaID)
                    return [2 /*return*/];
                raspberryLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'raspberry-log-🍇');
                if (!raspberryLogChannel)
                    return [2 /*return*/, this.DanhoDM(client, "Couldn't get #raspberry-log channel in Pingu Support, https://discord.gg/gbxRV4Ekvh")];
                return [2 /*return*/, raspberryLogChannel.send("Pulled version " + require('./config.json').version + " from Github")];
            });
        });
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
    PinguLibrary.DBExecute = function (client, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var mongoPass, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        mongoPass = require('./config.json').mongoPass;
                        return [4 /*yield*/, mongoose.connect("mongodb+srv://Pingu:" + mongoPass + "@pingudb.kh2uq.mongodb.net/PinguDB?retryWrites=true&w=majority", {
                                useNewUrlParser: true,
                                useUnifiedTopology: true
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, callback(mongoose)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        PinguLibrary.errorLog(client, 'Mongo error', null, new Error(err_2));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PinguLibrary.BlankEmbedField = function (inline) {
        if (inline === void 0) { inline = false; }
        return new EmbedField('\u200B', '\u200B', inline);
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
    /**@param type [**${type}**]
     * @param preArr Previous array
     * @param newArr Current array
     * @param callback pre/new.find(i => callback(i, preItem/newItem))*/
    PinguEvents.GoThroughArrays = function (type, preArr, newArr, callback) {
        var updateMessage = "[**" + type + "**] ";
        var added = GoThroguhArray(newArr, preArr);
        var removed = GoThroguhArray(preArr, newArr);
        if (added.length == 0 && removed.length != 0)
            return updateMessage += removed.join(", ").substring(removed.join(', ').length - 2);
        else if (removed.length == 0 && added.length != 0)
            return updateMessage += added.join(", ").substring(added.join(', ').length - 2);
        return updateMessage += "Unable to find out what changed!";
        function GoThroguhArray(cycleArr, otherCycleArr) {
            var result = new Array();
            for (var _i = 0, cycleArr_1 = cycleArr; _i < cycleArr_1.length; _i++) {
                var item = cycleArr_1[_i];
                var old = otherCycleArr.find(function (i) { return callback(i, item); });
                if (!old)
                    result.push(item);
            }
            return result;
        }
    };
    PinguEvents.GoThroughObjectArray = function (type, preArr, newArr) {
        var updateMessage = "[**" + type + "**]\n";
        var changes = new discord_js_1.Collection();
        if (preArr.length > newArr.length)
            return updateMessage += "Removed " + type.toLowerCase();
        else if (newArr.length > preArr.length)
            return updateMessage += "Added new " + type.toLowerCase();
        var _loop_1 = function () {
            var newKeys = Object.keys(newArr[i]);
            var preKeys = Object.keys(preArr[i]);
            newKeys.forEach(function (key) {
                if (newArr[key] == preArr[key])
                    return;
                else if (!preArr[key])
                    changes.set(key, "__Added__: " + newArr[key]);
                else
                    changes.set(key, "__Changed__: **" + preArr[key] + "** => **" + newArr[key] + "**");
            });
            preKeys.forEach(function (key) {
                if (changes.get(key) || preKeys[key] == newKeys[key])
                    return;
                else if (!newArr[key])
                    changes.set(key, "__Removed__: " + preArr[key]);
            });
        };
        for (var i = 0; i < newArr.length; i++) {
            _loop_1();
        }
        changes.keyArray().forEach(function (key) { return updateMessage += "**" + key + "**: " + changes.get(key) + "\n"; });
        return updateMessage;
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
var Decidable = /** @class */ (function () {
    function Decidable(value, id, author, channel) {
        this.value = value;
        this._id = id;
        this.author = author;
        this.channel = new PChannel(channel);
    }
    return Decidable;
}());
//#region Extends Decideables
var Poll = /** @class */ (function (_super) {
    __extends(Poll, _super);
    function Poll() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Poll.Decide = function (poll, yesVotes, noVotes) {
        poll.YesVotes = yesVotes;
        poll.NoVotes = noVotes;
        poll.approved =
            poll.YesVotes > poll.NoVotes ? 'Yes' :
                poll.NoVotes > poll.YesVotes ? 'No' : 'Undecided';
        return poll;
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
//#endregion
var TimeLeftObject = /** @class */ (function () {
    function TimeLeftObject(Now, EndsAt) {
        //General properties
        this.endsAt = EndsAt;
        var timeDifference = Math.round(EndsAt.getTime() - Now.getTime());
        //How long is each time module in ms
        var second = 1000;
        var minute = second * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var week = day * 7;
        var month = ([1, 3, 5, 7, 8, 10, 12].includes(Now.getMonth()) ? 31 : [4, 6, 9, 11].includes(Now.getMonth()) ? 30 : Now.getFullYear() % 4 == 0 ? 29 : 28) * day;
        var year = (365 + (Now.getFullYear() % 4 == 0 ? 1 : 0)) * day;
        //Calculate time difference between Now & EndsAt and set to object properties
        this.years = reduceTime(year);
        this.months = reduceTime(month);
        this.weeks = reduceTime(week);
        this.days = reduceTime(day);
        this.hours = reduceTime(hour);
        this.minutes = reduceTime(minute);
        this.seconds = reduceTime(second);
        this.milliseconds = reduceTime(1);
        function reduceTime(ms) {
            var result = 0;
            while (timeDifference > ms) {
                timeDifference -= ms;
                result++;
            }
            return result;
        }
    }
    TimeLeftObject.prototype.toString = function () {
        //console.log(`${this.days}Y ${this.days}M ${this.days}w ${this.days}d ${this.hours}h ${this.minutes}m ${this.seconds}s`);
        var returnMsg = '';
        var times = [this.years, this.months, this.weeks, this.days, this.hours, this.minutes, this.seconds], timeMsg = ["year", "month", "week", "day", "hour", "minute", "second"];
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
    function Queue(logChannel, voiceChannel, songs, playing) {
        if (playing === void 0) { playing = true; }
        this.logChannel = logChannel;
        this.voiceChannel = voiceChannel;
        this.songs = songs;
        this.volume = 1;
        this.connection = null;
        this.playing = playing;
        this.loop = false;
        this.index = 0;
    }
    Queue.get = function (guildID) {
        return this.GuildQueue.get(guildID);
    };
    Queue.set = function (guildID, queue) {
        this.GuildQueue.set(guildID, queue);
    };
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
        song._id = this.songs.length;
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
            song._id = _this.songs.length;
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
    Queue.prototype.pauseResume = function (message, pauseRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var lastMessage, react, PauseOrResume;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.playing && pauseRequest)
                            return [2 /*return*/, message.channel.send("Music is already paused!")];
                        else if (this.playing && !pauseRequest)
                            return [2 /*return*/, message.channel.send("Music is already resumed!")];
                        if (pauseRequest)
                            this.connection.dispatcher.pause();
                        else
                            this.connection.dispatcher.resume();
                        return [4 /*yield*/, message.channel.messages.fetch({ after: message.id })];
                    case 1:
                        lastMessage = (_a.sent()).first();
                        react = function (msg) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(msg && msg.embeds[0] && msg.embeds[0].title.startsWith('Now playing:')))
                                            return [2 /*return*/, false];
                                        return [4 /*yield*/, msg.reactions.removeAll()];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, msg.react(pauseRequest ? '▶️' : '⏸️')];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, true];
                                }
                            });
                        }); };
                        return [4 /*yield*/, react(lastMessage)];
                    case 2:
                        if (!!(_a.sent())) return [3 /*break*/, 4];
                        return [4 /*yield*/, react(message)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.playing = !pauseRequest;
                        PauseOrResume = pauseRequest ? 'Paused' : 'Resumed';
                        if (lastMessage && lastMessage.author == message.client.user && (lastMessage.content.includes('Resumed') || lastMessage.content.includes('Paused')))
                            return [2 /*return*/, lastMessage.edit(lastMessage.content.includes('by') ?
                                    PauseOrResume + " by " + message.member.displayName + "." :
                                    PauseOrResume + " music.")];
                        this.AnnounceMessage(message, PauseOrResume + " music.", PauseOrResume + " by " + message.member.displayName + ".");
                        return [2 /*return*/];
                }
            });
        });
    };
    Queue.prototype.AnnounceMessage = function (message, senderMsg, logMsg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.logChannel)
                    return [2 /*return*/, message.channel.send(senderMsg)];
                if (message.channel != this.logChannel) {
                    message.channel.send(senderMsg);
                    return [2 /*return*/, this.logChannel.send(logMsg)];
                }
                return [2 /*return*/, this.logChannel.send(senderMsg)];
            });
        });
    };
    Queue.prototype.Update = function (message, commandName, succMsg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                Queue.set(message.guild.id, ['HandleStop', 'Play'].includes(commandName) ? null : this);
                PinguLibrary.consoleLog(message.client, "{**" + commandName + "**}: " + succMsg);
                return [2 /*return*/];
            });
        });
    };
    Queue.prototype.NowPlayingEmbed = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, thumbnail, title, requestedBy, endsAt, author, link, pGuildClient, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this.currentSong, thumbnail = _a.thumbnail, title = _a.title, requestedBy = _a.requestedBy, endsAt = _a.endsAt, author = _a.author, link = _a.link;
                        _c = (_b = PinguGuild).GetPClient;
                        _d = [message.client];
                        return [4 /*yield*/, PinguGuild.GetPGuild(message.guild)];
                    case 1:
                        pGuildClient = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/, new discord_js_1.MessageEmbed()
                                .setTitle("Now playing: " + title + " | by " + author)
                                .setDescription("Requested by <@" + requestedBy._id + ">")
                                .setFooter("Song finished at")
                                .setThumbnail(thumbnail)
                                .setURL(link)
                                .setColor(pGuildClient.embedColor)
                                .setTimestamp(endsAt)];
                }
            });
        });
    };
    Queue.GuildQueue = new discord_js_1.Collection();
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
        this._id = 0;
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
var ReactionRole = /** @class */ (function () {
    function ReactionRole(message, reactionName, role) {
        this.emoteName = reactionName;
        this.pRole = new PRole(role);
        this.channel = new PChannel(message.channel);
        this.messageID = message.id;
    }
    ReactionRole.GetReactionRole = function (client, reaction, user) {
        return __awaiter(this, void 0, void 0, function () {
            var guild, pGuild, rr, pRole, member, permCheck;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        guild = reaction.message.guild;
                        return [4 /*yield*/, PinguGuild.GetPGuild(guild)];
                    case 1:
                        pGuild = _a.sent();
                        rr = pGuild.reactionRoles.find(function (rr) {
                            return rr.messageID == reaction.message.id &&
                                (rr.emoteName == reaction.emoji.name) &&
                                rr.channel._id == reaction.message.channel.id;
                        });
                        if (!rr)
                            return [2 /*return*/, null];
                        pRole = rr.pRole;
                        member = guild.member(user);
                        permCheck = PinguLibrary.PermissionCheck({
                            author: client.user,
                            client: client,
                            channel: reaction.message.channel,
                            content: "No content provided"
                        }, [DiscordPermissions.MANAGE_ROLES]);
                        if (permCheck != PinguLibrary.PermissionGranted) {
                            guild.owner.send("I tried to give " + member.displayName + " the " + pRole.name + ", as " + permCheck);
                            user.send("I'm unable to give you the reactionrole at the moment! I've contacted " + user.username + " about this.");
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, guild.roles.fetch(pRole._id)];
                }
            });
        });
    };
    return ReactionRole;
}());
exports.ReactionRole = ReactionRole;
//#region Pingu User Properties
var Daily = /** @class */ (function () {
    function Daily() {
        this.lastClaim = null;
        this.nextClaim = null;
        this.streak = 0;
    }
    return Daily;
}());
exports.Daily = Daily;
var Marry = /** @class */ (function () {
    function Marry(partner, internalDate) {
        this.partner = partner;
        this.internalDate = internalDate ? new Date(internalDate) : null;
    }
    Object.defineProperty(Marry.prototype, "marriedMessage", {
        get: function () {
            return "You have been " + (this.partner ? "married to <@" + this.partner._id + "> since" : "single since") + " **" + this.internalDate.toLocaleTimeString() + ", " + this.internalDate.toLocaleDateString().split('.').join('/') + "**";
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
var Achievement = /** @class */ (function (_super) {
    __extends(Achievement, _super);
    function Achievement(id, name) {
        return _super.call(this, { id: id.toString(), name: name }) || this;
    }
    Object.defineProperty(Achievement, "Achievements", {
        get: function () {
            return null;
        },
        enumerable: false,
        configurable: true
    });
    return Achievement;
}(PItem));
exports.Achievement = Achievement;
//#endregion
//# sourceMappingURL=PinguPackage.js.map