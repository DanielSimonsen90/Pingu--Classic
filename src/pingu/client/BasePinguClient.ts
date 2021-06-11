import { ActivityOptions, ActivityType, Client, ClientEvents, ClientOptions, Collection } from "discord.js";
export const Clients = {
    PinguID: '562176550674366464',
    BetaID: '778288722055659520'
}

import PinguCommand from "../handlers/PinguCommand";
import IConfigRequirements from "../../helpers/Config";
import { Developers } from "../library/PinguLibrary";
import PinguHandler from "../handlers/PinguHandler";

export abstract class BasePinguClient<Events extends ClientEvents> extends Client {
    constructor(config: IConfigRequirements, subscribedEvents: Array<keyof ClientEvents>, commandsPath?: string, eventsPath?: string, options?: ClientOptions) {
        super(options);
        this.config = config;
        this.subscribedEvents = subscribedEvents;

        if (commandsPath) this.HandlePath(commandsPath, 'command');
        if (eventsPath) this.HandlePath(eventsPath, 'event');
    }

    public get id() { 
        return this.user.id; 
    }
    public get isLive() { 
        return this.user.id == Clients.PinguID 
    }
    
    public commands: Collection<string, PinguHandler>;
    public events: Collection<string | keyof Events, PinguHandler>;
    public subscribedEvents: Array<string | keyof Events>;

    public DefaultEmbedColor = 3447003;
    public DefaultPrefix: string;
    public config: IConfigRequirements;

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

        return this.user.setActivity({
            name: activity.text + ` ${this.DefaultPrefix}help`, 
            type: activity.type 
        });
    }

    public async login(token?: string){
        let result = await super.login(token);        
        this.DefaultPrefix = this.isLive || !this.config.BetaPrefix ? this.config.Prefix : this.config.BetaPrefix;
        return result;
    }

    protected abstract HandlePath(path: string, type: 'command' | 'event'): void;
}

export default BasePinguClient;