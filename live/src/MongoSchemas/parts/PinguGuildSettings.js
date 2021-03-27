"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuildSettings = void 0;
const ReactionRoles_1 = require("./ReactionRoles");
const PItem_1 = require("./PItem");
const PinguGuildConfig_1 = require("./PinguGuildConfig");
exports.PinguGuildSettings = {
    welcomeChannel: PItem_1.PItem,
    reactionRoles: [ReactionRoles_1.ReactionRoles],
    config: PinguGuildConfig_1.PinguGuildConfig
};
