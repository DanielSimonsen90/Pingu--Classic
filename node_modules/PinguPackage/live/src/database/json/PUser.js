"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUser = void 0;
const PItem_1 = require("./PItem");
class PUser extends PItem_1.PItem {
    constructor(user) {
        super({ id: user.id, name: user.tag });
    }
}
exports.PUser = PUser;
