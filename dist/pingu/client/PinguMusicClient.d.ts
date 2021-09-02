<<<<<<< HEAD
<<<<<<< HEAD
import { ClientEvents, Collection } from "discord.js";
import PinguMusicCommand, { PinguMusicCommandParams } from '../handlers/PinguMusicCommand';
import PinguMusicEvent, { PinguMusicClientEvents } from '../handlers/PinguMusicEvent';
import { PinguMusicIntentEvents } from '../../helpers/IntentEvents';
=======
import { ClientEvents, ClientOptions, Collection, PermissionString } from "discord.js";
import { PinguClientEvents, PinguMusicCommand, PinguMusicClientEvents, PinguMusicEvent, PinguMusicCommandParams } from '../handlers';
import IConfigRequirements from '../../helpers/Config';
>>>>>>> parent of 92c7bfa (Get events from intents)
=======
import { ClientEvents, ClientOptions, Collection, PermissionString } from "discord.js";
import { PinguClientEvents, PinguMusicCommand, PinguMusicClientEvents, PinguMusicEvent, PinguMusicCommandParams } from '../handlers';
import IConfigRequirements from '../../helpers/Config';
>>>>>>> parent of 92c7bfa (Get events from intents)
import Queue from "../guild/items/music/Queue/Queue";
import PinguClientBase from "./BasePinguClient";
interface VideoThing {
    url: string;
}
<<<<<<< HEAD
<<<<<<< HEAD
export declare class PinguMusicClient extends PinguClientBase<PinguMusicIntentEvents> {
=======
export declare class PinguMusicClient extends BasePinguClient<PinguClientEvents> {
    constructor(config: IConfigRequirements, permissions: PermissionString[], subscribedEvents: [keyof PinguMusicClientEvents], dirname?: string, commandsPath?: string, eventsPath?: string, options?: ClientOptions);
>>>>>>> parent of 92c7bfa (Get events from intents)
=======
export declare class PinguMusicClient extends BasePinguClient<PinguClientEvents> {
    constructor(config: IConfigRequirements, permissions: PermissionString[], subscribedEvents: [keyof PinguMusicClientEvents], dirname?: string, commandsPath?: string, eventsPath?: string, options?: ClientOptions);
>>>>>>> parent of 92c7bfa (Get events from intents)
    queues: Collection<string, Queue>;
    events: Collection<keyof PinguMusicClientEvents, PinguMusicEvent<keyof PinguMusicClientEvents>>;
    commands: Collection<string, PinguMusicCommand>;
    subscribedEvents: Array<keyof PinguMusicClientEvents>;
    emit<PMCE extends keyof PinguMusicClientEvents, CE extends keyof ClientEvents>(key: PMCE, ...args: PinguMusicClientEvents[PMCE]): boolean;
    getVideo(params: PinguMusicCommandParams, url: string, searchType: 'video' | 'playlist', youTube: any, ytdl: any): Promise<VideoThing>;
    protected handlePath(path: string, type: 'command' | 'event'): void;
    protected handleEvent<EventType extends keyof PinguMusicClientEvents>(caller: EventType, ...args: PinguMusicClientEvents[EventType]): this;
}
export default PinguMusicClient;
