import { ClientEvents, ClientOptions, Collection, TextChannel, User, Guild, PermissionString, MessageEmbed, Message } from "discord.js";
import * as fs from 'fs';   
import * as request from 'request';

import PinguGuild from '../guild/PinguGuild';
import PClient from '../../database/json/PClient';
import { getBadges } from "../badge/PinguBadge";

import { AchievementCheckData, AchievementCheck } from '../achievements'
import { GuildMemberAchievementType } from '../achievements/items/GuildMemberAchievement'
import { GuildAchievementType } from '../achievements/items/GuildAchievement'
import { AchievementBaseType } from '../achievements/items/AchievementBase'

<<<<<<< HEAD
import PinguCommand from '../handlers/PinguCommand';
import PinguEvent, { PinguClientEvents, HandleEvent } from '../handlers/PinguEvent';
import { PinguIntentEvents } from "../../helpers/IntentEvents";
import PinguClientBase from "./BasePinguClient";

export class PinguClient extends PinguClientBase<PinguIntentEvents> {
=======
import IConfigRequirements from '../../helpers/Config';
import { PinguCommand, PinguEvent, PinguClientEvents, HandleEvent } from '../handlers';
import BasePinguClient from "./BasePinguClient";

export class PinguClient extends BasePinguClient<PinguClientEvents> {
    constructor(
        config: IConfigRequirements, 
        permissions: PermissionString[], 
        subscribedEvents?: Array<keyof PinguClientEvents>, 
        dirname?: string,
        commandsPath?: string, 
        eventsPath?: string, 
        options?: ClientOptions
    ) {
        super(config, permissions, subscribedEvents as any, dirname, commandsPath, eventsPath, options);
    }

>>>>>>> parent of 92c7bfa (Get events from intents)
    //#region Public Properties
    public declare commands: Collection<string, PinguCommand>;
    public declare events: Collection<keyof PinguClientEvents, PinguEvent<keyof PinguClientEvents>>;
    public declare subscribedEvents: Array<keyof PinguClientEvents>;
    //#endregion
    
    //#region Public Methods
    public toPClient(pGuild: PinguGuild) {
        return pGuild.clients.find(c => c && c._id == this.user.id);
    }
    public emit<PCE extends keyof PinguClientEvents, CE extends keyof ClientEvents>(key: PCE, ...args: PinguClientEvents[PCE]) {
        return super.emit(
            key as unknown as CE, 
            ...args as unknown as ClientEvents[CE]
        );
    }

    //#region Gets
    public getSharedServers(user: User): Guild[] {
        return this.guilds.cache.filter(g => g.members.cache.has(user.id)).array();   
    }
    public getTextChannel(guildId: string, channelName: string) {
        const guild = this.guilds.cache.get(guildId);
        if (!guild) {
            this.DanhoDM(`Unable to get guild from ${guildId}!`);
            return null;
        }

        const channel = guild.channels.cache.find(c => c.name == channelName);
        if (!channel) {
            this.DanhoDM(`Unable to get channel from ${channelName}!`);
            return null;
        }
        return channel as TextChannel;
    }
    public getImage(script: string, imageName: string, extension: 'png' | 'gif' | 'jpg' = 'png') {
        return `./embedImages/${script}/${imageName}.${extension}`
    }
    public getBadges(user: User) { return getBadges(user); }
    //#endregion

