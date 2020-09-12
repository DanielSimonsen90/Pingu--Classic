import { GuildMember, User, Guild } from 'discord.js';

export class Suggestion {
    public Suggestion: string
    public ID: number
    public Author: User | GuildMember
    public Decision: string
    public DecidedBy: User | GuildMember
}

export class PinguGuilds {
    constructor(guild: Guild) {
        this.guildOwner = {
            id: guild.owner.user.id,
            user: guild.owner.user.tag
        };
        this.guildID = guild.id;
        this.guildName = guild.name;
        this.EmbedColor = 0;
        const { Prefix } = require('./config');
        this.BotPrefix = Prefix;
        this.ThemeWinners = new Array<GuildMember>();
        this.GiveawayWinners = new Array<GuildMember>();
        this.Suggestions = new Array<Suggestion>();
        this.test = "this is test wow";
    }
    private test: string
    private guildOwner: object
    public guildID: string
    public guildName: string
    public EmbedColor: number
    public BotPrefix: string
    public ThemeWinners: GuildMember[]
    public GiveawayWinners: GuildMember[]
    public Suggestions: Suggestion[]
}
