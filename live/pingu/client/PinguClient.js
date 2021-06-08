"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguClient = exports.ToPinguClient = exports.Clients = void 0;
const discord_js_1 = require("discord.js");
const fs = require("fs");
exports.Clients = {
    PinguID: '562176550674366464',
    BetaID: '778288722055659520'
};
function ToPinguClient(client) {
    return client;
}
exports.ToPinguClient = ToPinguClient;
const PinguLibrary_1 = require("../library/PinguLibrary");
const handlers_1 = require("../handlers");
const Config_1 = require("../../helpers/Config");
class PinguClient extends discord_js_1.Client {
    constructor(config, subscribedEvents, commandsPath, evensPath, options) {
        super(options);
        this.commands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.DefaultEmbedColor = 3447003;
        this.config = new Config_1.Config(config);
        this.subscribedEvents = subscribedEvents.map(v => v == 'ready' ? 'onready' :
            v == 'debug' ? 'ondebug' :
                v).sort();
        if (commandsPath)
            this.HandlePath(commandsPath, 'command');
        if (evensPath)
            this.HandlePath(evensPath, 'event');
    }
    static ToPinguClient(client) { return ToPinguClient(client); }
    //Public properties
    get id() { return this.user.id; }
    //Pubic methods
    setActivity(options) {
        if (options)
            return this.user.setActivity(options);
        class Activity {
            constructor(text, type) {
                this.text = text;
                this.type = type;
            }
        }
        let date = {
            day: new Date(Date.now()).getDate(),
            month: new Date(Date.now()).getMonth() + 1,
            year: new Date(Date.now()).getFullYear()
        };
        var activity = this.isLive ? new Activity('your screams for', 'LISTENING') : new Activity('Danho cry over bad code', 'WATCHING');
        if (date.month == 12)
            activity = date.day < 26 ?
                new Activity('Jingle Bells...', 'LISTENING') :
                new Activity('fireworks go boom', 'WATCHING');
        else if (date.month == 5)
            activity =
                date.day == 3 ? new Activity(`Danho's birthday wishes`, 'LISTENING') :
                    date.day == 4 ? new Activity('Star Wars', 'WATCHING') : null;
        let Danho = PinguLibrary_1.Developers.get('Danho');
        let DanhoStream = Danho.presence.activities.find(a => a.type == 'STREAMING');
        if (DanhoStream)
            return this.user.setActivity({
                name: DanhoStream.details,
                type: DanhoStream.type,
                url: DanhoStream.url
            });
        if (!activity)
            activity = new Activity('your screams for', 'LISTENING');
        return this.user.setActivity({
            name: activity.text + ` ${this.DefaultPrefix}help`,
            type: activity.type
        });
    }
    get isLive() { return this.user.id == PinguClient.Clients.PinguID; }
    toPClient(pGuild) {
        return pGuild.clients.find(c => c && c._id == this.user.id);
    }
    emit(key, ...args) {
        const chosenEvents = ['chosenUser', 'chosenGuild'];
        if (chosenEvents.includes(key))
            return PinguLibrary_1.AchievementCheckType(this, key.substring(6).toUpperCase(), //cut away "chosen"
            args[0], 'EVENT', key, (function getConfig() {
                switch (key) {
                    case 'chosenUser': return args[1] && args[1].achievementConfig;
                    case 'chosenGuild': return args[1].settings.config.achievements;
                    default: return null;
                }
            })(), 'EVENT', args) != null;
        else if (key == 'mostKnownUser')
            return PinguLibrary_1.AchievementCheck(this, { user: args[0] }, 'EVENT', 'mostKnownUser', args) != null;
        return super.emit(key, ...args);
    }
    login(token) {
        const _super = Object.create(null, {
            login: { get: () => super.login }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield _super.login.call(this, token);
            this.DefaultPrefix = this.isLive || !this.config.BetaPrefix ? this.config.Prefix : this.config.BetaPrefix;
            return result;
        });
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
                        if (!module.name || !this.subscribedEvents.includes(module.name))
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
        if (this.subscribedEvents.includes(caller))
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
//Statics
PinguClient.Clients = exports.Clients;
exports.default = PinguClient;
