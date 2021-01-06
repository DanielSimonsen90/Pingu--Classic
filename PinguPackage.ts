﻿import { ActivityType, Channel, Client, Guild, GuildChannel, GuildMember, Message, MessageEmbed, PermissionString, Role, TextChannel, User, VoiceChannel, VoiceConnection, VoiceState } from 'discord.js';
import { MoreVideoDetails } from 'ytdl-core';
import * as fs from 'fs';

export class Error {
    constructor(err: { message: string, stack: string, fileName: string, lineNumber: string } | any) {
        this.message = err.message;
        this.stack = err.stack;
        this.fileName = err.fileName;
        this.lineNumber = err.lineNumber;
    }

    public message: string
    public stack: string
    public fileName: string
    public lineNumber: string
}
export class DiscordPermissions {
    public static 'CREATE_INSTANT_INVITE' = 'CREATE_INSTANT_INVITE'
    public static 'KICK_MEMBERS' = 'KICK_MEMBERS'
    public static 'BAN_MEMBERS' = 'BAN_MEMBERS'
    public static 'ADMINISTRATOR' = 'ADMINISTRATOR'
    public static 'MANAGE_CHANNELS' = 'MANAGE_CHANNELS'
    public static 'MANAGE_GUILD' = 'MANAGE_GUILD'
    public static 'ADD_REACTIONS' = 'ADD_REACTIONS'
    public static 'VIEW_AUDIT_LOG' = 'VIEW_AUDIT_LOG'
    public static 'PRIORITY_SPEAKER' = 'PRIORITY_SPEAKER'
    public static 'STREAM' = 'STREAM'
    public static 'VIEW_CHANNEL' = 'VIEW_CHANNEL'
    public static 'SEND_MESSAGES' = 'SEND_MESSAGES'
    public static 'SEND_TTS_MESSAGES' = 'SEND_TTS_MESSAGES'
    public static 'MANAGE_MESSAGES' = 'MANAGE_MESSAGES'
    public static 'EMBED_LINKS' = 'EMBED_LINKS'
    public static 'ATTACH_FILES' = 'ATTACH_FILES'
    public static 'READ_MESSAGE_HISTORY' = 'READ_MESSAGE_HISTORY'
    public static 'MENTION_EVERYONE' = 'MENTION_EVERYONE'
    public static 'USE_EXTERNAL_EMOJIS' = 'USE_EXTERNAL_EMOJIS'
    public static 'VIEW_GUILD_INSIGHTS' = 'VIEW_GUILD_INSIGHTS'
    public static 'CONNECT' = 'CONNECT'
    public static 'SPEAK' = 'SPEAK'
    public static 'MUTE_MEMBERS' = 'MUTE_MEMBERS'
    public static 'DEAFEN_MEMBERS' = 'DEAFEN_MEMBERS'
    public static 'MOVE_MEMBERS' = 'MOVE_MEMBERS'
    public static 'USE_VAD' = 'USE_VAD'
    public static 'CHANGE_NICKNAME' = 'CHANGE_NICKNAME'
    public static 'MANAGE_NICKNAMES' = 'MANAGE_NICKNAMES'
    public static 'MANAGE_ROLES' = 'MANAGE_ROLES'
    public static 'MANAGE_WEBHOOKS' = 'MANAGE_WEBHOOKS'
    public static 'MANAGE_EMOJIS' = 'MANAGE_EMOJIS'
}

//#region JSON Classes
export class PItem {
    constructor(object: {id: string, name: string}) {
        this.id = object.id;
        this.name = object.name;
    }
    public id: string
    public name: string
}
export class PGuildMember extends PItem {
    constructor(member: GuildMember) {
        super({
            id: member.id,
            name: member.user.tag
        });
    }
    public toString() {
        return `<@${this.id}>`;
    }
}
export class PRole extends PItem {
    constructor(role: Role) {
        try { super(role) }
        catch { return undefined; }
    }
}
export class PChannel extends PItem {
    constructor(channel: GuildChannel) {
        super(channel);
    }
}
export class PUser extends PItem {
    constructor(user: User) {
        super({ id: user.id, name: user.tag });
    }
}
export class PGuild extends PItem {
    constructor(guild: Guild) {
        super(guild);
    }
}
export class PClient {
    constructor(client: Client, guild: Guild) {
        this.displayName = guild.me.displayName;
    }
    public displayName: string
}

