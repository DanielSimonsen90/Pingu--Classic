"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeConfig = void 0;
class ThemeConfig {
    constructor(options) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.allowSameWinner = options ? options.allowSameWinner : undefined;
        this.ignoreLastWins = options ? options.ignoreLastWins : 0;
        this.hostRole = options ? options.hostRole : undefined;
        this.winnerRole = options ? options.winnerRole : undefined;
        this.channel = options ? options.channel : undefined;
        this.themes = options ? options.themes : undefined;
    }
}
exports.ThemeConfig = ThemeConfig;
