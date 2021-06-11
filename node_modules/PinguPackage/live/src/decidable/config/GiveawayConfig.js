"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveawayConfig = void 0;
class GiveawayConfig {
    constructor(options) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.allowSameWinner = options ? options.allowSameWinner : undefined;
        this.hostRole = options ? options.hostRole : undefined;
        this.winnerRole = options ? options.winnerRole : undefined;
        this.channel = options ? options.channel : undefined;
        this.giveaways = options ? options.giveaways : undefined;
    }
}
exports.GiveawayConfig = GiveawayConfig;