export class PQueue {
    constructor(queue: Queue) {
        this.logChannel = new PChannel(queue.logChannel);
        this.voiceChannel = new PChannel(queue.voiceChannel);
        this.connection = queue.connection.voice;
        this.index = queue.index;
        this.songs = queue.songs;
        this.volume = queue.volume;
        this.client = queue.client;
        this.loop = queue.loop;
        this.playing = queue.playing;
    }

    public logChannel: PChannel
    public voiceChannel: PChannel
    public client: PClient
    public connection: VoiceState
    public index: number
    public songs: Song[]
    public volume: number
    public playing: boolean
    public loop: boolean;

    public async ToQueue(guild: Guild) {
        let queue = new Queue(
            this.client,
            guild.channels.cache.find(c => c.id == this.logChannel.id) as TextChannel,
            guild.channels.cache.find(c => c.id == this.voiceChannel.id) as VoiceChannel,
            this.songs,
            this.playing
        );
        queue.connection = await queue.voiceChannel.join();
        queue.client.displayName = this.client.displayName;
        queue.volume = this.volume;
        queue.loop = this.loop;
        queue.index = this.index;

        return queue;
    }
}
//#endregion

//#region Custom Pingu classes 
export class PinguUser {
    //#region Static PinguUser methods
    public static GetPUsers(): PinguUser[] {
        let userCollection = fs.readdirSync(`./users/`).filter(file => file.endsWith('.json'));
        let pUserArr = [];

        for (var userFile of userCollection)
            pUserArr.push(require(`./users/${userFile}`));
        return pUserArr;
    }
    public static GetPUser(user: User, suppressError?: boolean): PinguUser {
        var result = this.GetPUsers().find(pu => pu.id == user.id);
        if (!result && !suppressError) PinguLibrary.errorLog(user.client, `Unable to find a user in pUsers with id ${user.id}`);
        return result;
    }

    public static UpdatePUsersJSON(client: Client, user: User, script: string, succMsg: string, errMsg: string) {
        let fileName = this.PUserFileName(user);
        let path = `./users/${fileName}.json`;
        try { var pUserObj = require(path); }
        catch (err) { return PinguLibrary.pUserLog(client, script, `Unable to get pUser from ${fileName}`, new Error(err)); }

        console.log(`----------\n${pUserObj}\n----------`)

        fs.writeFile(path, '', err => {
            if (err) PinguLibrary.pUserLog(client, script, `[writeFile]: ${errMsg}`, new Error(err));
            else fs.appendFile(path, JSON.stringify(pUserObj, null, 4), err => {
                if (err) PinguLibrary.pUserLog(client, script, `[appendFile]: ${errMsg}`, new Error(err));
                else PinguLibrary.pUserLog(client, script, succMsg);
            });
        });
    }
    public static async UpdatePUsersJSONAsync(client: Client, user: User, script: string, succMsg: string, errMsg: string) {
        return await this.UpdatePUsersJSON(client, user, script, succMsg, errMsg);
    }

    public static WritePUser(user: User, client: Client, callback?: (pUser?: PinguUser) => void) {
        try {
            let pUser = new PinguUser(user, client);
            fs.writeFile(`./users/${this.PUserFileName(user)}.json`, JSON.stringify(pUser, null, 2), async err => {
                if (err) PinguLibrary.pUserLog(user.client, "WritePUser", null, new Error(err));
                if (await callback) callback(pUser);
            });
        } catch (ewwor) {
            console.log(ewwor);
        }
    }
    public static DeletePUser(user: User, callback?: (pUser?: PinguUser) => void) {
        try {
            let pUser = this.GetPUser(user);
            fs.unlink(`./users/${user.tag}.json`, async err => {
                if (err) PinguLibrary.pUserLog(user.client, "DeletePGuild", `Unable to delete json file for ${PinguUser.GetPUser(user).tag}`, new Error(err));
                if (await callback) callback(pUser);
            });
        } catch (ewwor) {
            console.log(ewwor);
        }
    }
    public static PUserFileName(user: User) {
        let specialCharacters = ["/", "\\", "<", ">"];
        let writableName = user.tag;

        for (var c of writableName) {
            if (specialCharacters.includes(c))
                writableName = writableName.replace(c, " ");
        }
        return writableName;
    }
    //#endregion

