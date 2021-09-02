"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguClientBase = void 0;
const discord_js_1 = require("discord.js");
const PinguClientShell_1 = require("./PinguClientShell");
class PinguClientBase extends PinguClientShell_1.default {
    constructor(config, permissions, intents, subscribedEvents, dirname, commandsPath, eventsPath, options) {
        super(config, permissions, {
            intents: intents,
            ...options
        });
        this.subscribedEvents = subscribedEvents;
        this._intents = intents;
        if (!dirname.toLowerCase().startsWith('c:'))
            throw new Error('Incorrect dirname; use __dirname!');
        [commandsPath, eventsPath]
            .map(path => path && `${dirname}\\${path.replace(/^.\//, '')}`)
            .forEach((path, i) => this.handlePath(path, i == 0 ? 'command' : 'event'));
    }
    commands = new discord_js_1.Collection();
    events = new discord_js_1.Collection();
    subscribedEvents = new Array();
    get intents() {
        return this._intents;
    }
    _intents;
}
exports.PinguClientBase = PinguClientBase;
exports.default = PinguClientBase;
