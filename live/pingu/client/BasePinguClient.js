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
exports.BasePinguClient = exports.Clients = void 0;
const discord_js_1 = require("discord.js");
exports.Clients = {
    PinguID: '562176550674366464',
    BetaID: '778288722055659520'
};
const PinguLibrary_1 = require("../library/PinguLibrary");
class BasePinguClient extends discord_js_1.Client {
    constructor(config, subscribedEvents, commandsPath, eventsPath, options) {
        super(options);
        this.DefaultEmbedColor = 3447003;
        this.config = config;
        this.subscribedEvents = subscribedEvents;
        if (commandsPath)
            this.HandlePath(commandsPath, 'command');
        if (eventsPath)
            this.HandlePath(eventsPath, 'event');
    }
    get id() {
        return this.user.id;
    }
    get isLive() {
        return this.user.id == exports.Clients.PinguID;
    }
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
}
exports.BasePinguClient = BasePinguClient;
exports.default = BasePinguClient;