    constructor(user: User, client: Client) {
        let pUser = new PUser(user);
        this.id = pUser.id;
        this.tag = pUser.name;
        this.sharedServers = PinguLibrary.getSharedServers(client, user).map(guild => new PGuild(guild));
        this.replyPerson = null;
        this.dailyStreak = 0;
        this.avatar = user.avatarURL();
        this.playlists = new Array<PQueue>();
    }
    public id: string
    public tag: string
    public sharedServers: PGuild[]
    public replyPerson: PUser
    public dailyStreak: number
    public avatar: string
    public playlists: PQueue[]
    //public Achievements: Achievement[]
}
export class PinguGuild {
    //#region Static PinguGuild methods
    public static GetPGuilds(): PinguGuild[] {
        let guildCollection = fs.readdirSync(`./servers/`).filter(file => file.endsWith('.json'));
        let pGuildArr = [];

        for (var guildFile of guildCollection)
            pGuildArr.push(require(`./servers/${guildFile}`));
        return pGuildArr;
    }
    public static GetPGuild(guild: Guild): PinguGuild {
        var result = this.GetPGuilds().find(pg => pg.guildID == guild.id);
        if (!result) PinguLibrary.errorLog(guild.client, `Unable to find a guild in pGuilds with id ${guild.id}`);
        return result;
    }

    public static UpdatePGuildJSON(client: Client, guild: Guild, script: string, succMsg: string, errMsg: string) {
        let path = `./servers/${guild.name}.json`;
        try { var pGuildObj = require(path); }
        catch (err) { return PinguLibrary.pGuildLog(client, script, `Unable to get pGuild from ${guild.name}`, err); }

        fs.writeFile(path, '', null, err => {
            if (err) PinguLibrary.pGuildLog(client, script, `[writeFile]: ${errMsg}`, new Error(err));
            else fs.appendFile(path, JSON.stringify(pGuildObj, null, 2), err => {
                if (err) PinguLibrary.pGuildLog(client, script, `[appendFile]: ${errMsg}`, new Error(err));
                else PinguLibrary.pGuildLog(client, script, succMsg);
            })
        });
    }
    public static async UpdatePGuildJSONAsync(client: Client, guild: Guild, script: string, succMsg: string, errMsg: string) {
        return await this.UpdatePGuildJSON(client, guild, script, succMsg, errMsg);
    }

    public static WritePGuild(guild: Guild, callback?: (pGuild?: PinguGuild) => void) {
        try {
            let pGuild = new PinguGuild(guild);
            fs.writeFile(`./servers/${guild.name}.json`, JSON.stringify(pGuild, null, 2), async err => {
                if (err) PinguLibrary.pGuildLog(guild.client, "WritePGuild", null, new Error(err));
                if (await callback) callback(pGuild);
            });
        } catch (ewwor) {
            console.log(ewwor);
        }
    }
    public static DeletePGuild(guild: Guild, callback?: (pGuild?: PinguGuild) => void) {
        try {
            let pGuild = this.GetPGuild(guild);
            fs.unlink(`./servers/${guild.name}.json`, async err => {
                if (err) PinguLibrary.pGuildLog(guild.client, "DeletePGuild", `Unable to delete json file for ${pGuild.guildName}`, new Error(err));
                if (await callback) callback(pGuild);
            });
        } catch (ewwor) {
            console.log(ewwor);
        }
    }
    //#endregion

    constructor(guild: Guild) {
        this.guildName = guild.name;
        this.guildID = guild.id;
        this.guildOwner = new PGuildMember(guild.owner);
        const { Prefix } = require('./config.json');
        this.botPrefix = Prefix;
        this.embedColor = guild.me.roles.cache.find(role => role.name.includes('Pingu')) && guild.me.roles.cache.find(role => role.name.includes('Pingu')).color || PinguLibrary.DefaultEmbedColor;
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
    public musicQueue: PQueue
    public giveawayConfig: GiveawayConfig
    public pollConfig: PollConfig
    public suggestions: Suggestion[]
    public themeWinners: PGuildMember[]
}
export class PinguLibrary {
    //#region Client
    public static setActivity(client: Client) {
        class Activity {
            constructor(text: string, type: ActivityType) {
                this.text = text;
                this.type = type;
            }
            public text: string
            public type: ActivityType
        }

        internalSetActivity();
        setInterval(internalSetActivity, 86400000);

        function internalSetActivity() {
            let date = {
                day: new Date(Date.now()).getDate(),
                month: new Date(Date.now()).getMonth() + 1,
                year: new Date(Date.now()).getFullYear()
            };

            let activity = new Activity('your screams for', 'LISTENING');

            //date.getMonth is 0-indexed
            if (date.month == 12)
                activity = date.day < 26 ?
                    new Activity('Jingle Bells...', 'LISTENING') :
                    new Activity('fireworks go boom', 'WATCHING');
            else if (date.month == 5 && date.day == 3)
                activity = new Activity(`Danho's birthday wishes`, 'LISTENING');

            client.user.setActivity(activity.text + ' *help', { type: activity.type })
                .then(presence => {
                    let activity = presence.activities[presence.activities.length - 1];
                    let { announceActivity } = require('./config');
                    if (announceActivity) PinguLibrary.activityLog(client, `${activity.type} ${activity.name}`);
                });
        }
    }
    public static DefaultEmbedColor = 3447003;
    //#endregion

