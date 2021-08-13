const { MessageEmbed, Message, Guild } = require('discord.js');
const { PinguCommand, EmbedField } = require('PinguPackage');

module.exports = new PinguCommand('serverinfo', 'Utility', 'Sends server information', {
    usage: '[BigBoiInfo: all] [emotes [emote name] | features]',
    guildOnly: true,
    permissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
}, async ({ client, message, args }) => {
    const bigboiinfo = args[0]?.toLowerCase() == 'all', 
        { guild } = message,
        emote = guild.emojis.cache.find(e => args.includes(e.name));

    if (!args.includes('emotes') && !args.includes('features'))
        return SendEmbeds(message, bigboiinfo);

    else if (args.includes('emotes'))
        if (emote) {
            //const author = emote.author ? emote.author.username : 'null';
            return message.channel.sendEmbeds(new MessageEmbed({
                title: emote.name,
                thumbnail: { url: emote.url },
                color: GetPGuildColor(guild),
                fields: [
                    //new EmbedField('Created by', author, true),
                    new EmbedField('Created at', emote.createdAt, true)
                ]
            }));
        }
        else return SendEmotes(message, guild);

    else if (args.includes('features'))
        return SendFeatures(message, guild);

    message.channel.send(`Something happened.. I shouldn't've been here..`);
    return client.log('error', 'Ran line 34, which was not intended', message.content, null, {
        params: { message, args },
        additional: { bigboiinfo, emote }
    });
})

/**@param {Message} message 
 * @param {boolean} bigboiinfo*/
async function SendCallerInfo(message, bigboiinfo) {
    let { guild, client } = message;

    const thumbnailUrl = guild.iconURL(),
        description = guild.description ? guild.description : '',
        color = GetPGuildColor(guild);
    /**@param {string} name*/
    let getEmote = (name) => client.emotes.get(name, 1);
    let savedEmotes = {
        boost: getEmote('guildBoost'),
        partner: getEmote('partneredServer'),
        verified: getEmote('verifiedServer'),
        wumpus: getEmote('wumpusLove'),
        channelAnnounce: getEmote('channelAnnounce'),
        channelPublicThread: getEmote('channelPublicThread'),
        channelPublicThread: getEmote('channelPrivateThread'),
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
            /**@param {'🌎' | '🌍' | '🌏'} emote @param {...string} countries*/
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
            client.log('error', `Unable to find region for ${region}`, message.content, null, {
                params: { message, bigboiinfo, region },
                additional: { america, europe, asia }
            });
        }

        return returnValue + " Region";
    }
    /**@param {string} value*/
    function humanize(value) {
        let featureStrings = value.split(/_+/);
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
        return client.permissions.checkFor(message, permission) == client.permissions.PermissionGranted;
    }

    let embedArray = [
        new MessageEmbed({
            description, color,
            title: `Server Information: ${guild.name}`,
            thumbnail: { url: thumbnailUrl },
            footer: { text: `Server ID: ${guild.id}` },
            fields: [
                new EmbedField(`${savedEmotes.ownerCrown} Owner`, guild.owner(), true),
                new EmbedField(getRegionEmoji(guild.region), guild.region.charAt(0).toUpperCase() + guild.region.substring(1, guild.region.length), true),
                new EmbedField(`⏰ Creation Date`, client.timeFormat(guild.createdTimestamp, 'RELATIVE'), false),
                new EmbedField(`👥 Total members`, guild.memberCount, true),
                new EmbedField(`🧍 Total users`, guild.members.cache.filter(gm => !gm.user.bot).size, true),
                new EmbedField(`🤖 Total bots`, guild.members.cache.filter(gm => gm.user.bot).size, true),
                new EmbedField(`${savedEmotes.roleIcon} Roles`, guild.roles.cache.size, true),
                new EmbedField(`${savedEmotes.wumpus} Emotes`, guild.emojis.cache.size, true),
                new EmbedField(`🚷 Maximum Members`, guild.maximumMembers, true),
                new EmbedField(`${savedEmotes.boost} Boost level`, guild.premiumTier, true),
                new EmbedField(`${savedEmotes.boost} Boosts`, guild.premiumSubscriptionCount, true)
            ]
        })
    ];

    let featureLimit = 3;
    //if (guild.features.length > featureLimit) EmbedArray[0].addField("\u200B", "\u200B", true);
    embedArray[0].addField(`🏃‍ Presence Count`, guild.presences.cache.size, true)

    embedArray[0].addField(`${guild.features.length} Features`,
        guild.features.length > 0 ? guild.features
            .sort((a, b) => a > b ? 1 : -1)
            .map((feature, index) => `**${index + 1}**: ${humanize(feature)}`)
            .join('\n') : "Server has no features.",
        guild.features.length < featureLimit
    );

    if (bigboiinfo) {
        embedArray[1] = new MessageEmbed({
            title: 'Special Information',
            thumbnail: { url: thumbnailUrl },
            color,
            fields: [
                new EmbedField(`${savedEmotes.notification} Default Notifications`, humanize(guild.defaultMessageNotifications), true),
                new EmbedField(`${savedEmotes.banner} Banner`, guild.bannerURL() ? guild.bannerURL() : "None", true)
            ]
        })
        if (HasPermission('CREATE_INSTANT_INVITE')) embedArray[1].addField("\u200B", "\u200B", true);

        embedArray[1] = await addField('MANAGE_GUILD', embedArray[1], `${savedEmotes.invite} Invites`, async () => (await guild.invites.fetch()).size, HasPermission('MANAGE_GUILD'));
        embedArray[1] = await addField('BAN_MEMBERS', embedArray[1], `${savedEmotes.banHammer} Banned Members`, async () => (await guild.bans.fetch()).size, HasPermission('BAN_MEMBERS'));

        if (HasPermission('BAN_MEMBERS')) embedArray[1].addField("\u200B", "\u200B", true);

        embedArray[1] = await addField('MANAGE_WEBHOOKS', embedArray[1], `${savedEmotes.webhook} Webhooks`, async () => (await guild.fetchWebhooks()).size, HasPermission('MANAGE_WEBHOOKS'));
        embedArray[1].addField(`${savedEmotes.widget} Widgets enabled`, guild.widgetEnabled ? true : false, true);
        if (guild.widgetEnabled) embedArray[1].addField(`${savedEmotes.channelText} Widget channel`, guild.widgetChannel, true);
        else embedArray[1].addField("\u200B", "\u200B", true);

        if (!HasPermission('MANAGE_WEBHOOKS') && (!guild.widgetEnabled || guild.widgetEnabled && guild.widgetChannel)) embedArray[1].addField("\u200B", "\u200B", true);

        embedArray[1].addFields([
            new EmbedField(`${savedEmotes.partner} Partnered Discord`, guild.partnered, true),
            new EmbedField(`${savedEmotes.verified} Verified Discord`, guild.verified, true),
            !guild.widgetEnabled ? EmbedField.Blank(true) : null
        ].filter(v => v))

        //#endregion

        //#region Channel Information

        function GetChannelCount(type) {
            return guild.channels.cache.filter(c => c.type == type).size;
        }

        embedArray[2] = new MessageEmbed({
            title: 'Channel Information',
            thumbnail: { url: thumbnailUrl },
            color,
            fields: [
                new EmbedField(`${savedEmotes.channelIcon} Channel count`, guild.channels.cache.size, true),
                new EmbedField(`${savedEmotes.channelCategory} Categories`, GetChannelCount('GUILD_CATEGORY'), true),
                new EmbedField(`${savedEmotes.channelRules} Rules channel`, (guild.rulesChannel ? guild.rulesChannel : 'None'), true),
                new EmbedField(`${savedEmotes.channelText} Text channels`, GetChannelCount('GUILD_TEXT'), true),
                new EmbedField(`${savedEmotes.channelVoice} Voice channels`, GetChannelCount('GUILD_VOICE'), true),
                new EmbedField(`${savedEmotes.channelAnnounce} Announcement channels`, GetChannelCount('GUILD_NEWS'), true),
                new EmbedField(`${savedEmotes.channelStage} Stage channels`, GetChannelCount('GUILD_STAGE_VOICE'), true),
                new EmbedField(`${savedEmotes.channelStore} Store channels`, GetChannelCount('GUILD_STORE'), true),
                new EmbedField(`${savedEmotes.channelPublicThread} Public Thread channels`, ['GUILD_NEWS_THREAD', 'GUILD_PUBLIC_THREAD'].map(type => GetChannelCount(type)), true),
                new EmbedField(`${savedEmotes.channelPrivateThred} Private Thread channels`, GetChannelCount('GUILD_PRIVATE_THREAD'), true),
                new EmbedField(`${savedEmotes.channelAFK} AFK Channel`, (guild.afkChannel ? guild.afkChannel : 'None'), true),
                new EmbedField(`${savedEmotes.channelAFK} AFK Timeout`, (guild.afkTimeout / 60).toString() + " minutes", true)
            ]
        })
        //#endregion

        //#endregion
    }
    else embedArray[0].addField("\u200B", "\u200B", true);
    return embedArray;
}

