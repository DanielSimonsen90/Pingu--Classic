"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguMusicEvent = exports.HandleMusicEvent = void 0;
async function HandleMusicEvent(caller, client, ...args) {
    try {
        var event = client.events.get(caller);
    }
    catch (err) {
        console.error({ err, caller });
        return client.log('error', `Unable to get event for ${caller}`, null, err, {
            params: { caller, args },
            additional: { event }
        });
    }
    if (!event || !event.execute)
        return;
    async function execute() {
        try {
            return event.execute(client, ...args);
        }
        catch (err) {
            client.log('error', `${event.name}.execute`, null, err, {
                params: { caller, args },
                additional: { event }
            });
        }
    }
    await execute().catch(err => {
        return client.log('error', err.message, JSON.stringify(args, null, 2), err, {
            params: { caller, args },
            additional: { event }
        });
    });
}
exports.HandleMusicEvent = HandleMusicEvent;
const PinguHandler_1 = require("./PinguHandler");
class PinguMusicEvent extends PinguHandler_1.default {
    static HandleEvent(caller, client, path, ...args) {
        return HandleMusicEvent(caller, client, ...args);
    }
    constructor(name, execute) {
        super(name);
        this.execute = execute;
    }
    async execute(client, ...args) { return null; }
}
exports.PinguMusicEvent = PinguMusicEvent;
exports.default = PinguMusicEvent;