    //#region Permissions
    public static PermissionCheck(check: { author: User, channel: GuildChannel, client: Client, content: string}, permissions: string[]) {
        let { testingMode } = require('./config.json');

        if (permissions[0].length == 1) {
            this.errorLog(check.client, `Permissions not defined correctly!`, check.content);
            return "Permissions for this script was not defined correctly!";
        }

        for (var x = 0; x < permissions.length; x++) {
            var permString = permissions[x].toLowerCase().replace('_', ' ');

            if (!checkPermisson(check.channel, check.client.user, permissions[x]))
                return `I don't have permission to **${permString}** in ${check.channel.name}.`;
            else if (!checkPermisson(check.channel, check.author, permissions[x]) &&
                (this.isPinguDev(check.author) && testingMode || !this.isPinguDev(check.author)))
                return `<@${check.author.id}> you don't have permission to **${permString}** in #${check.channel.name}.`;
        }
        return this.PermissionGranted;

        function checkPermisson(channel: GuildChannel, user: User, permission: string) {
            return channel.permissionsFor(user).has(permission as PermissionString);
        }
    }
    public static readonly PermissionGranted = "Permission Granted";
    //#endregion

    //#region Servers
    public static readonly SavedServers = {
        DanhoMisc(client: Client) {
            return PinguLibrary.getServer(client, '460926327269359626');
        },
        PinguSupport(client: Client) {
            return PinguLibrary.getServer(client, '756383096646926376');
        },
        PinguEmotes(client: Client) {
            return PinguLibrary.getServer(client, '791312245555855401');
        }
    }
    private static getServer(client: Client, id: string) {
        return client.guilds.cache.find(g => g.id == id);
    }
    public static getSharedServers(client: Client, user: User): Guild[] {
        let servers = [];
        client.guilds.cache.forEach(g => g.members.cache.forEach(gm => {
            if (gm.user.id == user.id)
                servers.push(g);
        }));
        return servers;
    }
    //#endregion

    //#region Pingu Developers
    private static readonly PinguDevelopers: string[] = [
        '245572699894710272', //Danho#2105
        '405331883157880846', //Synthy Sytro
        '290131910091603968', //Slothman
    ];
    public static isPinguDev(user: User) {
        //console.log(`[${this.PinguDevelopers.join(', ')}].includes(${user.id})`);
        return this.PinguDevelopers.includes(user.id);
    }
    //#endregion

    //#region Channels
    public static getChannel(client: Client, guildID: string, channelname: string) {
        var guild = client.guilds.cache.find(guild => guild.id == guildID);
        if (!guild) {
            console.error(`Unable to get guild from ${guildID}`);
            return null;
        }
        var channel = guild.channels.cache.find(channel => channel.name == channelname);
        if (!channel) {
            console.error(`Unable to get channel from ${channelname}`);
            return null;
        }
        return channel as TextChannel;
    }
    public static async outages(client: Client, message: string) {
        var outageChannel = this.getChannel(client, '756383096646926376', 'outages');
        if (!outageChannel) return this.DanhoDM(client, `Couldn't get #outage channel in Pingu Support, https://discord.gg/Mp4CH8eftv`);
        console.log(message);
        let sent = await outageChannel.send(message);
        return sent.crosspost();
    }
    public static async DanhoDM(client: Client, message: string) {
        console.error(message);

        var DanhoMisc = this.SavedServers.DanhoMisc(client);
        if (!DanhoMisc) {
            console.error('Unable to find Danho Misc guild!', client.guilds.cache.array().forEach(g => console.log(`[${g.id}] ${g.name}`)));
            return null;
        }
        var DanhoDM = await DanhoMisc.owner.createDM();
        return DanhoDM.send(message)
    }
    //#endregion

