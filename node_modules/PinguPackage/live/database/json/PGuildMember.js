"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PGuildMember = void 0;
const PItem_1 = require("./PItem");
class PGuildMember extends PItem_1.PItem {
    constructor(member) {
        super({
            id: member.id,
            name: member.user.tag
        });
    }
}
exports.PGuildMember = PGuildMember;
