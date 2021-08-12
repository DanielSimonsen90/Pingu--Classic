"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
discord_js_1.BaseGuildVoiceChannel.prototype.join = function () {
    if (!this.joinable)
        throw new Error(`Voice channel is not joinable!`);
    return voice_1.joinVoiceChannel({
        channelId: this.id,
        guildId: this.guildId,
        adapterCreator: this.guild.voiceAdapterCreator
    });
};
