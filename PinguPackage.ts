import { GuildMember, User, Guild } from 'discord.js';


abstract class Decidable {
    constructor(value: string, id: number, author: User | GuildMember) {
        this.Value = value;
        this.ID = id;
        this.Author = author;
    }
    public Value: string
    public ID: number
    public Approved: boolean
    public Author: User | GuildMember
}

export class Suggestion extends Decidable{
    public DecidedBy: User | GuildMember
    public Decide(approved: boolean, decidedBy: User | GuildMember) {
        this.Approved = approved;
        this.DecidedBy = decidedBy;
    }
}

export class Poll extends Decidable{
    public YesVotes: number
    public NoVotes: number
    public Decide(yesVotes: number, noVotes: number) {
        this.YesVotes = yesVotes;
        this.NoVotes = noVotes;
        if (this.YesVotes == this.NoVotes) return;
        this.Approved = this.YesVotes > this.NoVotes; 
    }
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
        this.GiveawayWinners = new Array<GuildMember>();
        this.Polls = new Array<Poll>();
        this.Suggestions = new Array<Suggestion>();
        this.ThemeWinners = new Array<GuildMember>();
    }
    public guildOwner: object
    public guildID: string
    public guildName: string
    public EmbedColor: number
    public BotPrefix: string

    public GiveawayWinners: GuildMember[] 
    /*^^ Include first-time using *giveaway:
            - Giveaway Host:
                (Do you have a Giveaway Host role?) {
                    Please tag the role: [Find role in guild]   
                }
                else {
                    (Do you want one?)  {
                        Create Giveaways role
                    }
                    else {
                        return; (Set to roles with Administrator permission)
                    }
                }
                Save Giveaway Host role in guilds.json
            - Giveaway Winner role:
                (Would you like a giveaway winner role?) {
                    (Do you have one?) {
                        Please tag the role: [Find role in guild]   
                    }
                    else {
                        Create Giveaway Winner role
                    }
                    Save Giveaway winner role in guilds.json
                }
    */
    public Polls: Poll[]
    public Suggestions: Suggestion[]
    public ThemeWinners: GuildMember[]
}
