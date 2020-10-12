import { GuildMember, Guild, Role, Message, TextChannel, VoiceChannel, VoiceConnection, Util } from 'discord.js';
import { videoInfo } from 'ytdl-core';
const fs = require('fs');

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
    //#region Static PinguGuild methods
    public static GetPGuilds(): PinguGuild[] {
        return require('./guilds.json');
    }
    public static GetPGuild(message: Message): PinguGuild {
        return this.GetPGuilds().find(pg => pg.guildID == message.guild.id);
    }
    public static UpdatePGuildsJSON(message: Message, succMsg: string, errMsg: string) {
        fs.writeFile('./guilds.json', '', err => {
            if (err) console.log(err);
            else fs.appendFile('./guilds.json', JSON.stringify(this.GetPGuilds(), null, 4), err => {
                message.client.guilds.cache.find(guild => guild.id == `460926327269359626`).owner.createDM().then(DanhoDM => {
                    if (err) DanhoDM.send(`${errMsg}:\n\n${err}`);
                    else console.log(succMsg);
                });
            });
        });
    }
    public static async UpdatePGuildsJSONAsync(message: Message, succMsg: string, errMsg: string) {
        this.UpdatePGuildsJSON(message, succMsg, errMsg);
    }
    //#endregion

    constructor(guild: Guild) {
        this.guildName = guild.name;
        this.guildID = guild.id;
        this.guildOwner = new PGuildMember(guild.owner);
        const { Prefix } = require('./config.json');
        this.botPrefix = Prefix;
        this.embedColor = 0;
        this.musicQueue = null;
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
    public musicQueue: Queue
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
export class Poll extends Decidable {
    public YesVotes: number
    public NoVotes: number
    public approved: string
    public Decide(yesVotes: number, noVotes: number) {
        this.YesVotes = yesVotes;
        this.NoVotes = noVotes;
        this.approved =
            this.YesVotes > this.NoVotes ? 'Yes' :
                this.NoVotes > this.YesVotes ? 'No' : 'Undecided';
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
export class GiveawayConfig implements GiveawayConfigOptions {
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

//#region Music
export class Queue {
    constructor(logChannel, voiceChannel) {
        this.logChannel = logChannel;
        this.voiceChannel = voiceChannel;
        this.volume = 5;
    }
    public logChannel: TextChannel
    public voiceChannel: VoiceChannel
    public connection: VoiceConnection
    public songs: Array<Song>
    public volume: number
    public playing: true

    /** Switches log channel from initate log channel (channel where play was executed) to newChannel
     * @param newChannel New log channel*/ public switchLogChannel(newChannel: TextChannel) {
        this.logChannel = newChannel;
    }
    /**Sets the connection to the voice channel
     * @param conn*/ public setConnection(conn: VoiceConnection) {
        this.connection = conn;
    }

    /** Adds song to the start of the queue
     * @param song song to add*/ public addFirst(song: Song) {
        this.songs.unshift(song);
    }
    /** Adds song to queue
     * @param song song to add*/ public add(song: Song) {
        this.songs.push(song);
    }
    /** Removes song from queue
     * @param song song to remove*/ public remove(song: Song) {
        this.songs = this.songs.filter(s => s != song);
    }
}
export class Song {
    constructor(videoInfo: videoInfo) {
        this.link = videoInfo.video_url;
        this.title = Util.escapeMarkdown(videoInfo.title);
        this.length = this.GetLength(videoInfo.length_seconds)
        this.endsAt = new Date(Date.now() + parseInt(videoInfo.length_seconds));
    }
    public title: string
    public link: string
    public playing: boolean
    public length: string
    public endsAt: Date

    public getTimeLeft() {
        return new TimeLeftObject(new Date(Date.now()), this.endsAt);
    }
    private GetLength(secondsLength: string) {
        var seconds = parseInt(secondsLength), minutes = 0, hours = 0, final = [];
        final.push(seconds);
        if (seconds > 59) {
            while (seconds > 59) {
                seconds -= 60;
                minutes++;
            }
            final.unshift(minutes);
        }
        if (minutes > 59) {
            while (minutes > 59) {
                minutes -= 60;
                hours++;
            }
            final.unshift(hours);
        }
        return final.join(':').substring(0, final.join(':').length - 1);
    }
}
//#endregion