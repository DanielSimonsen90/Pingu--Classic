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
exports.PinguGuild = exports.GiveawayConfig = exports.Giveaway = exports.Poll = exports.Suggestion = exports.PGuildMember = void 0;
/** Custom GuildMember */
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
//#region Decidables
var Decidable = /** @class */ (function () {
    function Decidable(value, id, author) {
        this.value = value;
        this.id = id;
        this.author = author;
    }
    return Decidable;
}());
var DecidableApproved = /** @class */ (function (_super) {
    __extends(DecidableApproved, _super);
    function DecidableApproved() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DecidableApproved;
}(Decidable));
//#endregion
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
}(DecidableApproved));
exports.Suggestion = Suggestion;
var Poll = /** @class */ (function (_super) {
    __extends(Poll, _super);
    function Poll() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Poll.prototype.Decide = function (yesVotes, noVotes) {
        this.YesVotes = yesVotes;
        this.NoVotes = noVotes;
        if (this.YesVotes == this.NoVotes)
            return;
        this.approved = this.YesVotes > this.NoVotes;
    };
    return Poll;
}(DecidableApproved));
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
//#endregion
var GiveawayConfig = /** @class */ (function () {
    function GiveawayConfig() {
        this.firstTimeExecuted = true;
        this.hostRole = undefined;
        this.winnerRole = undefined;
    }
    GiveawayConfig.prototype.SetGiveawaysArray = function () {
        this.giveaways = new Array();
    };
    return GiveawayConfig;
}());
exports.GiveawayConfig = GiveawayConfig;
var PinguGuild = /** @class */ (function () {
    function PinguGuild(guild) {
        this.guildName = guild.name;
        this.guildID = guild.id;
        this.guildOwner = new PGuildMember(guild.owner);
        var Prefix = require('./config.json').Prefix;
        this.botPrefix = Prefix;
        this.embedColor = 0;
        this.giveawayConfig = new GiveawayConfig();
        this.polls = new Array();
        this.suggestions = new Array();
        if (guild.id == '405763731079823380')
            this.themeWinners = new Array();
    }
    return PinguGuild;
}());
exports.PinguGuild = PinguGuild;
//# sourceMappingURL=PinguPackage.js.map