"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reason = void 0;
class Reason {
    constructor(noun, database, name, reason) {
        this.reason = reason /*.substring(0, 1).toUpperCase() + reason.substring(1).toLowerCase()*/;
        if (!['.', '!', '?', ':'].includes(reason[reason.length - 1]))
            this.reason += '.';
        this.succMsg = `Successfully ${noun}d ${database} "${name}": ${this.reason}`;
        this.errMsg = `Failed to ${noun} ${database} "${name}": ${this.reason}`;
    }
}
exports.Reason = Reason;
exports.default = Reason;
