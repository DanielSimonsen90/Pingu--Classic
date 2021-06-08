import { ActivityOptions, ActivityType, Client, ClientEvents, ClientOptions, Collection } from "discord.js";
import * as fs from 'fs';


export function ToPinguClient(client: Client): PinguClient {
    return client as PinguClient;
}

import BasePinguClient from "./BasePinguClient";
import { errorLog, DanhoDM, Developers, AchievementCheckType, AchievementCheck, consoleLog } from '../library/PinguLibrary';
import PinguGuild from '../guild/PinguGuild';
import { PinguCommand, PinguEvent, PinguEvents, SubscribedEvents, PinguClientEvents } from '../handlers';
import { IConfigRequirements, Config } from '../../helpers/Config';

export class PinguClient extends BasePinguClient<[keyof PinguClientEvents]> {
    //Statics
    public static ToPinguClient(client: Client) { return ToPinguClient(client); }

    constructor(config: IConfigRequirements, subscribedEvents: Collection<SubscribedEvents, keyof PinguClientEvents>, commandsPath?: string, evensPath?: string, options?: ClientOptions) {
        super(config, subscribedEvents as any, options);

        if (commandsPath) this.HandlePath(commandsPath, 'command');
        if (evensPath) this.HandlePath(evensPath, 'event');
    }

    //Public properties
    public commands = new Collection<string, PinguCommand>();
    public events = new Collection<string, PinguEvent<keyof PinguClientEvents>>();
    public subscribedEvents: Collection<SubscribedEvents, keyof PinguClientEvents>;

    //Pubic methods

    public toPClient(pGuild: PinguGuild) {
        return pGuild.clients.find(c => c && c._id == this.user.id);
    }

    public emit<PCE extends keyof PinguClientEvents, CE extends keyof ClientEvents>(key: PCE, ...args: PinguClientEvents[PCE]) {
        if (this.subscribedEvents.get('Discord').includes(key))
            return super.emit(
                key as unknown as CE, 
                ...args as unknown as ClientEvents[CE]
            );
        
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
                        if (!module.name || !this.subscribedEvents.find(e => module.name as keyof PinguClientEvents == e)) continue;

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
        if (this.subscribedEvents.find(e => e == caller)) 
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
export default PinguClient;