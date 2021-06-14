import { Client, ClientEvents, ClientOptions, Collection } from "discord.js";
export declare function ToPinguClient(client: Client): PinguClient;
import BasePinguClient from "./BasePinguClient";
import PinguGuild from '../guild/PinguGuild';
import { PinguCommand, PinguEvent, PinguClientEvents } from '../handlers';
import IConfigRequirements from '../../helpers/Config';
export declare class PinguClient extends BasePinguClient<PinguClientEvents> {
    static ToPinguClient(client: Client): PinguClient;
    static Clients: {
        PinguID: string;
        BetaID: string;
    };
    constructor(config: IConfigRequirements, subscribedEvents?: Array<keyof PinguClientEvents>, commandsPath?: string, eventsPath?: string, options?: ClientOptions);
    commands: Collection<string, PinguCommand>;
    events: Collection<keyof PinguClientEvents, PinguEvent<keyof PinguClientEvents>>;
    subscribedEvents: Array<keyof PinguClientEvents>;
    toPClient(pGuild: PinguGuild): import("PinguPackage/src").PClient;
    emit<PCE extends keyof PinguClientEvents, CE extends keyof ClientEvents>(key: PCE, ...args: PinguClientEvents[PCE]): boolean;
    protected HandlePath(path: string, type: 'command' | 'event'): void;
    private handleEvent;
    private getEventParams;
}
export default PinguClient;
