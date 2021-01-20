//#region Variables
const { Client, Collection, Guild, GuildAuditLogs, MessageEmbed } = require('discord.js'),
    { token } = require('./config.json'),
    { CategoryNames } = require('./commands/4 DevOnly/update'),
    { PinguLibrary, Error, DiscordPermissions, PinguGuild } = require('./PinguPackage'),
    fs = require('fs'),
    client = new Client();
client.commands = new Collection();
//#endregion

//Does individual command work?
for (var x = 1; x < CategoryNames.length; x++) {
    let path = `${x} ${CategoryNames[x]}`;

    const ScriptCollection = fs.readdirSync(`./commands/${path}/`).filter(file => file.endsWith('.js'));

    for (const file of ScriptCollection) {
        try {
            const command = require(`./commands/${path}/${file}`);
            client.commands.set(command.name, command);
        } catch (err) {
            PinguLibrary.DanhoDM(client, `"${file}" threw an exception:\n${err.message}\n${err.stack}\n`)
        }
    }
}

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

//#region Guild
const GuildString = `guild`;
client.on('guildCreate', guild => HandleEvent(`${GuildString}/${GuildString}Create`, { guild })); //First time joining a guild
client.on('guildUpdate', (preGuild, guild) => HandleEvent(`${GuildString}/${GuildString}Update`, { preGuild, guild })); //Guild was updated with new data
client.on('guildDelete', guild => HandleEvent(`${GuildString}/${GuildString}Delete`, { guild })); //Leaving a guild
client.on('guildUnavailable', guild => HandleEvent(`${GuildString}/${GuildString}Unavailable`, { guild })) //Guild becomes unavailable/crashes

client.on('guildBanAdd', (guild, user) => HandleEvent(`${GuildString}/${GuildString}BanAdd`, { guild, user })) //Member was banned from Guild
client.on('guildBanRemove', (guild, user) => HandleEvent(`${GuildString}/${GuildString}BanRemove`, { guild, user })) //Member was unbanned from Guild
client.on('guildIntegrationsUpdate', guild => HandleEvent(`${GuildString}/${GuildString}IntegrationsUpdate`, { guild })) //Guild integration (new bot, webhook, channel followed)

//client.on('presenceUpdate', (prePresence, presence) => HandleEvent(`${GuildString}/presenceUpdate`, { prePresence, presence })); //Activity Updated
//#endregion

