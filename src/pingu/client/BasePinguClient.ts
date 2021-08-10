import { ActivityOptions, ActivityType, CategoryChannel, Client, ClientEvents, ClientOptions, Collection, Guild, GuildMember, Message, MessageAttachment, MessageEmbed, PermissionString, Snowflake, TextChannel, User } from "discord.js";
import * as fs from 'fs';
export const Clients = {
    PinguID: '562176550674366464',
    BetaID: '778288722055659520'
}
export function ToBasePinguClient(client: Client) { return client as BasePinguClient }

import PinguHandler from "../handlers/PinguHandler";
import { PinguCommandParams } from "../handlers/PinguCommand";

import IConfigRequirements from "../../helpers/Config";
import PinguCollection from '../collection/PinguCollection'
import DeveloperCollection, { developers } from '../collection/DeveloperCollection'
import EmojiCollection from '../collection/EmojiCollection'
import PinguGuildMemberCollection from '../collection/PinguGuildMemberCollection';

import { DBExecute } from "../../database";
import PermissionsManager from '../PermissionsManager';
import PinguCacheManager from '../PinguCacheManager';

import { IAmBadge, PinguBadge, TempBadges } from '../badge/PinguBadge'
import PinguUser from '../user/PinguUser';
import PinguGuild from '../guild/PinguGuild';

type ConsoleLogType = 'log' | 'warn' | 'error';
interface ErrorLogParams { 
    params?: PinguCommandParams | {}, 
    trycatch?: {}
    additional?: {}
}
interface LogTypes {
    achievement: [content: MessageEmbed],
    console: [message: string, type?: ConsoleLogType],
    error: [message: string, messageContent?: string, err?: Error, params?: ErrorLogParams],
    event: [content: MessageEmbed],
    ping: [timestamp: number],
    pGuild: [script: string, message: string, err?: Error],
    pUser: [script: string, message: string, err?: Error],
    raspberry: [],
    tell: [sender: User, receiver: User, message: Message | MessageEmbed]
}
export type LogChannels = keyof LogTypes;
export type SavedServerNames = 'Danho Misc' | 'Pingu Support' | 'Pingu Emotes' | 'Deadly Ninja';
class SavedServer {
    constructor(name: SavedServerNames, id: Snowflake) {
        this.name = name;
        this.id = id;
    }

    public name: SavedServerNames;
    public id: Snowflake;
}

export abstract class BasePinguClient<Events extends ClientEvents = any> extends Client {
    public static Clients = Clients;

    constructor(config: IConfigRequirements,  permissions: PermissionString[], subscribedEvents: Array<keyof ClientEvents>, commandsPath?: string, eventsPath?: string, options?: ClientOptions) {
        super(options);
        this.config = config;
        this.subscribedEvents = subscribedEvents;
        this.permissions = new PermissionsManager(this, permissions);
        this.emotes = new EmojiCollection(this);
        this.pGuilds = new PinguCollection<Guild, PinguGuild>(this, 'pingu-guild-log', 'PinguGuild', g => new PinguGuild(g, g.owner), c => c.guilds);
        this.pUsers = new PinguCollection<User, PinguUser>(this, 'pingu-user-log', 'PinguGuild', u => new PinguUser(u), c => c.users);

        if (commandsPath) this.handlePath(commandsPath, 'command');
        if (eventsPath) this.handlePath(eventsPath, 'event');
        this.once('ready', this.onceReady);
    }

    //#region Public properties
    public get id() { 
        return this.user.id; 
    }
    public get isLive() { 
        return this.id == Clients.PinguID 
    }
    public readonly DefaultEmbedColor = 3447003;
    public readonly invite = `https://discord.gg/gbxRV4Ekvh`;
    
    public commands = new Collection<string, PinguHandler>();
    public events = new Collection<string | keyof Events, PinguHandler>();
    public subscribedEvents = new Array<string | keyof Events>();
    public DefaultPrefix: string;

