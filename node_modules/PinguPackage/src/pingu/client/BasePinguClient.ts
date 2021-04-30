import { ActivityOptions, ActivityType, Client, ClientEvents, ClientOptions, Collection } from "discord.js";
export type BaseSubscribedEvents = 'Discord';
export const Clients = {
    PinguID: '562176550674366464',
    BetaID: '778288722055659520'
}

import PinguCommand from "../handlers/PinguCommand";
import { IConfigRequirements, Config } from "../../helpers/Config";
import { Developers } from "../library/PinguLibrary";
import PinguEvent from "../handlers/PinguEvent";
export class BasePinguClient<Events extends string[]> extends Client {
    constructor(config: IConfigRequirements, subscribedEvents: Collection<BaseSubscribedEvents, [keyof ClientEvents]>, options?: ClientOptions) {
        super(options);
        this.config = new Config(config);
        this.subscribedEvents = subscribedEvents;
    }

    public get id() { return this.user.id; }
    public get isLive() { return this.user.id == Clients.PinguID }
    
    public commands: Collection<string, PinguCommand>
    public events: Collection<BaseSubscribedEvents, PinguEvent<keyof ClientEvents>>
    public subscribedEvents: Collection<BaseSubscribedEvents, [keyof ClientEvents]>;
    public DefaultEmbedColor = 3447003;
    public DefaultPrefix: string;
    public config: Config;

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
}

export default BasePinguClient;