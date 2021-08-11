import { Base, Snowflake, Collection, TextChannel, CategoryChannel, Message } from 'discord.js'

interface IName { name?: string, tag?: string }
export interface BaseT extends Base, IName { id: Snowflake }
export interface BasePT extends IName { _id: Snowflake }
export interface BaseManager<T> { 
    fetch(id: Snowflake): Promise<T>,
    cache: Collection<Snowflake, T>
}

export type SavedItems = 'PinguUser' | 'PinguGuildMember' | 'PinguGuild';
import BasePinguClient from '../client/BasePinguClient';
import Reason from '../../helpers/Reason';

export abstract class IPinguCollection<T extends BaseT, PT extends BasePT> {
    constructor(
        client: BasePinguClient, logChannelName: string, itemName: SavedItems,
        newPT: (item: T, client: BasePinguClient) => PT, typeManager: (client: BasePinguClient, pItem: PT) => BaseManager<T>
    ) {
        this._client = client;
        this._inner = new Collection();
        this._itemName = itemName;
        this._logChannelName = logChannelName;

        this._newPT = newPT;
        this._typeManager = typeManager
    }

    protected _client: BasePinguClient;
    protected _inner: Collection<Snowflake, PT>;
    protected _itemName: SavedItems;
    protected _logChannelName: string;
    public get logChannel() {
        const guild = this._client.guilds.cache.get(this._client.savedServers.get('Pingu Support').id);
        const logChannelCategory = guild.channels.cache.find(c => c.type == 'GUILD_CATEGORY' && c.name.includes('Pingu Logs')) as CategoryChannel;
        return logChannelCategory.children.find(c => c.name.includes(this._logChannelName)) as TextChannel;
    }

    protected _newPT: (item: T, client: BasePinguClient) => PT;
    protected _typeManager: (client: BasePinguClient, pItem: PT) => BaseManager<T>

    public abstract add(item: T, scriptName: string, reason: string): Promise<PT>;
    public abstract update(pItem: PT, scriptName: string, reason: string): Promise<PT>;
    public abstract delete(item: T, scriptName: string, reason: string): Promise<this>;
    public abstract refresh(client?: BasePinguClient): Promise<this>;

    public get(item: T): PT {
        return this._inner.get(item.id);
    }
    public array(): PT[] {
        return [...this._inner.values()];
    }
    public find(predicate: (pItem: PT, item: T, index: number, self: this) => boolean): PT {
        const entries = [...this._inner.values()];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const item = this._typeManager(this._client, entry).cache.get(entry._id);

            if (predicate(entry, item, i, this)) return entry;
        }
        return null;
    }
    public has(item: T): boolean {
        return this._inner.has(item.id);
    }

    public async log(script: string, reason: Reason, err?: Error): Promise<Message> {
        const logType = this._itemName == 'PinguUser' ? 'pUser' : 'pGuild';
        return this._client.log(logType, script, err ? reason.errMsg : reason.succMsg, err);
    }
}

export default IPinguCollection;