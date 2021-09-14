"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinguEvent = exports.HandleEvent = exports.GoThroughObjectArray = exports.GoThroughArrays = exports.SetDescriptionValuesLink = exports.SetDescriptionValues = exports.SetRemove = exports.SetDescription = exports.UnknownUpdate = exports.GetAuditLogs = exports.noAuditLog = exports.LoggedCache = exports.Colors = void 0;
const discord_js_1 = require("discord.js");
const achievements_1 = require("../../achievements");
const Error_1 = require("../../../helpers/Error");
//#region Statics
exports.Colors = {
    Create: `#18f151`,
    Update: `#ddfa00`,
    Delete: `#db1108`
};
exports.LoggedCache = new Array();
exports.noAuditLog = `**No Audit Log Permissions**`;
async function GetAuditLogs(guild, type, key, target = null, seconds = 1) {
    if (!guild.me || !guild.me.permissions.has('VIEW_AUDIT_LOG'))
        return exports.noAuditLog;
    let now = new Date();
    let logs = await guild.fetchAuditLogs({ type });
    now.setSeconds(now.getSeconds() - seconds);
    let filteredLogs = logs.entries.filter(e => e.createdTimestamp > now.getTime());
    try {
        return key ? filteredLogs.find(e => e.changes.find(change => change.key == key) && (target ? e.target == target : true)).executor.tag : filteredLogs.first().executor.tag;
    }
    catch (err) {
        if (err.message == `Cannot read property 'executor' of undefined`)
            return exports.noAuditLog;
    }
}
exports.GetAuditLogs = GetAuditLogs;
function UnknownUpdate(previous, current) {
    let oldArr = Object.keys(previous);
    let currentArr = Object.keys(current);
    for (var i = 0; i < currentArr.length || i < oldArr.length; i++) {
        if (currentArr[i] != oldArr[i])
            return SetDescriptionValues('Unknown', oldArr[i], currentArr[i]);
    }
    return null;
}
exports.UnknownUpdate = UnknownUpdate;
function SetDescription(type, description) {
    return `[**${type}**]\n\n${description}`;
}
exports.SetDescription = SetDescription;
function SetRemove(type, previousValue, currentValue, SetString, RemoveString, descriptionMethod) {
    return currentValue && !previousValue ? SetDescription(type, SetString) :
        !currentValue && previousValue ? SetDescription(type, RemoveString) : descriptionMethod(type, previousValue, currentValue);
}
exports.SetRemove = SetRemove;
function SetDescriptionValues(type, previousValue, currentValue) {
    return SetDescription(type, `Old: ${previousValue}\n\nNew: ${currentValue}`);
}
exports.SetDescriptionValues = SetDescriptionValues;
function SetDescriptionValuesLink(type, previousValue, currentValue) {
    return SetDescription(type, `[Old](${previousValue})\n[New](${currentValue})`);
}
exports.SetDescriptionValuesLink = SetDescriptionValuesLink;
/**@param type [**${type}**]
 * @param preArr Previous array
 * @param curArr Current array
 * @param callback pre/new.find(i => callback(i, preItem/newItem))*/
