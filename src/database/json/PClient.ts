import { Client, Guild } from 'discord.js';
import { ToPinguClient } from '../../pingu/client/PinguClient';

export class PClient {
    constructor(client: Client, guild: Guild) {
        const pinguClient = ToPinguClient(client);

        this._id = client.user.id;
        this.displayName = guild.me.displayName;

        this.embedColor = guild.me.roles.cache.find(role => role.managed).color || pinguClient.DefaultEmbedColor;
        this.prefix = pinguClient.DefaultPrefix;
    }
    public displayName: string
    public embedColor: number
    public prefix: string
    public _id: string
}