    public clients = new Collection<'Live' | 'Beta', User>();
    public permissions: PermissionsManager;
    public cache = new PinguCacheManager();
    
    public config: IConfigRequirements;
    public logChannels: Collection<LogChannels, TextChannel>;
    public developers: DeveloperCollection;
    public savedServers: Collection<SavedServerNames, Guild>;
    public badges: Collection<IAmBadge, PinguBadge>;
    
    public pGuilds: PinguCollection<Guild, PinguGuild>;
    public pGuildMembers: Collection<Guild, PinguGuildMemberCollection>;
    public pUsers: PinguCollection<User, PinguUser>;
    public emotes: EmojiCollection;
    //#endregion

    //#region Publoic Overwritten methods
    public setActivity(options?: ActivityOptions) {
        if (options) return this.user.setActivity(options);

        class Activity {
            constructor(text: string, type: ActivityType) {
                this.text = text;
                this.type = type;
            }
            public text: string
            public type: ActivityType
        }
        
        let date = {
            day: new Date(Date.now()).getDate(),
            month: new Date(Date.now()).getMonth() + 1,
            year: new Date(Date.now()).getFullYear()
        };

        var activity = this.isLive ? new Activity('your screams for', 'LISTENING') : new Activity('Danho cry over bad code', 'WATCHING');

        if (date.month == 12)
            activity = date.day < 26 ?
                new Activity('Jingle Bells...', 'LISTENING') :
                new Activity('fireworks go boom', 'WATCHING');
        else if (date.month == 5)
            activity =
                date.day == 3 ? new Activity(`Danho's birthday wishes`, 'LISTENING') :
                    date.day == 4 ? new Activity('Star Wars', 'WATCHING') : null;

        let Danho = this.developers.get('Danho');
        let DanhoStream = Danho.presence.activities.find(a => a.type == 'STREAMING');
        if (DanhoStream) return this.user.setActivity({
            name: DanhoStream.details,
            type: DanhoStream.type,
            url: DanhoStream.url
        });

        if (!activity) activity = new Activity('your screams for', 'LISTENING');

        return this.user.setActivity({
            name: activity.text + ` ${this.DefaultPrefix}help`, 
            type: activity.type 
        });
    }
    //#endregion

    //#region Public methods
    public async log<Type extends LogChannels, LogMethod extends (channel: TextChannel, ...args: LogTypes[Type]) => Promise<Message>>(type: Type, ...args: LogTypes[Type]): Promise<Message> {
        const logChannel = this.logChannels.get(type);
        return new Collection<LogChannels, LogMethod>([
            ['achievement', this.achievementLog as any],
            ['console', this.consoleLog as any],
            ['error', this.errorLog as any],
            ['event', this.eventLog as any],
            ['pGuild', this.pGuildLog as any],
            ['pUser', this.pUserLog as any],
            ['ping', this.pingLog as any],
            ['raspberry', this.raspberryLog as any],
            ['tell', this.tellLog as any]
        ]).get(type)(logChannel, ...args);
    }
    public async DBExecute<T>(callback: (mongoose: typeof import('mongoose')) => Promise<T>): Promise<T> { return DBExecute(this, callback); }
    public async DanhoDM(message: string) {
        console.error(message);

        const Danho = this.developers.get('Danho');
        if (!Danho) return;

        return (await Danho.createDM()).send(message);
    }
    public async writeFile(name: string, content: object | string, src: string = './files') {
        const isJson = typeof content == 'object';
        const _content = isJson ? JSON.stringify(content) : content as string;
        const fileName = `/${name}.${isJson ? '.json' : '.txt'}`;
        const filePath = src.endsWith('/') ? fileName.slice(1) : fileName;

        const filesFolderExists = fs.existsSync(src);
        const fileExists = fs.existsSync(filePath);

        if (!filesFolderExists) {
            fs.mkdirSync(src, { recursive: true });
        }

        if (fileExists) {
            fs.unlinkSync(filePath);
        }

        return new Promise<MessageAttachment>((resolve, reject) => {
            fs.writeFile(fileName, _content, null, async err => {
                if (err) {
                    this.log('error', `Unable to create file \`${filePath}\`.`, null, err, {
                        params: { name, content, src },
                        additional: { isJson, _content, fileName, filePath, filesFolderExists, fileExists }
                    });
                    reject(err);
                    return null;
                }

                resolve(new MessageAttachment(fs.readFileSync(filePath), fileName));
            })
        });
    }
    //#endregion

