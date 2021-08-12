"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguMusicEvent = exports.HandleEvent = void 0;
async function HandleEvent(caller, client, path, ...args) {
    try {
        var event = require(`../../../../..${path}`);
    }
    catch (err) {
        console.error({ err, caller, path });
        return client.log('error', `Unable to get event for ${caller}`, null, err, {
            params: { caller, path, args },
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
                params: { caller, path, args },
                additional: { event }
            });
        }
    }
    await execute().catch(err => {
        return client.log('error', err.message, JSON.stringify(args, null, 2), err, {
            params: { caller, path, args },
            additional: { event }
        });
    });
}
exports.HandleEvent = HandleEvent;
const PinguHandler_1 = require("./PinguHandler");
class PinguMusicEvent extends PinguHandler_1.default {
    static HandleEvent(caller, client, path, ...args) {
        return HandleEvent(caller, client, path, ...args);
    }
    constructor(name, execute) {
        super(name);
        this.execute = execute;
    }
    name;
    async execute(client, ...args) { return null; }
}
exports.PinguMusicEvent = PinguMusicEvent;
exports.default = PinguMusicEvent;