    //#region Log Channels
    public static errorLog(client: Client, message: string, userContent?: string, err?: Error) {
        var errorlogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'error-log');
        if (!errorlogChannel) return this.DanhoDM(client, 'Unable to find #error-log in Pingu Support');

        console.error(getErrorMessage(message.includes('`') ? message.replace('`', ' ') : message, userContent, err));
        return errorlogChannel.send(getErrorMessage(message, userContent, err));

        function getErrorMessage(message: string, userContent?: string, err?: Error) {
            if (!userContent) return message;
            else if (!err)
                return ("`\`\`\n" +
                    `[Provided Message]\n` +
                    `${message}\n` +
                    `\n` +
                    `[Message content]\n` +
                    `${userContent}\n` +
                    "```"
                );

            let returnMessage = ("\`\`\`" +
                err.fileName && err.lineNumber ? `${err.fileName} threw an error at line ${err.lineNumber}!\n` : " " +
                `[Provided Message]\n` +
                `${message}\n` +
                `\n` +
                `[Message content]\n` +
                `${userContent}\n` +
                `\n` +
                `[Error message]: \n` +
                `${err.message}\n` +
                `\n` +
                `[Stack]\n` +
                `${err.stack}\n\n` +
                "```"
            );
            console.log(returnMessage);
            return returnMessage
        }
    }
    public static async pGuildLog(client: Client, script: string, message: string, err?: Error) {
        var pinguGuildLog = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "pingu-guild-log");

        if (err) {
            var errorLink = (await this.errorLog(client, `pGuild Error: "${message}"`, null, err)).url;
            return pinguGuildLog.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return pinguGuildLog.send(`[**Success**] [**${script}**]: ${message}`);
    }
    public static async pUserLog(client: Client, script: string, message: string, err?: Error) {
        var pinguUserLog = this.getChannel(client, this.SavedServers.PinguSupport(client).id, "pingu-user-log");

        if (err) {
            var errorLink = (await this.errorLog(client, `pUser Error (**${script}**): "${message}"`, null, err)).url;
            return pinguUserLog.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return pinguUserLog.send(`[**Success**] [**${script}**]: ${message}`);
    }
    public static tellLog(client: Client, sender: User, reciever: User, message: Message | MessageEmbed) {
        var tellLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'tell-log');
        if (!tellLogChannel) return this.DanhoDM(client, `Couldn't get #tell-log channel in Pingu Support, https://discord.gg/Mp4CH8eftv`)

        if ((message as object).constructor.name == "Message") {
            var messageAsMessage = message as Message;
            var consoleLog = 
                messageAsMessage.content ?
                    `${sender.username} sent a message to ${reciever.username} saying ` :
                    messageAsMessage.attachments.array().length == 1 ?
                        `${sender.username} sent a file to ${reciever.username}` :
                        messageAsMessage.attachments.array().length > 1 ?
                            `${sender.username} sent ${messageAsMessage.attachments.array().length} files to ${reciever.username}` :
                            `${sender.username} sent something unknown to ${reciever.username}!`;

            if (messageAsMessage.content) consoleLog += messageAsMessage.content;
            if (messageAsMessage.attachments) consoleLog += messageAsMessage.attachments.map(a => `\n${a.url}`);

            PinguLibrary.ConsoleLog(consoleLog);

            var format = (ping: boolean) => `${new Date(Date.now()).toLocaleTimeString()} [<@${(ping ? sender : sender.username)}> ➡️ <@${(ping ? reciever : reciever.username)}>]`;

            if (messageAsMessage.content && messageAsMessage.attachments)
                tellLogChannel.send(format(false) + `: ||${messageAsMessage.content}||`, messageAsMessage.attachments.array())
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));

