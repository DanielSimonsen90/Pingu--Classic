//#region Variables
const { Client, Collection, Guild, MessageEmbed, GuildAuditLogsEntry } = require('discord.js'),
    { CategoryNames } = require('./commands/4 DevOnly/update'),
    { PinguLibrary, Error, DiscordPermissions, PinguGuild, PinguEvents } = require('./PinguPackage'),
    fs = require('fs'),
    client = new Client();
client.commands = new Collection();
client.events = new Collection();
//#endregion

//#region Set Commands & Events
for (var x = 1; x < CategoryNames.length; x++) {
    let path = `${x} ${CategoryNames[x]}`;

    const ScriptCollection = fs.readdirSync(`./commands/${path}/`).filter(file => file.endsWith('.js'));

    for (const file of ScriptCollection) {
        try {
            const command = require(`./commands/${path}/${file}`);
            client.commands.set(command.name, command);
        } catch (err) { PinguLibrary.DanhoDM(client, `"${file}" threw an exception:\n${err.message}\n${err.stack}\n`); }
    }
}

/**@param {string} path*/
function HandlePath(path) {
    try {
        let collection = fs.readdirSync(path);
        for (var file of collection) {
            if (file.endsWith(`.js`)) {
                let event = require(`${path}/${file}`);
                event.path = `${path}/${file}`;
                event.name = event.name.split(':')[1];
                event.name = event.name.substring(1, event.name.length);;
                client.events.set(event.name, event);
            } else HandlePath(`${path}/${file}`);
        }
    } catch (err) { PinguLibrary.DanhoDM(client, `"${file}" threw an exception:\n${err.message}\n${err.stack}\n`) }
}
HandlePath(`./events`);
//#endregion

//#region General Client events
const ClientString = `client`;
client.once('ready', () => HandleEvent(`${ClientString}/onready`, { client })); //Bot is ready to be (ab)used
//client.on('debug', value => HandleEvent(`${ClientString}/debug`, { client, value })); //Bot is debugging(?)
client.on('error', err => HandleEvent(`${ClientString}/error`, { client, err })); //Bot encountered and error
client.on('warn', warning => HandleEvent(`${ClientString}/warn`, { client, warning })); //Bot is warning(?)
client.on('invalidated', _ => HandleEvent(`${ClientString}/invalidated`, { client })); //Bot session is invalid?
//client.on('rateLimit', info => HandleEvent(`${ClientString}/rateLimit`, { client, info })) //Bot is being rate limited

//#region Shard
const ShardString = `shard`;
client.on('shardReady', (id, deadGuildsIDs) => HandleEvent(`${ClientString}/${ShardString}/${ShardString}Ready`, { client, id, deadGuildsIDs })); //Shard is ready
client.on('shardReconnecting', id => HandleEvent(`${ClientString}/${ShardString}/${ShardString}Reconnecting`, { client, id })); //Shard is reconnecting
client.on('shardResume', (id, replayedEvents) => HandleEvent(`${ClientString}/${ShardString}/${ShardString}Resume`, { client, id, replayedEvents })); //Shard is resuming
client.on('shardError', (err, id) => HandleEvent(`${ClientString}/${ShardString}/${ShardString}Error`, { client, id, err })); //Shard error
client.on('shardDisconnect', (closeEvent, id) => HandleEvent(`${ClientString}/${ShardString}/${ShardString}Disconnect`, { client, id, closeEvent })); //Shard disconnected
//#endregion

//#endregion

//#region Channel, typing & webhook
const ChannelString = `channel`;
client.on('channelCreate', channel => HandleEvent(`${ChannelString}/${ChannelString}Create`, { channel })); //Channel created
client.on('channelUpdate', (preChannel, channel) => HandleEvent(`${ChannelString}/${ChannelString}Update`, { preChannel, channel })); //Channel updated
client.on('channelDelete', channel => HandleEvent(`${ChannelString}/${ChannelString}Delete`, { channel })); //Channel deleted
client.on('channelPinsUpdate', (channel, updateDate) => HandleEvent(`${ChannelString}/${ChannelString}PinsUpdate`, { channel, updateDate })) //Channel's pins were updated

client.on('typingStart', (channel, user) => HandleEvent(`${ChannelString}/typingStart`, { channel, user })); //User is typing in channel
client.on('webhookUpdate', channel => HandleEvent(`${ChannelString}/webhookUpdate`, { channel })); //Webhook in channel was updated
//#endregion