    //#region Protected methods
    protected async onceReady() {
        this.DefaultPrefix = this.isLive || !this.config.BetaPrefix ? this.config.Prefix : this.config.BetaPrefix;

        this.savedServers = (() => { 
            return new Collection<SavedServerNames, Guild>([
                new SavedServer('Danho Misc', '460926327269359626'),
                new SavedServer('Pingu Support', '756383096646926376'),
                new SavedServer('Pingu Emotes', '791312245555855401'),
                new SavedServer('Deadly Ninja', '405763731079823380')
            ].map(({ name, id }) => [name, this.guilds.cache.get(id)]))
        })();

        this.logChannels = (() => { 
            return new Collection<LogChannels, TextChannel>(
                new Collection<LogChannels, string>([
                    ['achievement', 'achievement-log-🏆'],
                    ['console', 'console-log-📝'],
                    ['error', 'error-log-⚠'],
                    ['event', 'event-log-📹'],
                    ['pGuild', 'pingu-guild-log-🏡'],
                    ['pUser', 'pingu-user-log-🧍'],
                    ['ping', 'ping-log-🏓'],
                    ['raspberry', 'raspberry-log-🍇'],
                    ['tell', 'tell-log-💬']
                ]).map((channelName, key) => {
                    const logChannels = this.savedServers.get('Pingu Support').channels.cache.find(c => c.name.includes('Pingu Logs')) as CategoryChannel;
                    const logChannel = logChannels.children.find(c => c.name == channelName) as TextChannel;
                    return [key, logChannel];
                })
            );
        })();

        this.clients = new Collection([
            ['Live', this.isLive ? this.user : await this.users.fetch(Clients.PinguID)],
            ['Beta', !this.isLive ? this.user : await this.users.fetch(Clients.BetaID)]
        ]);

        const devUsers = await Promise.all(developers.map(id => this.users.fetch(id)));
        this.developers = devUsers.reduce((result, user) => result.set(developers.findKey(id => id == user.id), user), new DeveloperCollection());

        this.badges = new Collection(TempBadges.map((temp, name) => {
            const guild = this.savedServers.get(temp.guild);
            const emoji = guild.emojis.cache.find(e => e.name == temp.emojiName);
            return [name, new PinguBadge(name, emoji, temp.weight)];
        }))

        this.emotes.refresh(this);
        
        await this.pGuilds.refresh(this);
        await this.pUsers.refresh(this);

        this.pGuildMembers = new Collection((await Promise.all(this.guilds.cache.map(async guild => ({
            guild, collection: await new PinguGuildMemberCollection(this, 'pingu-guild-log', guild).refresh()
        })))).map(({ guild, collection }) => [guild, collection]));

        this.emit('onready', this);

        return this;
    }
    protected abstract handlePath(path: string, type: 'command' | 'event'): void;
    //#endregion

