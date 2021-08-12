"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
discord_js_1.Collection.prototype.array = function () {
    return [...this.values()];
};
discord_js_1.Collection.prototype.keyArray = function () {
    return [...this.keys()];
};