//#region Guild Member
const GuildMemberString = `guildMember`;
client.on('guildMemberAdd', member => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}Add`, { member })); //New guild member
client.on('guildMemberUpdate', (preMember, member) => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}Update`, { preMember, member })); //Member changed
client.on('guildMemberRemove', member => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}Remove`, { member })); //Guild member left

client.on('guildMemberAvailable', member => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}Available`, { member })) //Member becomes available/online
client.on('guildMembersChunk', (members, guild, collectionInfo) => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}sChunk`, { members, guild, collectionInfo })) //Chunk of members recieved
client.on('guildMemberSpeaking', (member, speakingState) => HandleEvent(`${GuildString}/${GuildMemberString}/${GuildMemberString}Speaking`, { member, speakingState })) //Member changes speaking state
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
client.on('messageUpdate', (preMessage, message) => HandleEvent(`${MessageString}/${MessageString}Update`, {preMessage, message})) //Message was edited
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
        console.log(`Emitting ${event.name}`);
        event.execute(client, parameters);
        SendToLog();
    }
    catch (err) { await PinguLibrary.errorLog(client, `${eventName} error`, null, new Error(err)); }

    async function SendToLog() {
        let emitAssociator = parameters.guild ? parameters.guild.name : parameters.message ? parameters.message.author.tag : parameters.member ? parameters.member.user.tag :
            parameters.user ? parameters.user.tag : parameters.reaction ? parameters.reaction.users.cache.last().tag : parameters.messages ? parameters.messages.last().tag :
                parameters.emote ? parameters.emote.author.tag : parameters.client ? client.user.tag : parameters.invite ? parameters.invite.inviter :
                    parameters.presence ? parameters.presence.user.tag : parameters.role ? parameters.role.guild.name : parameters.state ? parameters.state.member.user.tag : "Unknown";

        let specialEvents = ['channelUpdate', 'roleUpdate', 'guildUpdate', 'emojiUpdate', 'webhookUpdate', 'guildMemberUpdate'].map(e => `events: ${e}`);
        if (specialEvents.includes(event.name)) emitAssociator = await GetFromAuditLog();
        

        let emitterType = parameters.guild ? 'guild' : 'user';

        //if (emitter == client.user.tag && event.name == 'events: message') console.log(parameters.message.content);

        if (emitAssociator == 'Unknown') PinguLibrary.errorLog(client, `Event parameter for ${event.name} was not recognized!`);
        if (parameters.message && ['event-log', 'ping-log', 'console-log'].includes(parameters.message.channel.name)) return;
        PinguLibrary.eventLog(client, CreateEmbed());

        async function GetFromAuditLog() {
            let eventName = event.name.split(':')[1];
            eventName = eventName.substring(1, eventName.length);
            const noAuditLog = `**No Audit Log Permissions**`;

            switch (eventName) {
                case 'channelUpdate': return !parameters.channel.guild ? parameters.channel.recipient.tag : await GetInfo(parameters.channel.guild, 'CHANNEL_UPDATE');
                case 'roleUpdate': return await GetInfo(parameters.role.guild, 'ROLE_UPDATE');
                case 'guildUpadte': return await GetInfo(parameters.guild, 'GUILD_UPDATE');
                case 'emojiUpdate': return await GetInfo(parameters.emote.guild, 'EMOJI_UPDATE');
                case 'webhookUpdate': return await GetInfo(parameters.webhook.guild, 'WEBHOOK_UPDATE');
                case 'guildMemberUpdate': return await GetInfo(parameters.member.guild, 'GUILD_UPDATE');
                default: PinguLibrary.errorLog(client, `"${eventName}" was not recognized as an event name when searching from audit log`); return "Unknown";
            }

            /**@param {Guild} guild
            /**@param {import('discord.js').GuildAuditLogsAction} auditLogEvent
             * @returns {Promise<string>} */
            async function GetInfo(guild, auditLogEvent) {
                let auditLogs = await getAuditLogs(guild, auditLogEvent);
                if (auditLogs == noAuditLog) return noAuditLog;
                return auditLogs.entries.last().executor.tag;
            }
            /**@param {Guild} guild
             @param {import('discord.js').GuildAuditLogsAction} type
             @returns {Promise<GuildAuditLogs | string>}*/
            async function getAuditLogs(guild, type) {
                if (!guild.me.hasPermission(DiscordPermissions.VIEW_AUDIT_LOG))
                    return noAuditLog;

                return await guild.fetchAuditLogs({ type });
            }
        }
        function CreateEmbed() {
            let eventName = event.name.split(':')[1];
            eventName = eventName.substring(1, eventName.length);

            let defaultEmbed = new MessageEmbed()
                .setTitle(eventName)
                .setAuthor(emitAssociator, (emitAssociator == "Unknown" ? null :
                    emitAssociator.match(`/#\d{4}$/g`) ?
                        client.users.cache.find(u => u.tag == emitAssociator).avatarURL() :
                        client.guilds.cache.find(g => g.name == emitAssociator).iconURL()))
                .setColor(getColor())
                .setTimestamp(Date.now());
            if (event.content) {
                defaultEmbed.setDescription(event.content.description);
                defaultEmbed.addFields(event.content.fields);
            }
            return defaultEmbed;

            function getColor() {
                if (eventName.includes('Create')) return `#18f151`;
                else if (eventName.includes('Delete')) return `#db1108`;
                else if (eventName.includes('Update')) return `#ddfa00`;
                else return PinguGuild.GetPGuild(PinguLibrary.SavedServers.PinguSupport(client)).embedColor || PinguLibrary.DefaultEmbedColor;
            }
        }
    }
}

client.login(token);