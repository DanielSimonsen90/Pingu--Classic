"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
//#region sendEmbed
function sendEmbed(...embeds) {
    return this.send({ embeds });
}
discord_js_1.TextChannel.prototype.sendEmbeds = sendEmbed;
discord_js_1.NewsChannel.prototype.sendEmbeds = sendEmbed;
discord_js_1.DMChannel.prototype.sendEmbeds = sendEmbed;
discord_js_1.ThreadChannel.prototype.sendEmbeds = sendEmbed;
//#endregion
//#region sendFiles
function sendFiles(...files) {
    return this.send({ files });
}
discord_js_1.TextChannel.prototype.sendFiles = sendFiles;
discord_js_1.NewsChannel.prototype.sendFiles = sendFiles;
discord_js_1.DMChannel.prototype.sendFiles = sendFiles;
discord_js_1.ThreadChannel.prototype.sendFiles = sendFiles;
//#endregion
