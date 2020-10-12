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
exports.Song = exports.Queue = exports.TimeLeftObject = exports.GiveawayConfig = exports.PollConfig = exports.Giveaway = exports.Poll = exports.Suggestion = exports.PinguGuild = exports.PRole = exports.PGuildMember = void 0;
var discord_js_1 = require("discord.js");
var fs = require('fs');
//#region Custom Pingu classes
var PGuildMember = /** @class */ (function () {
    function PGuildMember(member) {
        this.id = member.id;
        this.user = member.user.tag;
        this.DiscordGuildMember = member;
    }
    PGuildMember.prototype.toString = function () {
        return "<@" + this.id + ">";
    };
    PGuildMember.prototype.toGuildMember = function () { return this.DiscordGuildMember; };
    return PGuildMember;
}());
exports.PGuildMember = PGuildMember;
var PRole = /** @class */ (function () {
    function PRole(role) {
        try {
            this.name = role.name;
            this.id = role.id;
            this.DiscordRole = role;
        }
        catch (_a) {
            return undefined;
        }
    }
    PRole.prototype.toRole = function () { return this.DiscordRole; };
    return PRole;
}());
exports.PRole = PRole;
var PinguGuild = /** @class */ (function () {
    //#endregion
    function PinguGuild(guild) {
        this.guildName = guild.name;
        this.guildID = guild.id;
        this.guildOwner = new PGuildMember(guild.owner);
        var Prefix = require('./config.json').Prefix;
        this.botPrefix = Prefix;
        this.embedColor = 0;
        this.musicQueue = null;
        this.giveawayConfig = new GiveawayConfig();
        this.pollConfig = new PollConfig;
        this.suggestions = new Array();
        if (guild.id == '405763731079823380')
            this.themeWinners = new Array();
    }
    //#region Static PinguGuild methods
    PinguGuild.GetPGuilds = function () {
        return require('./guilds.json');
    };
    PinguGuild.GetPGuild = function (message) {
        return this.GetPGuilds().find(function (pg) { return pg.guildID == message.guild.id; });
    };
    PinguGuild.UpdatePGuildsJSON = function (message, succMsg, errMsg) {
        var _this = this;
        fs.writeFile('./guilds.json', '', function (err) {
            if (err)
                console.log(err);
            else
                fs.appendFile('./guilds.json', JSON.stringify(_this.GetPGuilds(), null, 4), function (err) {
                    message.client.guilds.cache.find(function (guild) { return guild.id == "460926327269359626"; }).owner.createDM().then(function (DanhoDM) {
                        if (err)
                            DanhoDM.send(errMsg + ":\n\n" + err);
                        else
                            console.log(succMsg);
                    });
                });
        });
    };
    PinguGuild.UpdatePGuildsJSONAsync = function (message, succMsg, errMsg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.UpdatePGuildsJSON(message, succMsg, errMsg);
                return [2 /*return*/];
            });
        });
    };
    return PinguGuild;
}());
exports.PinguGuild = PinguGuild;
//#endregion
var Decidable = /** @class */ (function () {
    function Decidable(value, id, author) {
        this.value = value;
        this.id = id;
        this.author = author;
    }
    return Decidable;
}());
//#region extends Decideables
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
    function Giveaway(value, id, author) {
        var _this = _super.call(this, value, id, author) || this;
        _this.winners = new Array();
        return _this;
    }
    return Giveaway;
}(Decidable));
exports.Giveaway = Giveaway;
var PollConfig = /** @class */ (function () {
    function PollConfig(options) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.pollRole = options ? options.pollRole : undefined;
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
    function Queue(logChannel, voiceChannel) {
        this.logChannel = logChannel;
        this.voiceChannel = voiceChannel;
        this.volume = 5;
    }
    /** Switches log channel from initate log channel (channel where play was executed) to newChannel
     * @param newChannel New log channel*/ Queue.prototype.switchLogChannel = function (newChannel) {
        this.logChannel = newChannel;
    };
    /**Sets the connection to the voice channel
     * @param conn*/ Queue.prototype.setConnection = function (conn) {
        this.connection = conn;
    };
    /** Adds song to the start of the queue
     * @param song song to add*/ Queue.prototype.addFirst = function (song) {
        this.songs.unshift(song);
    };
    /** Adds song to queue
     * @param song song to add*/ Queue.prototype.add = function (song) {
        this.songs.push(song);
    };
    /** Removes song from queue
     * @param song song to remove*/ Queue.prototype.remove = function (song) {
        this.songs = this.songs.filter(function (s) { return s != song; });
    };
    return Queue;
}());
exports.Queue = Queue;
var Song = /** @class */ (function () {
    function Song(videoInfo) {
        this.link = videoInfo.video_url;
        this.title = discord_js_1.Util.escapeMarkdown(videoInfo.title);
        this.length = this.GetLength(videoInfo.length_seconds);
        this.endsAt = new Date(Date.now() + parseInt(videoInfo.length_seconds));
    }
    Song.prototype.getTimeLeft = function () {
        return new TimeLeftObject(new Date(Date.now()), this.endsAt);
    };
    Song.prototype.GetLength = function (secondsLength) {
        var seconds = parseInt(secondsLength), minutes = 0, hours = 0, final = [];
        final.push(seconds);
        if (seconds > 59) {
            while (seconds > 59) {
                seconds -= 60;
                minutes++;
            }
            final.unshift(minutes);
        }
        if (minutes > 59) {
            while (minutes > 59) {
                minutes -= 60;
                hours++;
            }
            final.unshift(hours);
        }
        return final.join(':').substring(0, final.join(':').length - 1);
    };
    return Song;
}());
exports.Song = Song;
//#endregion
//# sourceMappingURL=PinguPackage.js.map