//#region Guild, GuildMember, Emoji, Invite, Role & VoiceState

//#region Guild & presence
const GuildString = `guild`;
client.on('guildCreate', guild => HandleEvent(`${GuildString}/${GuildString}Create`, { guild })); //First time joining a guild
client.on('guildUpdate', (preGuild, guild) => HandleEvent(`${GuildString}/${GuildString}Update`, { preGuild, guild })); //Guild was updated with new data
client.on('guildDelete', guild => HandleEvent(`${GuildString}/${GuildString}Delete`, { guild })); //Leaving a guild
client.on('guildUnavailable', guild => HandleEvent(`${GuildString}/${GuildString}Unavailable`, { guild })) //Guild becomes unavailable/crashes

client.on('guildBanAdd', (guild, user) => HandleEvent(`${GuildString}/${GuildString}BanAdd`, { guild, user })) //Member was banned from Guild
client.on('guildBanRemove', (guild, user) => HandleEvent(`${GuildString}/${GuildString}BanRemove`, { guild, user })) //Member was unbanned from Guild
client.on('guildIntegrationsUpdate', guild => HandleEvent(`${GuildString}/${GuildString}IntegrationsUpdate`, { guild })) //Guild integration (new bot, webhook, channel followed)

client.on('presenceUpdate', (prePresence, presence) => HandleEvent(`${GuildString}/presenceUpdate`, { prePresence, presence })); //Activity Updated
//#endregion

//#region Guild Member
const GuildMemberString = `guildMember`;
client.on('guildMemberAdd', member => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}Add`, { member })); //New guild member
client.on('guildMemberUpdate', (preMember, member) => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}Update`, { preMember, member })); //Member changed
client.on('guildMemberRemove', member => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}Remove`, { member })); //Guild member left

//client.on('guildMemberAvailable', member => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}Available`, { member })) //Member becomes available/online
client.on('guildMembersChunk', (members, guild, collectionInfo) => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}sChunk`, { members, guild, collectionInfo })) //Chunk of members recieved
//client.on('guildMemberSpeaking', (member, speakingState) => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}Speaking`, { member, speakingState })) //Member changes speaking state
//#endregion

//#region Emoji
const EmojiString = `emoji`;
client.on('emojiCreate', emote => HandleEvent(`${GuildString}/${EmojiString}/${EmojiString}Create`, { emote })) //Emoji was created
client.on('emojiUpdate', (preEmote, emote) => HandleEvent(`${GuildString}/${EmojiString}/${EmojiString}Update`, { preEmote, emote })) //Emoji was created
client.on('emojiDelete', emote => HandleEvent(`${GuildString}/${EmojiString}/${EmojiString}Delete`, { emote })) //Emoji was created
//#endregion

//#region Invite
const InviteString = `invite`;
client.on(`inviteCreate`, invite => HandleEvent(`${GuildString}/${InviteString}/${InviteString}Create`, { invite })); //Invite was created
client.on(`inviteDelete`, invite => HandleEvent(`${GuildString}/${InviteString}/${InviteString}Deleted`, { invite })); //Invite was deleted
//#endregion

//#region Role
const RoleString = `role`;
client.on('roleCreate', role => HandleEvent(`${GuildString}/${RoleString}/${RoleString}Create`, { role })); //Role was created
client.on('roleUpdate', (preRole, role) => HandleEvent(`${GuildString}/${RoleString}/${RoleString}Update`, { preRole, role })); //Role was updated
client.on('roleDelete', role => HandleEvent(`${GuildString}/${RoleString}/${RoleString}Delete`, { role })); //Role was deleted
//#endregion

client.on('voiceStateUpdate', (preState, state) => HandleEvent(`${GuildString}/voiceStateUpdate`, { preState, state })); //Member was changed in voice chat

//#endregion

//#region Message & Message Reaction
const MessageString = `message`;
client.on('message', message => HandleEvent(`${MessageString}/${MessageString}`, { message })); //Message was sent by anyone 
client.on('messageUpdate', (preMessage, message) => HandleEvent(`${MessageString}/${MessageString}Update`, { preMessage, message })) //Message was edited
client.on('messageDelete', message => HandleEvent(`${MessageString}/${MessageString}Delete`, { message })); //Message was deleted
client.on('messageDeleteBulk', messages => HandleEvent(`${MessageString}/${MessageString}DeleteBulk`, { messages })) //Messages was deleted in bulk

