import { ActivityOptions, Client, ClientEvents, ClientOptions, Collection } from "discord.js";
export declare const Clients: {
    PinguID: string;
    BetaID: string;
};
import IConfigRequirements from "../../helpers/Config";
import PinguHandler from "../handlers/PinguHandler";
export declare abstract class BasePinguClient<Events extends ClientEvents> extends Client {
    constructor(config: IConfigRequirements, subscribedEvents: Array<keyof ClientEvents>, commandsPath?: string, eventsPath?: string, options?: ClientOptions);
    get id(): string;
    get isLive(): boolean;
    commands: Collection<string, PinguHandler>;
    events: Collection<string | keyof Events, PinguHandler>;
    subscribedEvents: (string | keyof Events)[];
    DefaultEmbedColor: number;
    DefaultPrefix: string;
    config: IConfigRequirements;
    setActivity(options?: ActivityOptions): Promise<import("discord.js").Presence>;
    login(token?: string): Promise<string>;
    protected abstract HandlePath(path: string, type: 'command' | 'event'): void;
}
export default BasePinguClient;