    public async requestImage(message: Message, pGuildClient: PClient, caller: 'gif' | 'meme', types: string[], searchTerm?: (type: string) => string) {
        const { config } = this;

        if (!config || !config.api_key || !config.google_custom_search) {
            return this.log('error', `Unable to send ${caller}\nImage search requires both a YouTube API key and a Google Custom Search key!`, message.content, null, {
                params: { message, pGuildClient, caller, types },
                additional: { api_key: config.api_key, google_custom_search: config.google_custom_search }
            }).then(() => message.channel.send(`I was unable to search for a ${type}! I have contacted my developers...`));
        }
    
        // gets us a random result in first 5 pages
        const page = 1 + Math.floor(Math.random() * 5) * 10;
        //const type = Math.floor(Math.random() * 2) == 1 ? "Club Penguin" : "Pingu";
        const type = types[Math.floor(Math.random() * types.length)];
        if (!searchTerm) searchTerm = type => `${type} ${caller}`;
    
        // we request 10 items
        request(`https://www.googleapis.com/customsearch/v1?key=${config.api_key}&cx=${config.google_custom_search}&q=${searchTerm(type)}&searchType=image&alt=json&num=10&start=${page}`, async (err, res, body) => {
            if (err) return this.log('error', `Error getting results when searching for ${searchTerm(type)}`, message.content, new Error(err), {
                params: { message, pGuildClient, caller, types },
                additional: { page, type, keys: { api_key: config.api_key, google_custom_search: config.google_custom_search } }
            });
    
            // "https://www.googleapis.com/customsearch/v1?key=AIzaSyAeAr2Dv1umzuLes_zhlY0lON4Pf_uAKeM&cx=013524999991164939702:z24cpkwx9nz&q=pinguh&searchType=image&alt=json&num=10&start=31"
            try { var data = JSON.parse(body); }
            catch (err) { this.log('error', `Getting data in ${caller}, PinguLibrary.RequestImage()`, message.content, new Error(err), {
                params: { message, pGuildClient, caller, types },
                additional: { page, type, data }
            }); }
    
            if (!data) {
                return this.log('error', `Getting data in ${caller}, PinguLibrary.RequestImage()`, message.content, null, {
                    params: { message, pGuildClient, caller, types },
                    additional: { page, type, data }
                }).then(() => message.channel.send(`I was unable to recieve a gif! I have contacted my developers...`));
            }
            else if (!data.items || !data.items.length) {
                return this.log('error', `Data for ${caller} has no items`, message.content, null, {
                    params: { message, pGuildClient, caller, types },
                    additional: { page, type, data }
                }).then(() => message.channel.send(`I was unable to find a gif! I have contacted my developers...`));
            }
    
            return message.channel.sendEmbeds(new MessageEmbed()
                .setImage(data.items[Math.floor(Math.random() * data.items.length)].link)
                .setColor(pGuildClient.embedColor || this.DefaultEmbedColor)
            );
        });
    }
    public async AchievementCheck
        <AchievementType extends GuildMemberAchievementType | GuildAchievementType | AchievementBaseType,
        Key extends keyof AchievementType, Type extends AchievementType[Key]>
    (data: AchievementCheckData, key: Key, type: Type, callbackParams: any[]) {
        return AchievementCheck<AchievementType, Key, Type>(this, data, key, type, callbackParams);
    }
    //#endregion

    //#region Protected Methods
    protected handlePath(path: string, type: 'command' | 'event') {
        if (!path) return;

        const files = fs.readdirSync(path);
        for (const file of files) {
            try {
                if (file.endsWith(`.js`)) {
                    let module = require(`${path}/${file}`);
                    module.path = `${path}/${file}`;

                    if (type == 'event') {
                        if (!module.name || !this.subscribedEvents.find(e => module.name as keyof PinguClientEvents == e)) continue;

                        const type = module.name as keyof PinguClientEvents
                        const event = module as PinguEvent<typeof type>;

                        this.events.set(event.name, event);

                        this.on(event.name as keyof ClientEvents, (...params) => { //On original event
                            this.handleEvent(event.name, ...params) //Handle as Pingu event
                        })
                    }
                    else if (type == 'command') this.commands.set(module.name, module as PinguCommand);
                    else console.warn(`"${type}" was not recognized!`);
                }
                else if (file.endsWith('.png') || file.toLowerCase().includes('archived')) continue;
                else this.handlePath(`${path}/${file}`, type);
            } catch (err) {
                console.error(`"${file}" threw an exception:\n${err.message}\n${err.stack}\n`)
            }
        }
    }
    //#endregion

    //#region Private Methods
    private handleEvent<EventType extends keyof PinguClientEvents>(caller: EventType, ...args: PinguClientEvents[EventType]) {
        if (this.subscribedEvents.find(e => e == caller)) 
        try {
            HandleEvent(caller, this, ...args as PinguClientEvents[EventType]);
        }
        catch (err) {
            this.log('error', `Event error`, null, err, { params: { caller, args } })
        }
        return this;
    }
    //#endregion
}
export default PinguClient;