            else if (messageAsMessage.content)
                tellLogChannel.send(format(false) + `: ||${messageAsMessage.content}||`)
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));

            else if (messageAsMessage.attachments)
                tellLogChannel.send(format(false), messageAsMessage.attachments.array())
                    .then(sent => sent.edit(format(true)));

            else this.errorLog(client, `${sender} ➡️ ${reciever} sent something that didn't have content or attachments`)
                .then(() => tellLogChannel.send(`Ran else statement - reported to ${tellLogChannel.guild.channels.cache.find(c => c.name == 'error-log')}`));
        }
        else if ((message as MessageEmbed).constructor.name == "MessageEmbed") {
            console.log(`The link between ${sender.username} & ${reciever.username} was unset.`);
            tellLogChannel.send(message as MessageEmbed)
        }
    }
    public static async LatencyCheck(message: Message) {
        //Get latency
        let pingChannel = this.getChannel(message.client, this.SavedServers.PinguSupport(message.client).id, "ping-log");
        if (message.channel == pingChannel || message.author.bot) return;

        let pingChannelSent = await pingChannel.send(`Calculating ping`);

        let latency = pingChannelSent.createdTimestamp - message.createdTimestamp;
        pingChannelSent.edit(latency);

        //Get outages channel
        let outages = this.getChannel(message.client, this.SavedServers.PinguSupport(message.client).id, "outages");
        if (!outages) return this.errorLog(message.client, `Unable to find outages channel from LatencyCheck!`);

        //Set up to find last Pingu message
        let outagesMessages = outages.messages.cache.array();
        let outageMessagesCount = outagesMessages.length - 1;

        //Find Pingu message
        for (var i = outageMessagesCount - 1; i >= 0; i--) {
            if (outagesMessages[i].author != message.client.user) continue;
            var lastPinguMessage = outagesMessages[i];
        }

        if (!lastPinguMessage) return;

        let sendMessage = !lastPinguMessage.content.includes(`I have a latency delay on`);
        if (!sendMessage) {
            let lastMessageArgs = lastPinguMessage.content.split(` `);
            let lastLatencyExclaim = lastMessageArgs[lastMessageArgs.length - 1];
            let lastLatency = parseInt(lastLatencyExclaim.substring(0, lastLatencyExclaim.length - 1));

            if (lastLatency > 1000)
                return lastPinguMessage.edit(`I have a latency delay on ${latency}!`);
        }

        if (latency > 1000) PinguLibrary.outages(message.client, `I have a latency delay on ${latency}!`);
    }
    public static activityLog(client: Client, message: string) {
        let activityLogChannel = this.getChannel(client, this.SavedServers.PinguSupport(client).id, 'activity-log');
        if (!activityLogChannel) return this.DanhoDM(client, `Couldn't get #activity-log channel in Pingu Support, https://discord.gg/Mp4CH8eftv`)

        return activityLogChannel.send(message);
    }
    //#endregion

    public static getEmote(client: Client, name: string, emoteGuild: Guild) {
        for (var guild of client.guilds.cache.array()) {
            if (guild.name != emoteGuild.name) continue;
            let emote = guild.emojis.cache.find(emote => emote.name == name)
            if (emote) return emote;
        }
        PinguLibrary.errorLog(client, `Unable to find Emote **${name}** from ${emoteGuild.name}`);
        return '😵';
    }
    public static ConsoleLog(message: string) {
        let timeFormat = `[${new Date(Date.now()).toLocaleTimeString()}]`;
        console.log(`${timeFormat} ${message}`);
    }
}
//#endregion

abstract class Decidable {
    constructor(value: string, id: string, author: PGuildMember, channel: Channel) {
        this.value = value;
        this.id = id;
        this.author = author;
        this.channel = channel;
    }
    public value: string
    public id: string
    public author: PGuildMember
    public channel: Channel
}

//#region extends Decideables
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
    constructor(value: string, id: string, author: PGuildMember, channel: Channel) {
        super(value, id, author, channel);
        this.winners = new Array<PGuildMember>();
    }
    public winners: PGuildMember[]
}
export class Suggestion extends Decidable {
    public Decide(approved: boolean, decidedBy: PGuildMember) {
        this.approved = approved;
        this.decidedBy = decidedBy;
    }
    public decidedBy: PGuildMember
    public approved: boolean
}
//#endregion

interface IDecidableConfigOptions {
    firstTimeExecuted: boolean;
    channel: Channel;
}

