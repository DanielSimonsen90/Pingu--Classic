"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguClient = exports.ToPinguClient = void 0;
const discord_js_1 = require("discord.js");
const fs = require("fs");
function ToPinguClient(client) {
    return client;
}
exports.ToPinguClient = ToPinguClient;
const BasePinguClient_1 = require("./BasePinguClient");
const PinguLibrary_1 = require("../library/PinguLibrary");
const handlers_1 = require("../handlers");
class PinguClient extends BasePinguClient_1.default {
    constructor(config, subscribedEvents, commandsPath, eventsPath, options) {
        super(config, subscribedEvents, commandsPath, eventsPath, options);
        //Public properties
        this.commands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
    }
    //Statics
    static ToPinguClient(client) { return ToPinguClient(client); }
    //Pubic methods
    toPClient(pGuild) {
        return pGuild.clients.find(c => c && c._id == this.user.id);
    }
    emit(key, ...args) {
        return super.emit(key, ...args);
    }
    //Private methods
    HandlePath(path, type) {
        let collection = fs.readdirSync(path);
        for (var file of collection) {
            try {
                if (file.endsWith(`.js`)) {
                    let module = require(`../../../../../${path}/${file}`);
                    module.path = `${path.substring(1, path.length)}/${file}`;
                    if (type == 'event') {
                        if (!module.name || !this.subscribedEvents.find(e => module.name == e))
                            continue;
                        const type = module.name;
                        const event = module;
                        this.events.set(event.name, event);
                        // this.on(event.name as keyof ClientEvents, (...args) => this.handleEvent(event.name as keyof ClientEvents, ...args));
                        let { caller } = this.getEventParams(this, event.name); //Get original event
                        this.on(caller, (...params) => {
                            let pinguEventStuff = this.getEventParams(this, event.name, ...params); //Get Pingu event
                            this.handleEvent(event.name, ...pinguEventStuff.args); //Handle as Pingu event
                        });
                    }
                    else if (type == 'command')
                        this.commands.set(module.name, module);
                    else
                        PinguLibrary_1.errorLog(this, `"${type}" was not recognized!`);
                }
                else if (file.endsWith('.png') || file.toLowerCase().includes('archived'))
                    continue;
                else
                    this.HandlePath(`${path}/${file}`, type);
            }
            catch (err) {
                PinguLibrary_1.DanhoDM(`"${file}" threw an exception:\n${err.message}\n${err.stack}\n`);
            }
        }
    }
    handleEvent(caller, ...args) {
        if (this.subscribedEvents.find(e => e == caller))
            handlers_1.PinguEvent.HandleEvent(caller, this, this.events.get(caller).path, ...args);
        return this;
    }
    getEventParams(client, caller, ...args) {
        switch (caller) {
            case 'ready':
            case 'onready': return { caller: (caller == 'onready' ? 'ready' : caller), args: [client] };
            case 'debug':
            case 'ondebug': return { caller: (caller == 'ondebug' ? 'debug' : caller), args: [client] };
            default: return { caller: caller, args: args };
        }
    }
}
exports.PinguClient = PinguClient;
exports.default = PinguClient;
