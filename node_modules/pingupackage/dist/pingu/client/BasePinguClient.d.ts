import { ClientOptions, Collection, PermissionString } from "discord.js";
import PinguHandler from "../handlers/PinguHandler";
import { DiscordIntentEvents, Events } from '../../helpers/IntentEvents';
import IConfigRequirements from "../../helpers/Config";
import PinguClientShell from "./PinguClientShell";
export declare abstract class BasePinguClient<Intents extends DiscordIntentEvents> extends PinguClientShell {
    constructor(config: IConfigRequirements, permissions: Array<PermissionString>, intents: Array<keyof Intents>, subscribedEvents: Array<Events<Intents>>, dirname: string, commandsPath?: string, eventsPath?: string, options?: ClientOptions);
    commands: Collection<string, PinguHandler>;
    events: Collection<keyof Intents, PinguHandler>;
    subscribedEvents: Events<Intents>[];
    get intents(): (keyof Intents)[];
    private _intents;
}
export default BasePinguClient;
