"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguError = void 0;
class PinguError extends global.Error {
    constructor(err) {
        super(err == typeof 'string' ? err : err.message);
    }
}
exports.PinguError = PinguError;
