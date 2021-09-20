"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguClient = void 0;
const discord_js_1 = require("discord.js");
const fs = require("fs");
const request = require("request");
const PinguBadge_1 = require("../badge/PinguBadge");
const achievements_1 = require("../achievements");
const PinguEvent_1 = require("../handlers/Pingu/PinguEvent");
const PinguClientBase_1 = require("./PinguClientBase");
class PinguClient extends PinguClientBase_1.default {
    constructor(config, permissions, subscribedEvents, dirname, commandsPath, eventsPath, options) {
        super(config, permissions, subscribedEvents, dirname, commandsPath, eventsPath, options);
    }
    //#endregion
    //#region Public Methods
    emit(key, ...args) {
        return super.emit(key, ...args);
    }
    //#region Gets
    getSharedServers(user) {
        return this.guilds.cache.filter(g => g.members.cache.has(user.id)).valueArray();
    }
    getTextChannel(guildId, channelName) {
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
        return channel;
    }
    getImage(script, imageName, extension = 'png') {
        return `./embedImages/${script}/${imageName}.${extension}`;
    }
    getBadges(user) { return PinguBadge_1.getBadges(user); }
    //#endregion
    async requestImage(message, pGuildClient, caller, types, searchTerm) {
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
        if (!searchTerm)
            searchTerm = type => `${type} ${caller}`;
        // we request 10 items
        request(`https://www.googleapis.com/customsearch/v1?key=${config.api_key}&cx=${config.google_custom_search}&q=${searchTerm(type)}&searchType=image&alt=json&num=10&start=${page}`, async (err, res, body) => {
            if (err)
                return this.log('error', `Error getting results when searching for ${searchTerm(type)}`, message.content, new Error(err), {
                    params: { message, pGuildClient, caller, types },
                    additional: { page, type, keys: { api_key: config.api_key, google_custom_search: config.google_custom_search } }
                });
            try {
                var data = JSON.parse(body);
            }
            catch (err) {
                this.log('error', `Getting data in ${caller}, PinguLibrary.RequestImage()`, message.content, new Error(err), {
                    params: { message, pGuildClient, caller, types },
                    additional: { page, type, data }
                });
            }
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
            return message.channel.sendEmbeds(new discord_js_1.MessageEmbed()
                .setImage(data.items[Math.floor(Math.random() * data.items.length)].link)
                .setColor(pGuildClient.embedColor || this.DefaultEmbedColor));
        });
    }
    async AchievementCheck(data, key, type, callbackParams) {
        return achievements_1.AchievementCheck(this, data, key, type, callbackParams);
    }
    //#endregion
    //#region Protected Methods
    handlePath(path, type) {
        if (!path)
            return;
        const files = fs.readdirSync(path);
        for (const file of files) {
            try {
                if (file.endsWith(`.js`)) {
                    let module = require(`${path}/${file}`);
                    module.path = `${path}/${file}`;
                    if (type == 'event') {
                        if (!module.name || !this.subscribedEvents.find(e => module.name == e))
                            continue;
                        const type = module.name;
                        const event = module;
                        this.events.set(event.name, event);
                        this.on(event.name, (...params) => {
                            this.handleEvent(event.name, ...params); //Handle as Pingu event
                        });
                    }
                    else if (type == 'command')
                        this.commands.set(module.name, module);
                    else
                        console.warn(`"${type}" was not recognized!`);
                }
                else if (file.endsWith('.png') || file.toLowerCase().includes('archived'))
                    continue;
                else
                    this.handlePath(`${path}/${file}`, type);
            }
            catch (err) {
                console.error(`"${file}" threw an exception:\n${err.message}\n${err.stack}\n`);
            }
        }
    }
    //#endregion
    //#region Private Methods
    handleEvent(caller, ...args) {
        if (this.subscribedEvents.find(e => e == caller))
            try {
                PinguEvent_1.HandleEvent(caller, this, ...args);
            }
            catch (err) {
                this.log('error', `Event error`, null, err, { params: { caller, args } });
            }
        return this;
    }
}
exports.PinguClient = PinguClient;
exports.default = PinguClient;
