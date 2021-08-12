"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionConfig = void 0;
class SuggestionConfig {
    constructor(options) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.managerRole = options ? options.managerRole : undefined;
        this.channel = options ? options.channel : undefined;
        this.suggestions = options ? options.suggestions : undefined;
    }
    managerRole;
    suggestions;
    channel;
    firstTimeExecuted;
}
exports.SuggestionConfig = SuggestionConfig;
exports.default = SuggestionConfig;
