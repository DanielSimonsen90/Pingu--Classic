import { GuildMember, Guild } from 'discord.js';

/** Custom GuildMember */
export class PGuildMember {
    constructor(member: GuildMember) {
        this.id = member.id;
        this.user = member.user.tag;
    }
    public id: string
    public user: string
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

//Insert custom GuildMember here

export class PinguGuild {
    constructor(guild: Guild) {
        this.guildName = guild.name;
        this.guildID = guild.id;
        this.guildOwner = new PGuildMember(guild.owner);
        const { Prefix } = require('./config.json');
        this.botPrefix = Prefix;
        this.embedColor = 0;
        this.giveaways = new Array<Giveaway>();
        this.polls = new Array<Poll>();
        this.suggestions = new Array<Suggestion>();
        this.themeWinners = new Array<PGuildMember>();
    }
    public guildName: string
    public guildID: string
    public guildOwner: PGuildMember
    public embedColor: number
    public botPrefix: string

    public giveaways: Giveaway[] 
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
    public polls: Poll[]
    public suggestions: Suggestion[]
    public themeWinners: PGuildMember[]
}
