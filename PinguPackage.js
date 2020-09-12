"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuilds = exports.Suggestion = void 0;
var Suggestion = /** @class */ (function () {
    function Suggestion() {
    }
    return Suggestion;
}());
exports.Suggestion = Suggestion;
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
        this.ThemeWinners = new Array();
        this.GiveawayWinners = new Array();
        this.Suggestions = new Array();
    }
    return PinguGuilds;
}());
exports.PinguGuilds = PinguGuilds;
//# sourceMappingURL=PinguPackage.js.map