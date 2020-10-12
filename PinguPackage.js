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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLeftObject = exports.GiveawayConfig = exports.PollConfig = exports.Giveaway = exports.Poll = exports.Suggestion = exports.PinguGuild = exports.PRole = exports.PGuildMember = void 0;
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
    function PinguGuild(guild) {
        this.guildName = guild.name;
        this.guildID = guild.id;
        this.guildOwner = new PGuildMember(guild.owner);
        var Prefix = require('./config.json').Prefix;
        this.botPrefix = Prefix;
        this.embedColor = 0;
        this.giveawayConfig = new GiveawayConfig();
        this.pollConfig = new PollConfig;
        this.suggestions = new Array();
        if (guild.id == '405763731079823380')
            this.themeWinners = new Array();
    }
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
//# sourceMappingURL=PinguPackage.js.map