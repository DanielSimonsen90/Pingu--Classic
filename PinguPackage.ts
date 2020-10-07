import { GuildMember, Guild, Role } from 'discord.js';

//#region Custom Pingu classes
export class PGuildMember {
    constructor(member: GuildMember) {
        this.id = member.id;
        this.user = member.user.tag;
        this.DiscordGuildMember = member;
    }
    private DiscordGuildMember: GuildMember
    public id: string
    public user: string
    public toString() { 
        return `<@${this.id}>`;
    }
    public toGuildMember() { return this.DiscordGuildMember; }
}
export class PRole {
    constructor(role: Role) {
        try {
            this.name = role.name;
            this.id = role.id;
            this.DiscordRole = role;
        } catch { return undefined; }
    }
    private DiscordRole: Role;
    public name: string;
    public id: string;
    public toRole() { return this.DiscordRole; }
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
        this.pollConfig = new PollConfig;
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
    public pollConfig: PollConfig
    public suggestions: Suggestion[]
    public themeWinners: PGuildMember[]
}
//#endregion

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

//#region extends Decideables
export class Suggestion extends Decidable {
    public Decide(approved: boolean, decidedBy: PGuildMember) {
        this.approved = approved;
        this.decidedBy = decidedBy;
    }
    public decidedBy: PGuildMember
    public approved: boolean
}
export class Poll extends Decidable{
    public YesVotes: number
    public NoVotes: number
    public approved: string
    public Decide(yesVotes: number, noVotes: number, approved: string) {
        this.YesVotes = yesVotes;
        this.NoVotes = noVotes;
        if (this.YesVotes == this.NoVotes) return;
        this.approved = approved;
    }
}
export class Giveaway extends Decidable {
    constructor(value: string, id: string, author: PGuildMember) {
        super(value, id, author);
        this.winners = new Array<PGuildMember>();
    }
    public winners: PGuildMember[]
}
//#endregion

//#region PollConfig
interface PollConfigOptions {
    firstTimeExecuted: boolean;
    pollRole: PRole;
    polls: Poll[];
}
export class PollConfig implements PollConfigOptions {
    constructor(options?: PollConfigOptions) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.pollRole = options ? options.pollRole : undefined;
        if (options) this.polls = options.polls;
    }
    firstTimeExecuted: boolean;
    pollRole: PRole;
    polls: Poll[];
}
//#endregion

//#region GiveawayConfig
interface GiveawayConfigOptions {
    firstTimeExecuted: boolean;
    allowSameWinner: boolean;
    hostRole: PRole;
    winnerRole: PRole;
    giveaways: Giveaway[];
}
export class GiveawayConfig implements GiveawayConfigOptions{
    constructor(options?: GiveawayConfigOptions) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.allowSameWinner = options ? options.allowSameWinner : undefined;
        this.hostRole = options ? options.hostRole : undefined;
        this.winnerRole = options ? options.winnerRole : undefined;
        if (options) this.giveaways = options.giveaways;
    }
    firstTimeExecuted: boolean;
    allowSameWinner: boolean;
    hostRole: PRole;
    winnerRole: PRole;
    giveaways: Giveaway[];
}
export class TimeLeftObject {
    constructor(Now: Date, EndsAt: Date) {
        /*
        console.clear();
        console.log(`EndsAt: ${EndsAt.getDate()}d ${EndsAt.getHours()}h ${EndsAt.getMinutes()}m ${EndsAt.getSeconds()}s`)
        console.log(`Now: ${Now.getDate()}d ${Now.getHours()}h ${Now.getMinutes()}m ${Now.getSeconds()}s`)
        console.log(`this.days = Math.round(${EndsAt.getDate()} - ${Now.getDate()})`)
        console.log(`this.hours = Math.round(${EndsAt.getHours()} - ${Now.getHours()})`)
        console.log(`this.minutes = Math.round(${EndsAt.getMinutes()} - ${Now.getMinutes()})`)
        console.log(`this.seconds = Math.round(${EndsAt.getSeconds()} - ${Now.getSeconds()})`)
        */

        const Minutes = this.includesMinus(Math.round(EndsAt.getSeconds() - Now.getSeconds()), 60, EndsAt.getMinutes(), Now.getMinutes());
        const Hours = this.includesMinus(Minutes[0], 60, EndsAt.getHours(), Now.getHours());
        const Days = this.includesMinus(Hours[0], 24, EndsAt.getDate(), Now.getDate());

        this.seconds = Minutes[1];
        this.minutes = Hours[1];
        this.hours = Days[1];
        this.days = Days[0];
    }
    public days: number;
    public hours: number;
    public minutes: number;
    public seconds: number;

    /**Minus check, cus sometimes preprop goes to minus, while preprop isn't being subtracted
     * @param preprop Previous property, for this.minutes, this would be this.seconds
     * @param maxPreProp Max number preprop can be, everything is 60 but this.hours is 24
     * @param EndsAt EndsAt variable
     * @param Now Now variable*/
    private includesMinus(preprop: number, maxPreProp: number, EndsAt: number, Now: number) {
        const returnValue = Math.round(EndsAt - Now);
        if (preprop.toString().includes('-')) {
            preprop = maxPreProp + preprop;
            return [returnValue - 1, preprop];
        }
        return [returnValue, preprop];
    }
    public toString() {
        //console.log(`${this.days}d ${this.hours}h ${this.minutes}m ${this.seconds}s`);
        let returnMsg = '';
        const times = [this.days, this.hours, this.minutes, this.seconds],
            timeMsg = ["day", "hour", "minute", "second"];

        for (var i = 0; i < times.length; i++)
            if (times[i] > 0) {
                returnMsg += `**${times[i]}** ${timeMsg[i]}`;
                if (times[i] != 1) returnMsg += 's';
                returnMsg += `, `;
            }
        return returnMsg.substring(0, returnMsg.length - 2);
    }
}
//#endregion
