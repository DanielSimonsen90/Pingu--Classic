"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PMarry = void 0;
const items_1 = require("../../pingu/user/items");
class PMarry {
    constructor(marry) {
        this.partner = marry.partner;
        this.internalDate = marry.internalDate.toString();
    }
    ToMarry() {
        return new items_1.Marry(this.partner, this.internalDate);
    }
}
exports.PMarry = PMarry;
