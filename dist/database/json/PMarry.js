"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PMarry = void 0;
const Marry_1 = require("../../pingu/user/items/Marry");
class PMarry {
    constructor(marry) {
        this.partner = marry.partner;
        this.internalDate = marry.internalDate.toString();
    }
    partner;
    internalDate;
    ToMarry() {
        return new Marry_1.default(this.partner, this.internalDate);
    }
}
exports.PMarry = PMarry;
exports.default = PMarry;
