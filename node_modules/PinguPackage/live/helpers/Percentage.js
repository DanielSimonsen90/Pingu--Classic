"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Percentage = void 0;
class Percentage {
    constructor(whole, part) {
        this.whole = whole;
        this.part = part;
        this.value = (function calculate() {
            var result = part / whole; //How much is part of whole
            result *= 100; //Convert to percentage
            return result.toFixed(2); //Only do 2 digits after comma; 10.00%
        })();
    }
}
exports.Percentage = Percentage;
exports.default = Percentage;
