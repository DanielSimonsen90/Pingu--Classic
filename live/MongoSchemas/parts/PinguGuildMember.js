"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguGuildMember = void 0;
const PItem_1 = require("./PItem");
const AchievementsConfig_1 = require("./AchievementsConfig");
exports.PinguGuildMember = Object.assign(Object.assign({}, PItem_1.PItem), { guild: PItem_1.PItem, achievementsConfig: AchievementsConfig_1.AchievementsConfig });
