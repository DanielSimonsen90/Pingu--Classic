"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementBase = void 0;
const PItem_1 = require("../../../database/json/PItem");
class AchievementBase extends PItem_1.PItem {
    constructor(id, name, description) {
        super({ id: id.toString(), name });
        this.description = description;
    }
}
exports.AchievementBase = AchievementBase;
