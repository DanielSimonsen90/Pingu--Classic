import { GuildMember, Guild, Role } from 'discord.js';

/** Custom GuildMember */
export class PGuildMember {
    constructor(member: GuildMember) {
        this.id = member.id;
        this.user = member.user.tag;
    }
    public id: string
    public user: string
    public toString() {
        return `<@${this.id}>`;
    }
}

//#region Decidables
abstract class Decidable {
    constructor(value: string, id: string, author: PGuildMember) {
        this.value = value;
        this.id = id;
        this.author = author;
    }
    public value: string
    public id: string
    public author: PGuildMember
}
abstract class DecidableApproved extends Decidable {
    public approved: boolean
}
//#endregion

//#region extends Decideables
export class Suggestion extends DecidableApproved{
    public decidedBy: PGuildMember
    public Decide(approved: boolean, decidedBy: PGuildMember) {
        this.approved = approved;
        this.decidedBy = decidedBy;
    }
}
export class Poll extends DecidableApproved{
    public YesVotes: number
    public NoVotes: number
    public Decide(yesVotes: number, noVotes: number) {
        this.YesVotes = yesVotes;
        this.NoVotes = noVotes;
        if (this.YesVotes == this.NoVotes) return;
        this.approved = this.YesVotes > this.NoVotes; 
    }
}
export class Giveaway extends Decidable{
    constructor(value: string, id: string, author: PGuildMember) {
        super(value, id, author);
        this.winners = new Array<PGuildMember>();
    }
    public winners: PGuildMember[]
}
//#endregion

export class GiveawayConfig {
    constructor() {
        this.firstTimeExecuted = true;
        this.hostRole = undefined;
        this.winnerRole = undefined;
    }
    public firstTimeExecuted: boolean;
    public hostRole: Role;
    public winnerRole: Role;
    public giveaways: Giveaway[] 
    public SetGiveawaysArray() { 
        this.giveaways = new Array<Giveaway>();
    }
}

export class PinguGuild {
    constructor(guild: Guild) {
        this.guildName = guild.name;
        this.guildID = guild.id;
        this.guildOwner = new PGuildMember(guild.owner);
        const { Prefix } = require('./config.json');
        this.botPrefix = Prefix;
        this.embedColor = 0;
        this.giveawayConfig = new GiveawayConfig();
        this.polls = new Array<Poll>();
        this.suggestions = new Array<Suggestion>();
        if (guild.id == '405763731079823380')
            this.themeWinners = new Array<PGuildMember>();
    }
    public guildName: string
    public guildID: string
    public guildOwner: PGuildMember
    public embedColor: number
    public botPrefix: string
    public giveawayConfig: GiveawayConfig
    public polls: Poll[]
    public suggestions: Suggestion[]
    public themeWinners: PGuildMember[]
}
