"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PItem = void 0;
class PItem {
    constructor(object) {
        this._id = object.id;
        this.name = object.name;
    }
    _id;
    name;
}
exports.PItem = PItem;
exports.default = PItem;