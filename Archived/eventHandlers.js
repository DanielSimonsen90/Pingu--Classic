//#region Event Handlers

//#region General Client events
const ClientString = `client`;
client.once('ready', () => HandleEvent('onready', client, `${ClientString}/onready`, client));
//client.on('debug', value => HandleEvent('ondebug', `${ClientString}/debug`, client, value)); //Bot is debugging(?)
client.on('error', err => HandleEvent('error', `${ClientString}/error`, client, err)); //Bot encountered and error
client.on('warn', warning => HandleEvent('warn', `${ClientString}/warn`, client, warning)); //Bot is warning(?)
client.on('invalidated', _ => HandleEvent('invalidated', `${ClientString}/invalidated`, client)); //Bot session is invalid?
//client.on('rateLimit', info => HandleEvent('rateLimit', `${ClientString}/rateLimit`, client, info)) //Bot is being rate limited

//#region Shard
const ShardString = `shard`;
client.on('shardReady', (id, deadGuildIDs) => HandleEvent('shardReady', client, `${ClientString}/${ShardString}/${ShardString}Ready`, id, deadGuildIDs));

client.on('shardReconnecting', id => HandleEvent('shardReconnecting', client, `${ClientString}/${ShardString}/${ShardString}Reconnecting`, client, id)); //Shard is reconnecting
client.on('shardResume', (id, replayedEvents) => HandleEvent('shardResume', client, `${ClientString}/${ShardString}/${ShardString}Resume`, client, id, replayedEvents)); //Shard is resuming
client.on('shardError', (err, id) => HandleEvent('shardError', client, `${ClientString}/${ShardString}/${ShardString}Error`, client, id, err)); //Shard error
client.on('shardDisconnect', (closeEvent, id) => HandleEvent('shardDisconnect', client, `${ClientString}/${ShardString}/${ShardString}Disconnect`, client, id, closeEvent)); //Shard disconnected
//#endregion

//#endregion

//#region Channel, typing & webhook
const ChannelString = `channel`;
client.on('channelCreate', channel => HandleEvent('channelCreate', client, `${ChannelString}/${ChannelString}Create`, channel)); //Channel created
client.on('channelUpdate', (preChannel, channel) => HandleEvent('channelUpdate', `${ChannelString}/${ChannelString}Update`, preChannel, channel)); //Channel updated
client.on('channelDelete', channel => HandleEvent('channelDelete', client, `${ChannelString}/${ChannelString}Delete`, channel)); //Channel deleted
client.on('channelPinsUpdate', (channel, updateDate) => HandleEvent('channelPinsUpdate', client, `${ChannelString}/${ChannelString}PinsUpdate`, channel, updateDate)) //Channel's pins were updated

client.on('typingStart', (channel, user) => HandleEvent('typingStart', client, `${ChannelString}/typingStart`, channel, user)); //User is typing in channel
client.on('webhookUpdate', channel => HandleEvent('webhookUpdate', client, `${ChannelString}/webhookUpdate`, channel)); //Webhook in channel was updated
//#endregion

//#region Guild, GuildMember, Emoji, Invite, Role & VoiceState

//#region Guild & presence
const GuildString = `guild`;
client.on('guildCreate', guild => HandleEvent('guildCreate', client, `${GuildString}/${GuildString}Create`, guild)); //First time joining a guild
client.on('guildUpdate', (preGuild, guild) => HandleEvent('guildUpdate', client, `${GuildString}/${GuildString}Update`, preGuild, guild)); //Guild was updated with new data
client.on('guildDelete', guild => HandleEvent('guildDelete', client, `${GuildString}/${GuildString}Delete`, guild)); //Leaving a guild
client.on('guildUnavailable', guild => HandleEvent('guildUnavailable', client, `${GuildString}/${GuildString}Unavailable`, guild)) //Guild becomes unavailable/crashes

client.on('guildBanAdd', (guild, user) => HandleEvent('guildBanAdd', client, `${GuildString}/${GuildString}BanAdd`, guild, user)) //Member was banned from Guild
client.on('guildBanRemove', (guild, user) => HandleEvent('guildBanRemove', client, `${GuildString}/${GuildString}BanRemove`, guild, user)) //Member was unbanned from Guild
client.on('guildIntegrationsUpdate', guild => HandleEvent('guildIntegrationsUpdate', client, `${GuildString}/${GuildString}IntegrationsUpdate`, guild)) //Guild integration (new bot, webhook, channel followed)

client.on('presenceUpdate', (prePresence, presence) => HandleEvent('presenceUpdate', client, `${GuildString}/presenceUpdate`, prePresence, presence)); //Activity Updated
//#endregion