//#region Send user its stuff
/**@param {Message} message 
 * @param {boolean} bigboiinfo*/
async function SendEmbeds(message, bigboiinfo) {
    const embedArray = await SendCallerInfo(message, bigboiinfo);
    const { client } = message;

    if (client.permissions.checkFor(message, 'SEND_MESSAGES') != client.permissions.PermissionGranted) {
        await message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut here's your information:`)
        embedArray.forEach(embed => message.author.sendEmbeds(embed));
    }
    else embedArray.forEach(embed => message.channel.sendEmbeds(embed));
}
/**@param {Message} message 
 * @param {Guild} guild*/
function SendEmotes(message, guild) {
    let emoteNames = guild.emojis.cache.map(emote => emote.name);
    if (!emoteNames) return message.channel.send(`There are no emotes in ${guild.name}!`);

    var emoteListString = emoteNames.join(', ');

    message.channel.send(
        `**${guild.name}'s Emotes (${emoteNames.length})**` +
        '```' + emoteListString.substring(0, emoteListString.length - 1) + '```');
}
/**@param {Message} message 
 * @param {Guild} guild*/
function SendFeatures(message, guild) {
    return message.channel.send(guild.features.length ?
        `There are no features in ${guild.name}!` :
        `**${guild.name}'s Features**` + '```' + guild.features.join('\n') + '```'
    );
}
//#endregion

/**@param {Guild} guild*/
function GetPGuildColor(guild) {
    const { client } = guild;
    const pGuild = client.pGuilds.get(guild);
    return client.toPClient(pGuild).embedColor || client.DefaultEmbedColor;
}
