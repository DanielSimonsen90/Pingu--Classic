"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuildSettings = void 0;
const ReactionRoles_1 = require("./ReactionRoles");
const PItem_1 = require("./PItem");
const PinguGuildConfig_1 = require("./PinguGuildConfig");
exports.PinguGuildSettings = {
    welcomeChannel: PItem_1.default,
    reactionRoles: [ReactionRoles_1.default],
    config: PinguGuildConfig_1.default
};
exports.default = exports.PinguGuildSettings;
