"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguArray = void 0;
class PinguArray extends Array {
    remove(item) {
        return this.includes(item) ? this.splice(this.indexOf(item), 1)[0] : null;
    }
    random() {
        const r = Math.round(Math.random() * this.length);
        return this[r];
    }
}
exports.default = PinguArray;
exports.PinguArray = PinguArray;
