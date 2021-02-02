const { MessageEmbed, Message, Guild } = require('discord.js');
const { PinguGuild, PinguLibrary, DiscordPermissions } = require('../../PinguPackage');
module.exports = {
    name: 'serverinfo',
    description: 'Sends server information.',
    usage: '[BigBoiInfo: all] [emotes [emote name] | features]',
    guildOnly: true,
    id: 1,
    example: ["", "all", "emotes", "emotes FeelsBadMan", "features"],
    permissions: [DiscordPermissions.SPEAK, DiscordPermissions.EMBED_LINKS, DiscordPermissions.USE_EXTERNAL_EMOJIS],
    /**@param {{message: Message, args: string[]}}*/
    async execute({ message, args }) {
        const bigboiinfo = args[0] && args[0].toLowerCase() == 'all',
            serverGuild = message.guild,
            emote = serverGuild.emojis.cache.find(e => args.includes(e.name));

        if (!args.includes('emotes') && !args.includes('features'))
            return SendEmbeds(message, serverGuild, bigboiinfo);

        else if (args.includes('emotes'))
            if (emote) {
                //const author = emote.author ? emote.author.username : 'null';
                return message.channel.send(new MessageEmbed()
                    .setTitle(`${emote.name}`)
                    .setThumbnail(emote.url)
                    .setColor(await GetPGuildColor())
                    //.addField(`Created by`, author, true)
                    .addField(`Created at`, emote.createdAt, true))
            }
            else return SendEmotes(message, serverGuild);

        else if (args.includes('features'))
            return SendFeatures(message, serverGuild);

        message.channel.send(`Something happened.. I shouldn't've been here..`);
        PinguLibrary.errorLog(message.client, `Ran line 34, which was not intended`, message.content);
    },
};

/**@param {Message} message 
 * @param {boolean} bigboiinfo*/
