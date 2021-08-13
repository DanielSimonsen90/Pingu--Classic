"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
discord_js_1.Message.prototype.reactioRoles = function () {
    try {
        const { guild } = this;
        if (!guild)
            throw { reason: 'No guild' };
        const pGuild = guild.pGuild();
        if (!pGuild)
            throw { reason: 'No pGuild' };
        return pGuild.settings.reactionRoles.reduce((result, rr) => {
            const emoji = guild.emojis.cache.find(e => e.name === rr.emoteName) || rr.emoteName;
            return result.set(emoji, rr);
        }, new discord_js_1.Collection());
    }
    catch (err) {
        if (err.reason)
            return new discord_js_1.Collection();
        throw err;
    }
};
discord_js_1.Message.prototype.editEmbeds = function (...embeds) {
    return this.edit({ embeds });
};
discord_js_1.Message.prototype.editFiles = function (...files) {
    return this.edit({ files });
};