//#region Message Reaction
const MessageReactionString = `${MessageString}Reaction`;
client.on('messageReactionAdd', (reaction, user) => HandleEvent(`${MessageString}/${MessageReactionString}/${MessageReactionString}Add`, { reaction, user })) //User reacted to message
client.on('messageReactionRemove', (reaction, user) => HandleEvent(`${MessageString}/${MessageReactionString}/${MessageReactionString}Remove`, { reaction, user })) //User unreacted to message
client.on('messageReactionRemoveEmoji', reaction => HandleEvent(`${MessageString}/${MessageReactionString}/${MessageReactionString}RemoveEmoji`, { reaction })) //All reactions to an emoji was removed
client.on('messageReactionRemoveAll', message => HandleEvent(`${MessageString}/${MessageReactionString}/${MessageReactionString}RemoveAll`, { message })) //ALl reactions were removed from message
//#endregion

//#endregion

client.on('userUpdate', (preUser, user) => HandleEvent(`userUpdate`, { preUser, user })); //User updated

/**@param {string} path
 * @param {{}} parameters*/
async function HandleEvent(path, parameters) {
    let pathArr = path.split('/');
    let eventName = pathArr[pathArr.length - 1];

    try {
        var event = require(`./events/${path}`);
        event.execute(client, parameters);
        await SendToLog();
    }
    catch (err) { await PinguLibrary.errorLog(client, `${eventName} error`, null, new Error(err)); }

    async function SendToLog() {
        let emitAssociator = parameters.guild ? parameters.guild.name : parameters.message ? parameters.message.author.tag : parameters.member ? parameters.member.user.tag :
            parameters.user ? parameters.user.tag : parameters.reaction ? parameters.reaction.users.cache.last().tag : parameters.messages ? parameters.messages.last().tag :
                parameters.emote ? parameters.emote.author.tag : parameters.client ? client.user.tag : parameters.invite ? parameters.invite.inviter.tag :
                    parameters.presence ? parameters.presence.user.tag : parameters.role ? parameters.role.guild.name : parameters.state ? parameters.state.member.user.tag : "Unknown";

        let specialEvents = [
            'channelCreate', 'channelUpdate', 'channelDelete', 'channelPinsUpdate', 'webhookUpdate',
            'emojiCreate', 'emojiUpdate', 'emojiDelete',
            'guildBanAdd', 'guildBanRemove', 'guildMemberUpdate',
            'guildUpdate', 'guildIntergrationsUpdate',
            'roleCreate', 'roleUpdate', 'roleDelete'
        ];
        if (specialEvents.includes(event.name)) emitAssociator = await GetFromAuditLog();


        //let emitterType = parameters.guild ? 'guild' : 'user';
        //if (emitter == client.user.tag && event.name == 'events: message') console.log(parameters.message.content);

        if (emitAssociator == 'Unknown') PinguLibrary.errorLog(client, `Event parameter for ${event.name} was not recognized!`);
        if (parameters.message && ['event-log', 'ping-log', 'console-log'].includes(parameters.message.channel.name)) return;
        let embed = await CreateEmbed();
        if (embed) return await PinguLibrary.eventLog(client, embed);

        async function GetFromAuditLog() {
            const noAuditLog = PinguEvents.noAuditLog;

            switch (event.name) {
                case 'channelCreate': return !parameters.channel.guild ? parameters.channel.recipient.tag : await GetInfo(parameters.channel.guild, 'CHANNEL_CREATE');
                case 'channelUpdate': return !parameters.channel.guild ? parameters.channel.recipient.tag : await GetInfo(parameters.channel.guild, 'CHANNEL_UPDATE');
                case 'channelDelete': return !parameters.channel.guild ? parameters.channel.recipient.tag : await GetInfo(parameters.channel.guild, 'CHANNEL_DELETE');
                case 'channelPinsUpdate': return !parameters.channel.guild ? parameters.channel.recipient.tag : (await GetInfo(parameters.channel.guild, 'MESSAGE_PIN') || await GetInfo(parameters.channel.guild, 'MESSAGE_UNPIN'));
                case 'webhookUpdate': return await GetInfo(parameters.channel.guild, 'WEBHOOK_UPDATE') || await GetInfo(parameters.channel.guild, 'WEBHOOK_CREATE');

                case 'emojiCreate': return await GetInfo(parameters.emote.guild, 'EMOJI_CREATE');
                case 'emojiUpdate': return await GetInfo(parameters.emote.guild, 'EMOJI_UPDATE');
                case 'emojiDelete': return await GetInfo(parameters.emote.guild, 'EMOJI_DELETE');

                case 'guildBanAdd': return await GetInfo(parameters.guild, 'MEMBER_BAN_ADD');
                case 'guildMemberUpdate': return await GetInfo(parameters.member.guild, 'MEMBER_UPDATE');
                case 'guildBanRemove': return await GetInfo(parameters.guild, 'MEMBER_BAN_REMOVE');

                case 'guildUpdate': return await GetInfo(parameters.guild, 'GUILD_UPDATE');
                case 'guildIntegrationsUpdate': return await GetInfo(parameters.guild, 'INTEGRATION_UPDATE');

                case 'roleCreate': return await GetInfo(parameters.role.guild, 'ROLE_CREATE');
                case 'roleUpdate': return await GetInfo(parameters.role.guild, 'ROLE_UPDATE');
                case 'roleDelete': return await GetInfo(parameters.role.guild, 'ROLE_DELETE');
                default: PinguLibrary.errorLog(client, `"${eventName}" was not recognized as an event name when searching from audit log`); return "Unknown";
            }

            /**@param {Guild} guild
            /**@param {import('discord.js').GuildAuditLogsAction} auditLogEvent
             * @returns {Promise<string>} */
            async function GetInfo(guild, auditLogEvent) {
                let auditLogs = await getAuditLogs(guild, auditLogEvent);
                if (auditLogs == noAuditLog) return noAuditLog;
                return auditLogs.last().executor.tag;
            }
            /**@param {Guild} guild
             @param {import('discord.js').GuildAuditLogsAction} type
             @returns {Promise<Collection<string, GuildAuditLogsEntry> | string>}*/
            async function getAuditLogs(guild, type) {
                if (!guild.me.hasPermission(DiscordPermissions.VIEW_AUDIT_LOG))
                    return noAuditLog;

                return (await guild.fetchAuditLogs({ type })).entries.filter(e => new Date(Date.now()).getSeconds() - e.createdAt.getSeconds() <= 1);
            }
        }
        async function CreateEmbed() {
            let user = client.users.cache.find(u => u.tag == emitAssociator);
            let guild = client.guilds.cache.find(g => g.name == emitAssociator);

            let executed = new Date(Date.now());
            function getDoubleDigit(num) {
                return num < 10 ? `0${num}` : `${num}`;
            }
            let defaultEmbed = new MessageEmbed()
                .setTitle(event.name)
                .setAuthor(emitAssociator, (emitAssociator == "Unknown" ? null :
                    emitAssociator.match(/#\d{4}$/g) ?
                        user && user.avatarURL() :
                        guild && guild.iconURL()))
                .setColor(getColor())
                .setFooter(`${getDoubleDigit(executed.getHours())}.${getDoubleDigit(executed.getMinutes())}.${getDoubleDigit(executed.getSeconds())}:${executed.getMilliseconds()}`);
            if (event.setContent) {
                await event.setContent(parameters);

                if (!event.content) return null;
                defaultEmbed = CombineEmbeds();

                function CombineEmbeds() {
                    for (var key in event.content)
                        if (event.content[key])
                            defaultEmbed[key] = event.content[key];
                    return defaultEmbed;
                }
            }
            return defaultEmbed;

            function getColor() {
                if (eventName.includes('Create') || eventName.includes('Add')) return PinguEvents.Colors.Create;
                else if (eventName.includes('Delete') || eventName.includes('Remove')) return PinguEvents.Colors.Delete;
                else if (eventName.includes('Update')) return PinguEvents.Colors.Update;
                else return PinguGuild.GetPGuild(PinguLibrary.SavedServers.PinguSupport(client)).embedColor || PinguLibrary.DefaultEmbedColor;
            }
        }
    }
}

try { var { token } = require('../../PinguBetaToken.json') }
catch { token = require('./config.json').token; }
finally { client.login(token); }