function GoThroughArrays(type, preArr, curArr, callback) {
    let updateMessage = `[**${type}**] `;
    let added = GoThroguhArray(curArr, preArr);
    let removed = GoThroguhArray(preArr, curArr);
    if (!added.length && removed.length)
        return updateMessage += removed.join(`, `).substring(removed.join(', ').length - 2);
    else if (!removed.length && added.length)
        return updateMessage += added.join(`, `).substring(added.join(', ').length - 2);
    return updateMessage += `Unable to find out what changed!`;
    function GoThroguhArray(cycleArr, otherCycleArr) {
        let result = new Array();
        for (var item of cycleArr) {
            let old = otherCycleArr.find(i => callback(i, item));
            if (!old)
                result.push(item);
        }
        return result;
    }
}
exports.GoThroughArrays = GoThroughArrays;
function GoThroughObjectArray(type, preArr, curArr) {
    let updateMessage = `[**${type}**]\n`;
    let changes = new discord_js_1.Collection();
    if (preArr.length > curArr.length)
        return updateMessage += `Removed ${type.toLowerCase()}`;
    else if (curArr.length > preArr.length)
        return updateMessage += `Added new ${type.toLowerCase()}`;
    for (var i = 0; i < curArr.length; i++) {
        let newKeys = Object.keys(curArr[i]);
        let preKeys = Object.keys(preArr[i]);
        newKeys.forEach(key => {
            if (curArr[key] == preArr[key])
                return;
            else if (!preArr[key])
                changes.set(key, `__Added__: ${curArr[key]}`);
            else
                changes.set(key, `__Changed__: **${preArr[key]}** => **${curArr[key]}**`);
        });
        preKeys.forEach(key => {
            if (changes.get(key) || preKeys[key] == newKeys[key])
                return;
            else if (!curArr[key])
                changes.set(key, `__Removed__: ${preArr[key]}`);
        });
    }
    changes.keyArray().forEach(key => updateMessage += `**${key}**: ${changes.get(key)}\n`);
    return updateMessage;
}
exports.GoThroughObjectArray = GoThroughObjectArray;
async function HandleEvent(caller, client, ...args) {
    const event = client.events.get(caller);
    // console.log(caller)
    if (!event || !event.execute && !event.setContent)
        return; //Event not found or doesn't have any callbacks assigned
    async function execute() {
        try {
            return event.execute(client, ...args);
        }
        catch (err) {
            client.log('error', `${event.name}.execute`, null, new Error_1.default(err), {
                params: { caller, args: { ...args } },
                additional: { event, args }
            });
        }
    }
    async function setContent() {
        if (!client.isLive)
            return;
        try {
            return SendToLog();
        }
        catch (err) {
            client.log('error', `${event.name}.setContent`, null, new Error_1.default(err), {
                params: { caller, args: { ...args } },
                additional: { event, args }
            });
        }
    }
    try {
        if (event.execute && event.setContent)
            await Promise.all([execute(), setContent()]);
        else if (event.execute)
            await execute();
        else if (event.setContent)
            await setContent();
    }
    catch (err) {
        client.log('error', err.message, JSON.stringify(args, null, 2), err, {
            params: { caller, args: { ...args } },
            additional: { event }
        });
    }
    const achievementOptions = (parameters = {}, type) => {
        if (!parameters)
            return null;
        switch (type) {
            case 'User': return [
                parameters.author, parameters.user, parameters.inviter, FindClass("User"),
                parameters.users && parameters.users.first && parameters.users.first(),
                parameters.last && parameters.last()
            ].filter(v => v)[0];
            case 'GuildMember': return [parameters.member, FindClass("GuildMember")].filter(v => v)[0];
            case 'Guild': return [parameters.guild, FindClass("Guild")].filter(v => v)[0];
        }
    };
    function getAchiever(type) {
        let result = null;
        for (const arg of args) {
            if (result)
                return result;
            else
                result = achievementOptions(arg, type);
        }
    }
    var [user, guild, guildMember] = [
        getAchiever('User'),
        getAchiever('Guild'),
        getAchiever('GuildMember')
    ];
    user = !user && guildMember ? guildMember.user : null;
    achievements_1.AchievementCheck(client, { user, guild, guildMember }, 'EVENT', caller, args);
    async function SendToLog() {
        const emitAssociatorOptions = (parameter = {}) => {
            const options = [
                parameter.author?.tag,
                parameter.tag,
                parameter.user?.tag,
                parameter.member?.user?.tag,
                parameter.users?.cache.last?.()?.tag,
                parameter.last?.()?.author.tag,
                parameter.inviter?.tag,
                parameter.name,
                parameter.guild?.name
            ];
            return options.filter(v => v)[0];
        };
        let emitAssociator = "";
        for (const arg of args) {
            if (emitAssociator)
                break;
            else
                emitAssociator = emitAssociatorOptions(arg);
        }
        if (!emitAssociator)
            emitAssociator = "Unknown";
        //Don't log if emitter isn't a PinguUser
        if (emitAssociator.match(/#\d{4}$/g)) {
            var isPinguUser = false;
            let user = client.users.cache.find(u => u.tag == emitAssociator);
            if (user) {
                isPinguUser = !user.bot && client.pUsers.get(user) != null;
            }
            // if (!isPinguUser) return null;
        }
        let specialEvents = [
            'channelCreate', 'channelUpdate', 'channelDelete', 'channelPinsUpdate',
            'webhookUpdate',
            'emojiCreate', 'emojiUpdate', 'emojiDelete',
            'guildBanAdd', 'guildBanRemove', 'guildMemberUpdate',
            'guildUpdate', 'guildIntergrationsUpdate',
            'roleCreate', 'roleUpdate', 'roleDelete',
            'messageBulkDelete'
        ];
        if (specialEvents.includes(caller))
            emitAssociator = await GetFromAuditLog();
        if (emitAssociator == 'Unknown')
            throw { message: `Event parameter for ${event.name} was not recognized!` };
        if (caller.startsWith('message') &&
            !caller.startsWith('messageReaction') &&
            ['event-log-📹', 'ping-log-🏓', 'console-log-📝'].includes(args[0].channel && args[0].channel.name))
            return;
        let embed = await CreateEmbed();
        if (embed)
            return client.log('event', embed);
        async function GetFromAuditLog() {
            const { noAuditLog } = PinguEvent;
            switch (caller) {
                case 'channelCreate': return !args[0].guild ? args[0].recipient.tag : await GetInfo(args[0].guild, 'CHANNEL_CREATE');
                case 'channelUpdate': return !args[0].guild ? args[0].recipient.tag : await GetInfo(args[0].guild, 'CHANNEL_UPDATE');
                case 'channelDelete': return !args[0].guild ? args[0].recipient.tag : await GetInfo(args[0].guild, 'CHANNEL_DELETE');
                case 'channelPinsUpdate': return !args[0].guild ? args[0].recipient.tag :
                    (await GetInfo(args[0].guild, 'MESSAGE_PIN') || await GetInfo(args[0].guild, 'MESSAGE_UNPIN'));
                case 'webhookCreate': return await GetInfo(args[0].guild, 'WEBHOOK_CREATE');
                case 'webhookUpdate': return await GetInfo(args[0].guild, 'WEBHOOK_UPDATE');
                case 'webhookDelete': return await GetInfo(args[0].guild, 'WEBHOOK_DELETE');
                case 'emojiCreate': return await GetInfo(args[0].guild, 'EMOJI_CREATE');
                case 'emojiUpdate': return await GetInfo(args[0].guild, 'EMOJI_UPDATE');
                case 'emojiDelete': return await GetInfo(args[0].guild, 'EMOJI_DELETE');
                case 'guildBanAdd': return await GetInfo(args[0], 'MEMBER_BAN_ADD');
                case 'guildMemberUpdate': return await GetInfo(args[0].guild, 'MEMBER_UPDATE');
                case 'guildBanRemove': return await GetInfo(args[0], 'MEMBER_BAN_REMOVE');
                case 'guildUpdate': return await GetInfo(args[0], 'GUILD_UPDATE');
                case 'guildIntegrationsUpdate': return await GetInfo(args[0], 'INTEGRATION_UPDATE');
                case 'messageBulkDelete': return await GetInfo(args[0].last().guild, 'MESSAGE_BULK_DELETE');
                case 'roleCreate': return await GetInfo(args[0].guild, 'ROLE_CREATE');
                case 'roleUpdate': return await GetInfo(args[0].guild, 'ROLE_UPDATE');
                case 'roleDelete': return await GetInfo(args[0].guild, 'ROLE_DELETE');
                default:
                    client.log('error', `"${event.name}" was not recognized as an event name when searching from audit log`);
                    return "Unknown";
            }
            async function GetInfo(guild, auditLogEvent) {
                let auditLogs = await getAuditLogs(guild, auditLogEvent);
                if (auditLogs == noAuditLog)
                    return noAuditLog;
                auditLogs = auditLogs;
                return auditLogs.last()?.executor.tag || PinguEvent.noAuditLog;
            }
            async function getAuditLogs(guild, type) {
                const me = guild.me || guild.member(guild.client.user);
                if (!me || !me.permissions.has('VIEW_AUDIT_LOG'))
                    return noAuditLog;
                return (await guild.fetchAuditLogs({ type })).entries.filter(e => new Date().getSeconds() - e.createdAt.getSeconds() <= 1);
            }
        }
        async function CreateEmbed() {
            let [user, guild, executed] = [
                client.users.cache.findByDisplayName(emitAssociator),
                client.guilds.cache.findByDisplayName(emitAssociator),
                new Date()
            ];
            const getDoubleDigit = (num) => num < 10 ? `0${num}` : `${num}`;
            let embed = new discord_js_1.MessageEmbed({
                title: event.name,
                author: {
                    name: emitAssociator,
                    iconURL: (!emitAssociator || emitAssociator == "Unknown" ? null : user?.avatarURL() || guild?.iconURL())
                },
                color: getColor(),
                footer: { text: `${getDoubleDigit(executed.getHours())}.${getDoubleDigit(executed.getMinutes())}.${getDoubleDigit(executed.getSeconds())}:${executed.getMilliseconds()}` }
            });
            if (event.setContent) {
                await event.setContent(client, new discord_js_1.MessageEmbed(), ...args);
                if (!event.content)
                    return null;
                embed = { ...embed, ...event.content };
            }
            return !embed.description && (embed.fields?.[0] || true) ? null : embed;
            function getColor() {
                if (event.name.includes('Create') || event.name.includes('Add'))
                    return PinguEvent.Colors.Create;
                else if (event.name.includes('Delete') || event.name.includes('Remove'))
                    return PinguEvent.Colors.Delete;
                else if (event.name.includes('Update'))
                    return PinguEvent.Colors.Update;
                try {
                    return client.pGuilds.get(client.savedServers.get('Pingu Support')).clients.find(c => c._id == client.id).embedColor;
                }
                catch {
                    return client.DefaultEmbedColor;
                }
            }
        }
    }
    function FindClass(type) {
        const objectsOfClass = args.filter(a => a && a.constructor && a.constructor.name == type);
        return objectsOfClass ? objectsOfClass[objectsOfClass.length - 1] : null;
    }
}
exports.HandleEvent = HandleEvent;
const PinguHandler_1 = require("../PinguHandler");
class PinguEvent extends PinguHandler_1.default {
    //#region Statics
    static Colors = exports.Colors;
    static noAuditLog = exports.noAuditLog;
    static LoggedCache = exports.LoggedCache;
    static async GetAuditLogs(guild, type, key, target = null, seconds = 1) { return GetAuditLogs(guild, type, key, target, seconds); }
    static UnknownUpdate(old, current) { return UnknownUpdate(old, current); }
    static SetDescription(type, description) { return SetDescription(type, description); }
    static SetRemove(type, oldValue, newValue, SetString, RemoveString, descriptionMethod) {
        return SetRemove(type, oldValue, newValue, SetString, RemoveString, descriptionMethod);
    }
    static SetDescriptionValues(type, oldValue, newValue) { return SetDescriptionValues(type, oldValue, newValue); }
    static SetDescriptionValuesLink(type, oldValue, newValue) { return SetDescriptionValuesLink(type, oldValue, newValue); }
    static GoThroughArrays(type, preArr, newArr, callback) { return GoThroughArrays(type, preArr, newArr, callback); }
    static GoThroughObjectArray(type, preArr, newArr) { return GoThroughObjectArray(type, preArr, newArr); }
    static async HandleEvent(caller, client, ...args) { return HandleEvent(caller, client, ...args); }
    //#endregion
    constructor(name, handlers) {
        super(name);
        handlers ?? {};
        const { setContent, execute } = handlers;
        if (setContent)
            this.setContent = setContent;
        this.execute = execute;
    }
    content;
    async setContent(client, embed, ...args) { return null; }
    async execute(client, ...args) { return null; }
}
exports.PinguEvent = PinguEvent;
exports.default = PinguEvent;
