"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    constructor(config) {
        this.version = 1;
        this.testingMode = false;
        this.updateStats = false;
        this.Prefix = config.Prefix;
        this.BetaPrefix = config.BetaPrefix;
        this.token = config.token;
        this.mongoPass = config.mongoPass;
        this.api_key = config.api_key;
        this.youtube_api = config.youtube_api;
        this.google_custom_search = config.google_custom_search;
        this.emailer = config.emailer;
        this.version = config.version;
        this.testingMode = config.testingMode;
        this.updateStats = config.updateStats;
    }
}
exports.Config = Config;
