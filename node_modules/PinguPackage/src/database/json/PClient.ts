import { Guild, Util } from 'discord.js';

export class PClient {
    constructor(guild: Guild) {
        const pinguClient = guild.client;

        this._id = pinguClient.id
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