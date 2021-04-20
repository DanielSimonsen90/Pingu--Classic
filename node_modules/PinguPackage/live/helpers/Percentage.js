"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Percentage = void 0;
class Percentage {
    constructor(whole, part) {
        this.whole = whole;
        this.part = part;
        this.value = whole / 100 * part;
    }
}
exports.Percentage = Percentage;
