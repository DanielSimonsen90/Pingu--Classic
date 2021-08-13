import { Base, Snowflake, Collection, TextChannel, Message } from 'discord.js';
interface IName {
    name?: string;
    tag?: string;
}
export interface BaseT extends Base, IName {
    id: Snowflake;
}
export interface BasePT extends IName {
    _id: Snowflake;
}
export interface BaseManager<T> {
    fetch(id: Snowflake): Promise<T>;
    cache: Collection<Snowflake, T>;
}
export declare type SavedItems = 'PinguUser' | 'PinguGuildMember' | 'PinguGuild';
import BasePinguClient from '../client/BasePinguClient';
import Reason from '../../helpers/Reason';
export declare abstract class IPinguCollection<T extends BaseT, PT extends BasePT> {
    constructor(client: BasePinguClient, logChannelName: string, itemName: SavedItems, newPT: (item: T, client: BasePinguClient) => PT, typeManager: (client: BasePinguClient, pItem: PT) => BaseManager<T>);
    protected _client: BasePinguClient;
    protected _inner: Collection<Snowflake, PT>;
    protected _itemName: SavedItems;
    protected _logChannelName: string;
    get logChannel(): TextChannel;
    protected _newPT: (item: T, client: BasePinguClient) => PT;
    protected _typeManager: (client: BasePinguClient, pItem: PT) => BaseManager<T>;
    abstract add(item: T, scriptName: string, reason: string): Promise<PT>;
    abstract update(pItem: PT, scriptName: string, reason: string): Promise<PT>;
    abstract delete(item: T, scriptName: string, reason: string): Promise<this>;
    abstract refresh(client?: BasePinguClient): Promise<this>;
    get(item: T): PT;
    array(): PT[];
    find(predicate: (pItem: PT, item: T, index: number, self: this) => boolean): PT;
    has(item: T): boolean;
    log(script: string, reason: Reason, err?: Error): Promise<Message>;
}
export default IPinguCollection;
