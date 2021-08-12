"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const DeveloperCollection_1 = require("../pingu/collection/DeveloperCollection");
discord_js_1.User.prototype.isPinguDev = function () {
    return DeveloperCollection_1.isPinguDev(this);
};
discord_js_1.User.prototype.pUser = function () {
    return this.client.pUsers.get(this);
};
