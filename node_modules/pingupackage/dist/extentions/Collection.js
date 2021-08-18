"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
discord_js_1.Collection.prototype.array = function () {
    return [...this.values()];
};
discord_js_1.Collection.prototype.keyArray = function () {
    return [...this.keys()];
};
discord_js_1.Collection.prototype.findByDisplayName = function (name) {
    return [
        this.find(v => v.tag == name),
        this.find(v => v.name == name),
        this.find(v => v.displayName == name),
    ].filter(v => v)[0];
};
