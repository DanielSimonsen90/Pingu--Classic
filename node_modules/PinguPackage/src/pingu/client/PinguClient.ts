import { ActivityOptions, ActivityType, Client, ClientEvents, ClientOptions, Collection, User } from "discord.js";
import * as fs from 'fs';

export const Clients = {
    PinguID: '562176550674366464',
    BetaID: '778288722055659520'
}
export function ToPinguClient(client: Client): PinguClient {
    return client as PinguClient;
}

import { errorLog, DanhoDM, Developers, AchievementCheckType, AchievementCheck, consoleLog } from '../library/PinguLibrary';
import { PinguGuild } from '../guild/PinguGuild';
import { GetPUser } from "../user/PinguUser";

import { PinguCommand, PinguEvent, PinguClientEvents } from '../handlers';

import { IConfigRequirements, Config } from '../../helpers/Config';

export class PinguClient extends Client {
    //Statics
    public static Clients = Clients;
    public static ToPinguClient(client: Client) { return ToPinguClient(client); }

    constructor(config: IConfigRequirements, subscribedEvents: [keyof PinguClientEvents], commandsPath?: string, evensPath?: string, options?: ClientOptions) {
        super(options);

        this.config = new Config(config);
        this.subscribedEvents = subscribedEvents.map(v => 
            v == 'ready' ? 'onready' : 
            v == 'debug' ? 'ondebug' : 
            v
        ).sort() as [keyof PinguClientEvents];

        if (commandsPath) this.HandlePath(commandsPath, 'command');
        if (evensPath) this.HandlePath(evensPath, 'event');
    }

    //Public properties
    public get id() { return this.user.id; }
    public commands = new Collection<string, PinguCommand>();
    public events = new Collection<string, PinguEvent<keyof PinguClientEvents>>();
    public DefaultEmbedColor = 3447003;
    public DefaultPrefix: string;
    public subscribedEvents: [keyof PinguClientEvents];
    public config: Config;

    //Pubic methods
    public setActivity(options?: ActivityOptions) {
        if (options) return this.user.setActivity(options);

        class Activity {
            constructor(text: string, type: ActivityType) {
                this.text = text;
                this.type = type;
            }
            public text: string
            public type: ActivityType
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

        let Danho = Developers.get('Danho');
        let DanhoStream = Danho.presence.activities.find(a => a.type == 'STREAMING');
        if (DanhoStream) return this.user.setActivity({
            name: DanhoStream.details,
            type: DanhoStream.type,
            url: DanhoStream.url
        });

        if (!activity) activity = new Activity('your screams for', 'LISTENING');

        this.user.setActivity({
            name: activity.text + ` ${this.DefaultPrefix}help`, 
            type: activity.type 
        });
    }
    public get isLive() { return this.user.id == PinguClient.Clients.PinguID }
    public toPClient(pGuild: PinguGuild) {
        return pGuild.clients.find(c => c && c._id == this.user.id);
    }

    public emit<PCE extends keyof PinguClientEvents, CE extends keyof ClientEvents>(key: PCE, ...args: PinguClientEvents[PCE]) {
        consoleLog(this, `Emitting event: ${key}`);
        const chosenEvents = ['chosenUser', 'chosenGuild'];

        if (chosenEvents.includes(key)) return AchievementCheckType(
            this, 
            key.substring(6).toUpperCase() as any, //cut away "chosen"
            args[0], 
            'EVENT', 
            key, 
            (function getConfig(){
                switch (key) {
                    case 'chosenUser': return (args[1] as any).achievementConfig;
                    case 'chosenGuild': return (args[1] as PinguGuild).settings.config.achievements;
                    default: return null;
                }
            })(), 
            'EVENT',
            args
        ) != null;
        else if (key == 'mostKnownUser') return AchievementCheck(
            this, { user: args[0] }, 'EVENT', 'mostKnownUser', args
        ) != null;

        return super.emit(
            key as unknown as CE, 
            ...args as unknown as ClientEvents[CE]
        );
    }

    public async login(token?: string){
        let result = await super.login(token);        
        this.DefaultPrefix = this.isLive || !this.config.BetaPrefix ? this.config.Prefix : this.config.BetaPrefix;
        return result;
    }

    //Private methods
    private HandlePath(path: string, type: 'command' | 'event') {
        let collection = fs.readdirSync(path);
        for (var file of collection) {
            try {
                if (file.endsWith(`.js`)) {
                    let module = require(`../../../../../${path}/${file}`);
                    module.path = `${path.substring(1, path.length)}/${file}`;

                    if (type == 'event') {
                        if (!module.name || !this.subscribedEvents.includes(module.name as keyof PinguClientEvents)) continue;

                        const type = module.name as keyof PinguClientEvents
                        const event = module as PinguEvent<typeof type>;

                        this.events.set(event.name, event);
                        // this.on(event.name as keyof ClientEvents, (...args) => this.handleEvent(event.name as keyof ClientEvents, ...args));

                        let { caller } = this.getEventParams(this, event.name); //Get original event
                        this.on(caller as keyof ClientEvents, (...params) => { //On original event
                            let pinguEventStuff = this.getEventParams(this, event.name, ...params); //Get Pingu event
                            this.handleEvent(event.name, ...pinguEventStuff.args) //Handle as Pingu event
                        })
                    }
                    else if (type == 'command') this.commands.set(module.name, module as PinguCommand);
                    else errorLog(this, `"${type}" was not recognized!`);
                }
                else if (file.endsWith('.png') || file.toLowerCase().includes('archived')) continue;
                else this.HandlePath(`${path}/${file}`, type);
            } catch (err) {
                DanhoDM(`"${file}" threw an exception:\n${err.message}\n${err.stack}\n`)
            }
        }
    }
    private handleEvent<eventType extends keyof PinguClientEvents>(caller: eventType, ...args: PinguClientEvents[eventType]) {
        if (this.subscribedEvents.includes(caller)) 
            PinguEvent.HandleEvent(caller, this, this.events.get(caller).path, ...args as PinguClientEvents[eventType]);
        return this;
    }

    private getEventParams<eventType extends keyof PinguClientEvents>(client: PinguClient, caller: eventType, ...args: PinguClientEvents[eventType]) {
        switch (caller) {
            case 'ready': case 'onready': return { caller: (caller == 'onready' ? 'ready' : caller) as eventType, args: [client] as PinguClientEvents[eventType] }
            case 'debug': case 'ondebug': return { caller: (caller == 'ondebug' ? 'debug' : caller) as eventType, args: [client] as PinguClientEvents[eventType] }
            default: return { caller: caller as eventType, args: args as PinguClientEvents[eventType] };
        }
    }
}