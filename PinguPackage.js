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
exports.PinguGuilds = exports.Giveaway = exports.Poll = exports.Suggestion = void 0;
//#region Decidables
var Decidable = /** @class */ (function () {
    function Decidable(value, id, author) {
        this.Value = value;
        this.ID = id;
        this.Author = author;
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
        this.Approved = approved;
        this.DecidedBy = decidedBy;
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
        this.Approved = this.YesVotes > this.NoVotes;
    };
    return Poll;
}(DecidableApproved));
exports.Poll = Poll;
var Giveaway = /** @class */ (function (_super) {
    __extends(Giveaway, _super);
    function Giveaway() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Giveaway;
}(Decidable));
exports.Giveaway = Giveaway;
//#endregion
//Insert custom GuildMember here
var PinguGuilds = /** @class */ (function () {
    function PinguGuilds(guild) {
        this.guildOwner = {
            id: guild.owner.user.id,
            user: guild.owner.user.tag
        };
        this.guildID = guild.id;
        this.guildName = guild.name;
        this.EmbedColor = 0;
        var Prefix = require('./config').Prefix;
        this.BotPrefix = Prefix;
        this.Giveaways = new Array();
        this.Polls = new Array();
        this.Suggestions = new Array();
        this.ThemeWinners = new Array();
    }
    return PinguGuilds;
}());
exports.PinguGuilds = PinguGuilds;
//# sourceMappingURL=PinguPackage.js.map