"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementBase = void 0;
const PItem_1 = require("../../../database/json/PItem");
class AchievementBase extends PItem_1.default {
    constructor(id, name, description) {
        super({ id: id.toString(), name });
        this.description = description;
    }
    description;
    static useCommand(command, extraInfo) {
        return `Use the \`${command}\` command to ${extraInfo}`;
    }
}
exports.AchievementBase = AchievementBase;
exports.default = AchievementBase;
