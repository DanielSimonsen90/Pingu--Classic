"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollConfig = void 0;
class PollConfig {
    constructor(options) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.pollRole = options ? options.pollRole : undefined;
        this.channel = options ? options.channel : undefined;
        this.polls = options ? options.polls : undefined;
    }
}
exports.PollConfig = PollConfig;
exports.default = PollConfig;
