import { ActivityOptions, Client, ClientEvents, ClientOptions, Collection } from "discord.js";
export declare const Clients: {
    PinguID: string;
    BetaID: string;
};
export declare function ToPinguClient(client: Client): PinguClient;
import { PinguGuild } from '../guild/PinguGuild';
import { PinguCommand, PinguEvent, PinguClientEvents } from '../handlers';
import { IConfigRequirements, Config } from '../../helpers/Config';
export declare class PinguClient extends Client {
    static Clients: {
        PinguID: string;
        BetaID: string;
    };
    static ToPinguClient(client: Client): PinguClient;
    constructor(config: IConfigRequirements, subscribedEvents: [keyof PinguClientEvents], commandsPath?: string, evensPath?: string, options?: ClientOptions);
    get id(): string;
    commands: Collection<string, PinguCommand>;
    events: Collection<string, PinguEvent<keyof PinguClientEvents>>;
    DefaultEmbedColor: number;
    DefaultPrefix: string;
    subscribedEvents: [keyof PinguClientEvents];
    config: Config;
    setActivity(options?: ActivityOptions): Promise<import("discord.js").Presence>;
    get isLive(): boolean;
    toPClient(pGuild: PinguGuild): import("PinguPackage/src").PClient;
    emit<PCE extends keyof PinguClientEvents, CE extends keyof ClientEvents>(key: PCE, ...args: PinguClientEvents[PCE]): boolean;
    login(token?: string): Promise<string>;
    private HandlePath;
    private handleEvent;
    private getEventParams;
}