async function SendCallerInfo(message, bigboiinfo) {
    let { guild } = message;
    const DefaultThumbnail = guild.iconURL(),
        Description = guild.description ? guild.description : '',
        color = await GetPGuildColor(guild);
    let savedEmotes = {
        boost: PinguLibrary.getEmote(message.client, 'guildBoost', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        partner: PinguLibrary.getEmote(message.client, 'partneredServer', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        verified: PinguLibrary.getEmote(message.client, 'verifiedServer', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        wumpus: PinguLibrary.getEmote(message.client, 'wumpusLove', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        channelAnnounce: PinguLibrary.getEmote(message.client, 'channelAnnounce', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        channelRules: PinguLibrary.getEmote(message.client, 'channelRules', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        channelStore: PinguLibrary.getEmote(message.client, 'channelStore', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        channelText: PinguLibrary.getEmote(message.client, 'channelText', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        channelVoice: PinguLibrary.getEmote(message.client, 'channelVoice', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        channelAFK: PinguLibrary.getEmote(message.client, 'channelAFK', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        channelCategory: PinguLibrary.getEmote(message.client, 'channelCategory', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        banner: PinguLibrary.getEmote(message.client, 'banner', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        invite: PinguLibrary.getEmote(message.client, 'invite', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        notification: PinguLibrary.getEmote(message.client, 'notification', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        banHammer: PinguLibrary.getEmote(message.client, 'banHammer', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        widget: PinguLibrary.getEmote(message.client, 'widget', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        webhook: PinguLibrary.getEmote(message.client, 'webhook', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        channelIcon: PinguLibrary.getEmote(message.client, 'channelIcon', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        ownerCrown: PinguLibrary.getEmote(message.client, 'ownerCrown', PinguLibrary.SavedServers.PinguEmotes(message.client)),
        roleIcon: PinguLibrary.getEmote(message.client, 'roleIcon', PinguLibrary.SavedServers.PinguEmotes(message.client)),
    }

    /**@param {string} region*/
    function getRegionEmoji(region) {
        let america = {
            countries: ['us-east', 'brazil', 'us-central', 'us-south', 'us-west'],
            value: '🌎'
        };
        let europe = {
            countries: ['europe', 'africa', 'india', 'southafrica'],
            value: '🌍'
        };
        let asia = {
            countries: ['hongkong', 'japan', 'russia', 'singapore', 'sydney'],
            value: '🌏'
        }

        let returnValue;
        if (america.countries.includes(region)) returnValue = america.value;
        else if (europe.countries.includes(region)) returnValue = europe.value;
        else if (asia.countries.includes(region)) returnValue = asia.value;
        else {
            returnValue = europe.value;
            PinguLibrary.errorLog(message.client, `Unable to find region for ${region}`, message.content);
        }

        return returnValue + " Region";
    }
    /**@param {string} value*/
    function humanize(value) {
        let featureStrings = value.split('_');
        return featureStrings.map(str => str.charAt(0).toUpperCase() + str.substring(1, str.length).toLowerCase()).join(' ');
    }
    /**@param {string} permission
     * @param {MessageEmbed} embed
     * @param {string} title
     * @param {() => Promise<any>} value*/
    async function addField(permission, embed, title, value, inline) {
        return HasPermission(permission) ?
            embed.addField(title, await value(), inline != null ? inline : true) :
            embed.addField(title, `Missing **${humanize(permission)}** permission`, inline != null ? inline : true)
    }
    function HasPermission(permission) {
        return PinguLibrary.PermissionCheck(message, [permission]) == PinguLibrary.PermissionGranted;
    }

    let EmbedArray = [
        new MessageEmbed()
            .setTitle(`Server Information: ${guild.name}`)
            .setThumbnail(DefaultThumbnail)
            .setDescription(Description)
            .setFooter(`Server ID: ${guild.id}`)
            .setColor(color)
            .addField(`${savedEmotes.ownerCrown} Owner`, guild.owner, true)
            .addField(getRegionEmoji(guild.region), guild.region.charAt(0).toUpperCase() + guild.region.substring(1, guild.region.length), true)
            .addField(`⏰ Creation Date`, guild.createdAt.toUTCString(), false)
            .addField(`👥 Total members`, guild.memberCount, true)
            .addField(`🧍 Total users`, guild.members.cache.filter(gm => !gm.user.bot).size, true)
            .addField(`🤖 Total bots`, guild.members.cache.filter(gm => gm.user.bot).size, true)
            .addField(`${savedEmotes.roleIcon} Roles`, guild.roles.cache.size, true)
            .addField(`${savedEmotes.wumpus} Emotes`, guild.emojis.cache.size, true)
            .addField(`🚷 Maximum Members`, guild.maximumMembers, true)
            .addField(`${savedEmotes.boost} Boost level`, guild.premiumTier, true)
            .addField(`${savedEmotes.boost} Boosts`, guild.premiumSubscriptionCount, true)
    ];

    let featureLimit = 3;
    //if (guild.features.length > featureLimit) EmbedArray[0].addField("\u200B", "\u200B", true);
    EmbedArray[0].addField(`🏃‍ Presence Count`, guild.presences.cache.size, true)

    EmbedArray[0].addField(`${guild.features.length} Features`,
        guild.features.length > 0 ? guild.features
            .sort((a, b) => a > b ? 1 : -1)
            .map((feature, index) => `**${index + 1}**: ${humanize(feature)}`)
            .join('\n') : "Server has no features.",
        guild.features.length < featureLimit
    );

    if (bigboiinfo) {
        EmbedArray[1] = new MessageEmbed()
            .setTitle(`Special Information`)
            .setThumbnail(DefaultThumbnail)
            .setColor(color)
            .addField(`${savedEmotes.notification} Default Notifications`, humanize(guild.defaultMessageNotifications), true)
            .addField(`${savedEmotes.banner} Banner`, guild.bannerURL() ? guild.bannerURL() : "None", true)

        if (HasPermission(DiscordPermissions.CREATE_INSTANT_INVITE)) EmbedArray[1].addField("\u200B", "\u200B", true);

        EmbedArray[1] = await addField(DiscordPermissions.MANAGE_GUILD, EmbedArray[1], `${savedEmotes.invite} Invites`, async () => (await guild.fetchInvites()).size, HasPermission(DiscordPermissions.MANAGE_GUILD));
        EmbedArray[1] = await addField(DiscordPermissions.BAN_MEMBERS, EmbedArray[1], `${savedEmotes.banHammer} Banned Members`, async () => (await guild.fetchBans()).size, HasPermission(DiscordPermissions.BAN_MEMBERS));

        if (HasPermission(DiscordPermissions.BAN_MEMBERS)) EmbedArray[1].addField("\u200B", "\u200B", true);

        EmbedArray[1] = await addField(DiscordPermissions.MANAGE_WEBHOOKS, EmbedArray[1], `${savedEmotes.webhook} Webhooks`, async () => (await guild.fetchWebhooks()).size, HasPermission(DiscordPermissions.MANAGE_WEBHOOKS));
        EmbedArray[1].addField(`${savedEmotes.widget} Widgets enabled`, guild.widgetEnabled ? true : false, true);
        if (guild.widgetEnabled) EmbedArray[1].addField(`${savedEmotes.channelText} Widget channel`, guild.widgetChannel, true);
        else EmbedArray[1].addField("\u200B", "\u200B", true);

        if (!HasPermission(DiscordPermissions.MANAGE_WEBHOOKS) && (!guild.widgetEnabled || guild.widgetEnabled && guild.widgetChannel)) EmbedArray[1].addField("\u200B", "\u200B", true);

        EmbedArray[1]
            .addField(`${savedEmotes.partner} Partnered Discord`, guild.partnered, true)
            .addField(`${savedEmotes.verified} Verified Discord`, guild.verified, true);

        if (!guild.widgetEnabled) EmbedArray[1].addField("\u200B", "\u200B", true);

        //#endregion

        //#region Channel Information
        function GetChannelCount(type) {
            return guild.channels.cache.filter(c => c.type == type).size;
        }

        EmbedArray[2] = new MessageEmbed()
            .setTitle(`Channel Information`)
            .setThumbnail(DefaultThumbnail)
            .setColor(color)
            .addField(`${savedEmotes.channelIcon} Channel count`, guild.channels.cache.size, true)
            .addField(`${savedEmotes.channelCategory} Categories`, GetChannelCount('category'), true)
            .addField(`${savedEmotes.channelRules} Rules channel`, (guild.rulesChannel ? guild.rulesChannel : 'None'), true)
            .addField(`${savedEmotes.channelText} Text channels`, GetChannelCount('text'), true)
            .addField(`${savedEmotes.channelVoice} Voice channels`, GetChannelCount('voice'), true)
            .addField(`${savedEmotes.channelAnnounce} Announcement channels`, GetChannelCount('news'), true)
            .addField(`${savedEmotes.channelStore} Store channels`, GetChannelCount('store'), true)
            .addField(`${savedEmotes.channelAFK} AFK Channel`, (guild.afkChannel ? guild.afkChannel : 'None'), true)
            .addField(`${savedEmotes.channelAFK} AFK Timeout`, (guild.afkTimeout / 60).toString() + " minutes", true)
        //#endregion

        //#endregion
    }
    else EmbedArray[0].addField("\u200B", "\u200B", true);
    return EmbedArray;
}

//#region Send user its stuff
/**@param {Message} message 
 * @param {Guild} serverGuild 
 * @param {boolean} bigboiinfo*/
async function SendEmbeds(message, serverGuild, bigboiinfo) {
    const EmbedArray = await SendCallerInfo(message, bigboiinfo)

    if (!PinguLibrary.PermissionCheck(message, [DiscordPermissions.SEND_MESSAGES])) {
        await message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut here's your information:`)
        EmbedArray.forEach(Embed => message.author.send(Embed));
    }
    else EmbedArray.forEach(Embed => message.channel.send(Embed));
}
/**@param {Message} message 
 * @param {Guild} serverGuild*/
function SendEmotes(message, serverGuild) {
    let EmoteList = serverGuild.emojis.cache.map(emote => emote.name);
    if (!EmoteList) return message.channel.send(`There are no emotes in ${serverGuild.name}!`);

    var emoteListString = EmoteList.join(', ');

    message.channel.send(
        `**${serverGuild.name}'s Emotes (${EmoteList.length})**` +
        '```' + emoteListString.substring(0, emoteListString.length - 1) + '```');
}
/**@param {Message} message 
 * @param {Guild} serverGuild*/
function SendFeatures(message, serverGuild) {
    let FeatureList = serverGuild.features.map(feature => `${feature}\n`);

    return FeatureList ?
        message.channel.send(`There are no features in ${serverGuild.name}!`) :
        message.channel.send(`**${serverGuild.name}'s Features**` + '```' + FeatureList + '```')
}
//#endregion

/**@param {Guild} guild*/
async function GetPGuildColor(guild) {
    return PinguGuild.GetPClient(guild.client, await PinguGuild.GetPGuild(guild)).embedColor;
}