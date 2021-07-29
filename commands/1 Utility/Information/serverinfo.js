const { MessageEmbed, Message, Guild } = require('discord.js');
const { PinguCommand, PinguGuild, PinguLibrary, EmbedField, PinguClient } = require('PinguPackage');

module.exports = new PinguCommand('serverinfo', 'Utility', 'Sends server information', {
    usage: '[BigBoiInfo: all] [emotes [emote name] | features]',
    guildOnly: true,
    permissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
}, async ({ message, args }) => {
    const bigboiinfo = args[0] && args[0].toLowerCase() == 'all',
        { guild } = message,
        emote = guild.emojis.cache.find(e => args.includes(e.name));

    if (!args.includes('emotes') && !args.includes('features'))
        return SendEmbeds(message, guild, bigboiinfo);

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
        else return SendEmotes(message, guild);

    else if (args.includes('features'))
        return SendFeatures(message, guild);

    message.channel.send(`Something happened.. I shouldn't've been here..`);
    return PinguLibrary.errorLog(message.client, `Ran line 34, which was not intended`, message.content, null, {
        params: { message, args },
        additional: { bigboiinfo, emote }
    });
})

/**@param {Message} message 
 * @param {boolean} bigboiinfo*/
async function SendCallerInfo(message, bigboiinfo) {
    let { guild } = message;
    const DefaultThumbnail = guild.iconURL(),
        Description = guild.description ? guild.description : '',
        color = await GetPGuildColor(guild);
    /**@param {string} name*/
    let getEmote = (name) => PinguLibrary.getEmote(message.client, name, PinguLibrary.SavedServers.get('Pingu Emotes'));
    let savedEmotes = {
        boost: getEmote('guildBoost'),
        partner: getEmote('partneredServer'),
        verified: getEmote('verifiedServer'),
        wumpus: getEmote('wumpusLove'),
        channelAnnounce: getEmote('channelAnnounce'),
        channelRules: getEmote('channelRules'),
        channelStore: getEmote('channelStore'),
        channelStage: getEmote('channelStage'),
        channelText: getEmote('channelText'),
        channelVoice: getEmote('channelVoice'),
        channelAFK: getEmote('channelAFK'),
        channelCategory: getEmote('channelCategory'),
        banner: getEmote('banner'),
        invite: getEmote('invite'),
        notification: getEmote('notification'),
        banHammer: getEmote('banHammer'),
        widget: getEmote('widget'),
        webhook: getEmote('webhook'),
        channelIcon: getEmote('channelIcon'),
        ownerCrown: getEmote('ownerCrown'),
        roleIcon: getEmote('roleIcon'),
    }

    /**@param {string} region*/
    function getRegionEmoji(region) {
        class Region {
            /**@param {'🌎' | '🌍' | '🌏'} emote
             * @param {...string} countries*/
            constructor(emote, ...countries) {
                this.value = emote;
                this.countries = countries;
            }
        }

        let america = new Region('🌎', 'us-east', 'brazil', 'us-central', 'us-south', 'us-west');
        let europe = new Region('🌍', 'europe', 'africa', 'india', 'southafrica');
        let asia = new Region('🌏', 'hongkong', 'japan', 'russia', 'singapore', 'sydney');

        if (america.countries.includes(region)) var returnValue = america.value;
        else if (europe.countries.includes(region)) returnValue = europe.value;
        else if (asia.countries.includes(region)) returnValue = asia.value;
        else {
            returnValue = europe.value;
            PinguLibrary.errorLog(message.client, `Unable to find region for ${region}`, message.content, null, {
                params: { message, bigboiinfo, region },
                additional: { america, europe, asia }
            });
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
    /**@param {import('discord.js').PermissionString} permission*/
    function HasPermission(permission) {
        return PinguLibrary.PermissionCheck(message, permission) == PinguLibrary.PermissionGranted;
    }

    let EmbedArray = [
        new MessageEmbed()
            .setTitle(`Server Information: ${guild.name}`)
            .setThumbnail(DefaultThumbnail)
            .setDescription(Description)
            .setFooter(`Server ID: ${guild.id}`)
            .setColor(color)
            .addFields([
                new EmbedField(`${savedEmotes.ownerCrown} Owner`, guild.owner, true),
                new EmbedField(getRegionEmoji(guild.region), guild.region.charAt(0).toUpperCase() + guild.region.substring(1, guild.region.length), true),
                new EmbedField(`⏰ Creation Date`, `<t:${Math.round(guild.createdTimestamp / 1000)}:R>`, false),
                new EmbedField(`👥 Total members`, guild.memberCount, true),
                new EmbedField(`🧍 Total users`, guild.members.cache.filter(gm => !gm.user.bot).size, true),
                new EmbedField(`🤖 Total bots`, guild.members.cache.filter(gm => gm.user.bot).size, true),
                new EmbedField(`${savedEmotes.roleIcon} Roles`, guild.roles.cache.size, true),
                new EmbedField(`${savedEmotes.wumpus} Emotes`, guild.emojis.cache.size, true),
                new EmbedField(`🚷 Maximum Members`, guild.maximumMembers, true),
                new EmbedField(`${savedEmotes.boost} Boost level`, guild.premiumTier, true),
                new EmbedField(`${savedEmotes.boost} Boosts`, guild.premiumSubscriptionCount, true)
            ])
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

        if (HasPermission('CREATE_INSTANT_INVITE')) EmbedArray[1].addField("\u200B", "\u200B", true);

        EmbedArray[1] = await addField('MANAGE_GUILD', EmbedArray[1], `${savedEmotes.invite} Invites`, async () => (await guild.fetchInvites()).size, HasPermission('MANAGE_GUILD'));
        EmbedArray[1] = await addField('BAN_MEMBERS', EmbedArray[1], `${savedEmotes.banHammer} Banned Members`, async () => (await guild.fetchBans()).size, HasPermission('BAN_MEMBERS'));

        if (HasPermission('BAN_MEMBERS')) EmbedArray[1].addField("\u200B", "\u200B", true);

        EmbedArray[1] = await addField('MANAGE_WEBHOOKS', EmbedArray[1], `${savedEmotes.webhook} Webhooks`, async () => (await guild.fetchWebhooks()).size, HasPermission('MANAGE_WEBHOOKS'));
        EmbedArray[1].addField(`${savedEmotes.widget} Widgets enabled`, guild.widgetEnabled ? true : false, true);
        if (guild.widgetEnabled) EmbedArray[1].addField(`${savedEmotes.channelText} Widget channel`, guild.widgetChannel, true);
        else EmbedArray[1].addField("\u200B", "\u200B", true);

        if (!HasPermission('MANAGE_WEBHOOKS') && (!guild.widgetEnabled || guild.widgetEnabled && guild.widgetChannel)) EmbedArray[1].addField("\u200B", "\u200B", true);

        EmbedArray[1].addFields([
            new EmbedField(`${savedEmotes.partner} Partnered Discord`, guild.partnered, true),
            new EmbedField(`${savedEmotes.verified} Verified Discord`, guild.verified, true),
            !guild.widgetEnabled ? EmbedField.Blank(true) : null
        ].filter(v => v))

        //#endregion

        //#region Channel Information
        function GetChannelCount(type) {
            return guild.channels.cache.filter(c => c.type == type).size;
        }

        EmbedArray[2] = new MessageEmbed()
            .setTitle(`Channel Information`)
            .setThumbnail(DefaultThumbnail)
            .setColor(color)
            .addFields([
                new EmbedField(`${savedEmotes.channelIcon} Channel count`, guild.channels.cache.size, true),
                new EmbedField(`${savedEmotes.channelCategory} Categories`, GetChannelCount('category'), true),
                new EmbedField(`${savedEmotes.channelRules} Rules channel`, (guild.rulesChannel ? guild.rulesChannel : 'None'), true),
                new EmbedField(`${savedEmotes.channelText} Text channels`, GetChannelCount('text'), true),
                new EmbedField(`${savedEmotes.channelVoice} Voice channels`, GetChannelCount('voice'), true),
                new EmbedField(`${savedEmotes.channelAnnounce} Announcement channels`, GetChannelCount('news'), true),
                new EmbedField(`${savedEmotes.channelStage} Stage channels`, GetChannelCount('stage'), true),
                new EmbedField(`${savedEmotes.channelStore} Store channels`, GetChannelCount('store'), true),
                new EmbedField(`${savedEmotes.channelAFK} AFK Channel`, (guild.afkChannel ? guild.afkChannel : 'None'), true),
                new EmbedField(`${savedEmotes.channelAFK} AFK Timeout`, (guild.afkTimeout / 60).toString() + " minutes", true)
            ])
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

    if (!PinguLibrary.PermissionCheck(message, 'SEND_MESSAGES')) {
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

    return message.channel.send(FeatureList ?
        `There are no features in ${serverGuild.name}!` :
        `**${serverGuild.name}'s Features**` + '```' + FeatureList + '```'
    );
}
//#endregion

/**@param {Guild} guild*/
async function GetPGuildColor(guild) {
    const client = PinguClient.ToPinguClient(guild.client);
    const pGuild = await PinguGuild.Get(guild);
    return client.toPClient(pGuild).embedColor || client.DefaultEmbedColor;
}