//#region PollConfig
interface IPollConfigOptions extends IDecidableConfigOptions {
    pollRole: PRole;
    polls: Poll[];
}
export class PollConfig implements IPollConfigOptions {
    constructor(options?: IPollConfigOptions) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.pollRole = options ? options.pollRole : undefined;
        this.channel = options ? options.channel : undefined;
        if (options) this.polls = options.polls;
    }
    firstTimeExecuted: boolean;
    pollRole: PRole;
    polls: Poll[];
    channel: Channel;
}
//#endregion

//#region GiveawayConfig
interface IGiveawayConfigOptions extends IDecidableConfigOptions {
    allowSameWinner: boolean;
    hostRole: PRole;
    winnerRole: PRole;
    giveaways: Giveaway[];
}
export class GiveawayConfig implements IGiveawayConfigOptions {
    constructor(options?: IGiveawayConfigOptions) {
        this.firstTimeExecuted = options ? options.firstTimeExecuted : true;
        this.allowSameWinner = options ? options.allowSameWinner : undefined;
        this.hostRole = options ? options.hostRole : undefined;
        this.winnerRole = options ? options.winnerRole : undefined;
        this.channel = options ? options.channel : undefined;
        if (options) this.giveaways = options.giveaways;
    }
    firstTimeExecuted: boolean;
    allowSameWinner: boolean;
    hostRole: PRole;
    winnerRole: PRole;
    giveaways: Giveaway[];
    channel: Channel;
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
    constructor(client: PClient, logChannel: TextChannel, voiceChannel: VoiceChannel, songs: Song[], playing = true) {
        this.logChannel = logChannel;
        this.voiceChannel = voiceChannel;
        this.songs = songs;
        this.volume = .5;
        this.connection = null;
        this.playing = playing;
        this.client = client;
        this.loop = false;
        this.index = 0;
    }

    public logChannel: TextChannel
    public voiceChannel: VoiceChannel
    public connection: VoiceConnection
    public songs: Song[]
    public volume: number
    public playing: boolean
    public loop: boolean
    public index: number
    public client: PClient

    get currentSong(): Song {
        return this.songs[this.index];
    }

    /** Adds song to the start of the queue
     * @param song song to add*/
    public addFirst(song: Song) {
        song.id = this.songs.length;
        this.songs.unshift(song);
    }
    /** Adds song to queue
     * @param song song to add*/
    public add(...songs: Song[]) {
        songs.forEach(song => {
            song.id = this.songs.length;
            this.songs.push(song)
        });
    }
    /** Removes song from queue
     * @param song song to remove*/
    public remove(song: Song) {
        this.songs = this.songs.filter(s => s != song);
    }
    public move(posA: number, posB: number) {
        var songToMove = this.songs[posA];
        this.songs.unshift(null);

        for (var i = 1; i < this.songs.length; i++) {
            if (i == posB) this.songs[i - 1] = songToMove;
            else if (i == posA + 1) continue;
            else this.songs[i - 1] = this.songs[i];
        }
        return this;
    }
    public includes(title: string) {
        var song = this.songs.find(s => s.title.includes(title))
        return song != null;
    }
    public find(title: string) {
        return this.songs.find(s => s.title.includes(title));
    }
}
export class Song {
    constructor(author: User, songInfo: MoreVideoDetails) {
        //YouTube
        this.link = songInfo.video_url;
        this.title = songInfo.title;
        this.author = songInfo.author && songInfo.author.name;
        this.length = this.GetLength(songInfo.lengthSeconds);
        this.lengthMS = parseInt(songInfo.lengthSeconds) * 1000;

        this.requestedBy = new PUser(author);
        this.id = 0;
        this.loop = false;
        this.endsAt = null;
    }
    public id: number
    public title: string
    public author: string
    public link: string
    public playing: boolean
    public length: string
    public lengthMS: number
    public endsAt: Date
    public loop: boolean
    public requestedBy: PUser

    public play() {
        this.endsAt = new Date(Date.now() + this.lengthMS);
    }
    public getTimeLeft() {
        return new TimeLeftObject(new Date(Date.now()), this.endsAt);
    }
    private GetLength(secondsLength: string) {
        var seconds = parseInt(secondsLength), minutes = 0, hours = 0, final = [];

        if (seconds > 59) {
            while (seconds > 59) {
                seconds -= 60;
                minutes++;
            }
        }
        if (minutes > 59) {
            while (minutes > 59) {
                minutes -= 60;
                hours++;
            }
        }

        final.push(hours, minutes, seconds);

        return final.map(i => i < 10 ? `0${i}` : i).join('.');
    }
}
//#endregion