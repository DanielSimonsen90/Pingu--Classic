import { Client, Guild, Util } from 'discord.js';
import { ToPinguClient } from '../../pingu/client/PinguClient';

export class PClient {
    constructor(client: Client, guild: Guild) {
        const pinguClient = ToPinguClient(client);

        this._id = client.user.id;
        this.displayName = guild.me.displayName;

        const botRole = guild.me.roles.cache.find(r => r.managed);
        
        this.embedColor = botRole?.color || Util.resolveColor(guild.me.displayHexColor) || pinguClient.DefaultEmbedColor;
        this.prefix = pinguClient.DefaultPrefix;
    }
    public displayName: string
    public embedColor: number
    public prefix: string
    public _id: string
}

export default PClient;