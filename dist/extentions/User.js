"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
discord_js_1.User.prototype.isPinguDev = function () {
    return this.client.developers.isPinguDev(this);
};
discord_js_1.User.prototype.pUser = function () {
    return this.client.pUsers.get(this);
};
