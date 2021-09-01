"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePinguClient = void 0;
const discord_js_1 = require("discord.js");
const PinguClientShell_1 = require("./PinguClientShell");
class BasePinguClient extends PinguClientShell_1.default {
    constructor(config, permissions, intents, subscribedEvents, dirname, commandsPath, eventsPath, options) {
        super(config, permissions, options);
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
exports.BasePinguClient = BasePinguClient;
exports.default = BasePinguClient;