//#region Guild Member
const GuildMemberString = `guildMember`;
client.on('guildMemberAdd', member => HandleEvent('guildMemberAdd', client, `${GuildString}/${GuildMemberString}/${GuildMemberString}Add`, member)); //New guild member
client.on('guildMemberUpdate', (preMember, member) => HandleEvent('guildMemberUpdate', client, `${GuildString}/${GuildMemberString}/${GuildMemberString}Update`, preMember, member)); //Member changed
client.on('guildMemberRemove', member => HandleEvent('guildMemberRemove', client, `${GuildString}/${GuildMemberString}/${GuildMemberString}Remove`, member)); //Guild member left

//client.on('guildMemberAvailable', member => HandleEvent('guildMemberAvailable', client, `${GuildString}/${GuildMemberString}/${GuildMemberString}Available`, member)) //Member becomes available/online
client.on('guildMembersChunk', (members, guild, collectionInfo) => HandleEvent('guildMembersChunk', client, `${GuildString}/${GuildMemberString}/${GuildMemberString}sChunk`, members, guild, collectionInfo)) //Chunk of members recieved
//client.on('guildMemberSpeaking', (member, speakingState) => HandleEvent('guildMemberSpeaking', client, `${GuildString}/${GuildMemberString}/${GuildMemberString}Speaking`, member, speakingState)) //Member changes speaking state
//#endregion

//#region Emoji
const EmojiString = `emoji`;
client.on('emojiCreate', emote => HandleEvent('emojiCreate', client, `${GuildString}/${EmojiString}/${EmojiString}Create`, emote)) //Emoji was created
client.on('emojiUpdate', (preEmote, emote) => HandleEvent('emojiUpdate', client, `${GuildString}/${EmojiString}/${EmojiString}Update`, preEmote, emote)) //Emoji was created
client.on('emojiDelete', emote => HandleEvent('emojiDelete', client, `${GuildString}/${EmojiString}/${EmojiString}Delete`, emote)) //Emoji was created
//#endregion

//#region Invite
const InviteString = `invite`;
client.on('inviteCreate', invite => HandleEvent('inviteCreate', client, `${GuildString}/${InviteString}/${InviteString}Create`, invite)); //Invite was created
client.on('inviteDelete', invite => HandleEvent('inviteDelete', client, `${GuildString}/${InviteString}/${InviteString}Delete`, invite)); //Invite was deleted
//#endregion

//#region Role
const RoleString = `role`;
client.on('roleCreate', role => HandleEvent('roleCreate', client, `${GuildString}/${RoleString}/${RoleString}Create`, role)); //Role was created
client.on('roleUpdate', (preRole, role) => HandleEvent('roleUpdate', client, `${GuildString}/${RoleString}/${RoleString}Update`, preRole, role)); //Role was updated
client.on('roleDelete', role => HandleEvent('roleDelete', client, `${GuildString}/${RoleString}/${RoleString}Delete`, role)); //Role was deleted
//#endregion

client.on('voiceStateUpdate', (preState, state) => HandleEvent('voiceStateUpdate', client, `${GuildString}/voiceStateUpdate`, preState, state)); //Member was changed in voice chat

//#endregion

//#region Message & Message Reaction
const MessageString = `message`;
client.on('message', message => HandleEvent('message', client, `${MessageString}/${MessageString}`, message)); //Message was sent by anyone 
client.on('messageUpdate', (preMessage, message) => HandleEvent('messageUpdate', client, `${MessageString}/${MessageString}Update`, preMessage, message)) //Message was edited
client.on('messageDelete', message => HandleEvent('messageDelete', client, `${MessageString}/${MessageString}Delete`, message)); //Message was deleted
client.on('messageDeleteBulk', messages => HandleEvent('messageDeleteBulk', client, `${MessageString}/${MessageString}DeleteBulk`, messages)) //Messages was deleted in bulk

//#region Message Reaction
const MessageReactionString = `${MessageString}Reaction`;
client.on('messageReactionAdd', (reaction, user) => HandleEvent('messageReactionAdd', client, `${MessageString}/${MessageReactionString}/${MessageReactionString}Add`, reaction, user)) //User reacted to message
client.on('messageReactionRemove', (reaction, user) => HandleEvent('messageReactionRemove', client, `${MessageString}/${MessageReactionString}/${MessageReactionString}Remove`, reaction, user)) //User unreacted to message
client.on('messageReactionRemoveEmoji', reaction => HandleEvent('messageReactionRemoveEmoji', client, `${MessageString}/${MessageReactionString}/${MessageReactionString}RemoveEmoji`, reaction)) //All reactions to an emoji was removed
client.on('messageReactionRemoveAll', message => HandleEvent('messageReactionRemoveAll', client, `${MessageString}/${MessageReactionString}/${MessageReactionString}RemoveAll`, message)) //ALl reactions were removed from message
//#endregion

//#endregion

client.on('userUpdate', (preUser, user) => HandleEvent(`userUpdate`, client, preUser, user)); //User updated

//#endregion
