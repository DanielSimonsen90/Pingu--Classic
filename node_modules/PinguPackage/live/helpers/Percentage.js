"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Percentage = void 0;
class Percentage {
    constructor(whole, part) {
        this.whole = whole;
        this.part = part;
        this.value = this.calculateValue();
    }
    calculateValue() {
        return this.whole / 100 * this.part;
    }
}
exports.Percentage = Percentage;