    //#region Log Methods
    private async achievementLog(channel: TextChannel, achievementEmbed: MessageEmbed) {
        return channel.send(achievementEmbed);
    }
    private async consoleLog(channel: TextChannel, message: string, type: ConsoleLogType = 'log') {
        console[type](`[${new Date().toLocaleTimeString()}] ${message}`);
    
        return channel.send(message);
    }
    private async errorLog(channel: TextChannel, message: string, messageContent?: string, err?: Error, params?: ErrorLogParams): Promise<Message> {
        const that = channel.client as BasePinguClient;

        //Get #error-log
        let errorPath = './errors'; 
        if (!fs.existsSync(errorPath)) {
            fs.mkdirSync(errorPath);
            fs.writeFileSync(`${errorPath}/dont delete me pls.txt`, ``);
        }
        
        const errorID = fs.readdirSync(errorPath).filter(file => file.endsWith('.json')).length;
        const consoleLogChannel = that.logChannels.get('console');

        type FileExtension = 'txt' | 'json';
        const fsCallback = (fileExtension: FileExtension) => that.consoleLog(consoleLogChannel, `Created ${fileExtension} file for error #${errorID}.`)
        const jsonErrorContent = JSON.stringify({ err, params }, null, 2);
        fs.writeFile(`${errorPath}/${errorID}.json`, jsonErrorContent, () => fsCallback('json'));
        
        //Send and react
        const sentCatcher = async (e: Error, fileExtension: FileExtension) => {
            console.error(`Caught error with:\n${e.message}\n\n`)
            if (new RegExp(/Must be (2|4)000 or fewer in length\./).test(e.message)) {
                const filePath = `${errorPath}/${errorID}.${fileExtension}`;

                if (fileExtension == 'txt') {
                    const fileContent = getErrorMessage(message, messageContent, err);
                    fs.writeFile(filePath, fileContent, () => fsCallback(fileExtension));
                }

                return channel.send(new MessageAttachment(filePath, `Error ${errorID}.${fileExtension}`));
            }
        }
        let sent = await sendMessage(getErrorMessage(message, messageContent, err)).catch(err => sentCatcher(err, 'txt'));
        let paramsSent = await sendMessage("```\n[Parameters]:\n" + jsonErrorContent + "\n```").catch(err => sentCatcher(err, 'json'));

        //Add to errorCache
        that.cache.errors.set(errorID, [sent, paramsSent]);

        //Send original errror message
        return sent;

        function getErrorMessage(message: string, messageContent?: string, err?: Error) {
            let result = {
                errorID: `Error #${errorID}\n`,
                format: "```\n",
                providedMessage: `[Provided Message]\n${message}\n\n`,
                errorMessage: `[Error message]: \n${err && err.message}\n\n`,
                messageContent: `[Message content]\n${messageContent}\n\n`,
                stack: `[Stack]\n${err && err.stack}\n\n\n`,
            };

            let returnMessage = (
                result.errorID +
                result.format +
                result.providedMessage +
                (messageContent ? result.messageContent : "") +
                (err ? result.errorMessage + result.stack : "") +
                result.format
            );

            that.consoleLog(consoleLogChannel, returnMessage);
            return returnMessage
        }
        async function sendMessage(content: string) {
            console.error(content.includes('`') ? content.replace('`', ' ') : content);

            let sent = await channel.send(content);
            await sent.react(that.emotes.get('Checkmark')[0]);
            await sent.react('📄'); //Get error file
            
            //Create reaction handler
            sent.createReactionCollector(() => true).on('collect', async (reaction, user) => {
                if (!that.developers.isPinguDev(user) || !reaction.users.cache.has(that.id)) return reaction.remove();

                if (reaction.emoji.name == '📄') {
                    let fileMessage = await reaction.message.channel.send(new MessageAttachment(`${errorPath}/${errorID}.json`, `Error ${errorID}.json`));
                    return that.cache.errors.set(errorID, [...that.cache.errors.get(errorID), fileMessage]);
                }

                that.cache.errors.get(errorID).forEach(m => m.delete({ reason: `Error #${errorID}, was marked as solved by ${user.tag}` }));
                const errorFiles = fs.readdirSync(errorPath).filter(file => file.startsWith(errorID.toString()));
                errorFiles.forEach(file => fs.unlink(`${errorPath}/${file}`, () => that.log('console', `Deleted error #${errorID}.`)))
            })
            
            return sent;
        }
    }
    private async eventLog(channel: TextChannel, content: MessageEmbed) {
        if (!this.isLive) return null;
    
        const lastCache = this.cache.events[0];
        if (lastCache && (
            lastCache.description && lastCache.description == content.description ||
            lastCache.fields[0] && content.fields[0] && lastCache.fields[0].value == content.fields[0].value)
        ) return;
    
        this.cache.events.unshift(content);
        return channel.send(content);
    }
    private async pingLog(channel: TextChannel, timestamp: number) {
        const pingChannelSent = await channel.send(`Calculating ping`);
        const latency = pingChannelSent.createdTimestamp - timestamp;
        return pingChannelSent.edit(latency + 'ms');
    }
    private async pGuildLog(channel: TextChannel, script: string, message: string, err?: Error) {
        if (err) {
            var errorLink = (await this.log('error', `PinguGuild Error: "${message}"`, null, err) as Message).url;
            return channel.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return channel.send(`[**Success**] [**${script}**]: ${message}`);
    }
    private async pUserLog(channel: TextChannel, script: string, message: string, err?: Error) {
        if (err) {
            var errorLink = (await this.log('error', `PinguUser Error (**${script}**): "${message}"`, null, err) as Message).url;
            return channel.send(`[**Failed**] [**${script}**]: ${message}\n${err.message}\n\n${errorLink}\n\n<@&756383446871310399>`);
        }
        return channel.send(`[**Success**] [**${script}**]: ${message}`);
    }
    private async raspberryLog(channel: TextChannel) {
        const client = ToBasePinguClient(channel.client);

        if (!client.isLive) return null;
        return channel.send(`Booted on version **${client.config.version}**.`);
    }
    private async tellLog(channel: TextChannel, sender: User, reciever: User, message: Message | MessageEmbed) {
        if (!this.isLive) return null;
    
        if ((message as object).constructor.name == "Message") {
            var messageAsMessage = message as Message;
            var consoleLogValue =
                messageAsMessage.content ? `${sender.username} sent a message to ${reciever.username} saying ` :
                    messageAsMessage.attachments.size == 1 ? `${sender.username} sent a file to ${reciever.username}` :
                        messageAsMessage.attachments.size > 1 ? `${sender.username} sent ${messageAsMessage.attachments.size} files to ${reciever.username}` :
                            `${sender.username} sent something unknown to ${reciever.username}!`;
    
            if (messageAsMessage.content) consoleLogValue += messageAsMessage.content;
            if (messageAsMessage.attachments) consoleLogValue += messageAsMessage.attachments.map(a => `\n${a.url}`);
    
            this.log('console', consoleLogValue);
            var format = (ping: boolean) => `${new Date().toLocaleTimeString()} [${(ping ? sender : sender.username)} ➡️ ${(ping ? reciever : reciever.username)}]`;
    
            if (messageAsMessage.content && messageAsMessage.attachments)
                channel.send(format(false) + `: ||${messageAsMessage.content}||`, messageAsMessage.attachments.array())
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));
    
            else if (messageAsMessage.content)
                channel.send(format(false) + `: ||${messageAsMessage.content}||`)
                    .then(sent => sent.edit(format(true) + `: ||${messageAsMessage.content}||`));
    
            else if (messageAsMessage.attachments)
                channel.send(format(false), messageAsMessage.attachments.array())
                    .then(sent => sent.edit(format(true)));
    
            else this.log('error', 
                `${sender} ➡️ ${reciever} sent something that didn't have content or attachments`, 
                (message as object).constructor.name == 'Message' ? (message as Message).content : (message as MessageEmbed).description,
                null, {
                    params: { sender, reciever, message },
                    additional: { tellLogChannel: channel, consoleLogValue }
                }).then(() => channel.send(`Ran else statement - I've contacted my developers!`));
        }
        else if ((message as MessageEmbed).constructor.name == "MessageEmbed") {
            this.log('console', `The link between ${sender.username} & ${reciever.username} was unset.`);
            channel.send(message as MessageEmbed)
        }
    }
    //#endregion
}

export default BasePinguClient;