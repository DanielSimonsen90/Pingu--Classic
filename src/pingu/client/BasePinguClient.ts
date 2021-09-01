import { ClientOptions, Collection, PermissionString } from "discord.js";
import PinguHandler from "../handlers/PinguHandler";
import { DiscordIntentEvents, Events } from '../../helpers/IntentEvents';
import IConfigRequirements from "../../helpers/Config";
import PinguClientShell from "./PinguClientShell";

export abstract class BasePinguClient<Intents extends DiscordIntentEvents> extends PinguClientShell {
    constructor(
        config: IConfigRequirements,  
        permissions: Array<PermissionString>,
        intents: Array<keyof Intents>,
        subscribedEvents: Array<Events<Intents>>, 
        dirname: string,
        commandsPath?: string, 
        eventsPath?: string, 
        options?: ClientOptions
    ) {
        super(config, permissions, options);

        this.subscribedEvents = subscribedEvents;
        this._intents = intents;

        if (!dirname.toLowerCase().startsWith('c:')) throw new Error('Incorrect dirname; use __dirname!');

        [commandsPath, eventsPath]
            .map(path => path && `${dirname}\\${path.replace(/^.\//, '')}`)
            .forEach((path, i) => this.handlePath(path, i == 0 ? 'command' : 'event'));
    }

    
    public commands = new Collection<string, PinguHandler>();
    public events = new Collection<keyof Intents, PinguHandler>();
    public subscribedEvents = new Array<Events<Intents>>();
    public get intents() {
        return this._intents
    }
    
    private _intents: Array<keyof Intents>
}

export default BasePinguClient;