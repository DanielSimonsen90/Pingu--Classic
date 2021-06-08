"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuildMember = void 0;
const PItem_1 = require("./PItem");
const AchievementConfig_1 = require("./AchievementConfig");
exports.PinguGuildMember = Object.assign(Object.assign({}, PItem_1.default), { guild: PItem_1.default, achievementConfig: AchievementConfig_1.default });
exports.default = exports.PinguGuildMember;
