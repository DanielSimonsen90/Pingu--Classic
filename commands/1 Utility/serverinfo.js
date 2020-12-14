const { MessageEmbed, Message, Guild } = require('discord.js');
const { PinguGuild, PinguLibrary, DiscordPermissions } = require('../../PinguPackage');
module.exports = {
    name: 'serverinfo',
    description: 'Sends server information.',
    usage: '[BigBoiInfo: all] [emotes [emote name] | features]',
    guildOnly: true,
    id: 1,
    example: ["", "all", "emotes", "emotes FeelsBadMan", "features"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const bigboiinfo = args[0] && args[0] == 'all',
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
                    .setColor(GetPGuildColor())
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

/**@param {Guild} guild @param {boolean} bigboiinfo*/
async function SendCallerInfo(guild, bigboiinfo) {
    const DefaultThumbnail = guild.iconURL(),
        Description = guild.description ? guild.description : 'None',
        color = GetPGuildColor(guild);

    let EmbedArray = [
        new MessageEmbed()
            .setTitle(`Server Information: ${guild.name}`)
            .setThumbnail(DefaultThumbnail)
            .setColor(color)
            .addField(`Owner`, guild.owner, true)
            .addField(`Region`, guild.region.charAt(0).toUpperCase() + guild.region.substring(1, guild.region.length), true)
            .addField(`Creation Date`, guild.createdAt, true)
            .addField(`Description`, Description, true)
            .addField(`Boost level`, guild.premiumTier, true)
            .addField(`Boosts`, guild.premiumSubscriptionCount, true)
            .addField(`Total members`, guild.memberCount, true)
            .addField(`Roles`, guild.roles.cache.size, true)
            .addField(`Emotes`, guild.emojis.cache.size, true)
            .addField(`Features`, guild.features.length, true)
            .addField(`Server ID`, guild.id, true)
            .addField("\u200B", "\u200B", true)
    ];
    if (bigboiinfo) {
        EmbedArray[0].addField(`Presence Count`, guild.presences.cache.size, true)
            .addField(`Maximum Members`, guild.maximumMembers, true);

        EmbedArray[1] = new MessageEmbed()
            .setTitle(`Special Information`)
            .setThumbnail(DefaultThumbnail)
            .setColor(color)
            .addField(`Default Notifications`, guild.defaultMessageNotifications, true)
            .addField(`Banner Hash`, guild.banner, true)
            .addField(`Banned Members`, (await guild.fetchBans()).size, true)
            .addField(`Invites`, (await guild.fetchInvites()).size, true)
            .addField(`Webhooks`, (await guild.fetchWebhooks()).size, true)
            .addField(`Partnered Discord`, guild.partnered, true)
            .addField(`Verified Discord`, guild.verified, true);
        //#endregion

        //#region Channel Information
        function GetChannelCount(type) {
            return guild.channels.cache.filter(c => c.type == type).size;
        }

        EmbedArray[2] = new MessageEmbed()
            .setTitle(`Channel Information`)
            .setThumbnail(DefaultThumbnail)
            .setColor(color)
            .addField('Categories', GetChannelCount('category'), true)
            .addField(`Channel count`, guild.channels.cache.size, true)
            .addField(`AFK Channel`, (guild.afkChannel ? guild.afkChannel : 'None'), true)
            .addField(`AFK Timeout`, guild.afkTimeout, true)
            .addField(`Rules channel`, (guild.rulesChannel ? guild.rulesChannel : 'None'), true)
            .addField(`Text channels`, GetChannelCount('text'), true)
            .addField(`Voice channels`, GetChannelCount('voice'), true)
            .addField('Announcement channels', GetChannelCount('news'), true)
            .addField(`Store channels`, GetChannelCount('store'), true)
        //#endregion

        EmbedArray[3] = new MessageEmbed()
            .setTitle(`Widget Information`)
            .setThumbnail(DefaultThumbnail)
            .setColor(color)
            .addField(`Widgets enabled`, guild.widgetEnabled, true);
        if (guild.widgetEnabled)
            Embed[3].addField(`Widget channel`, guild.widgetChannel, true);
        //#endregion
    }
    return EmbedArray;
}

//#region Send user its stuff
/**@param {Message} message @param {Guild} serverGuild @param {boolean} bigboiinfo*/
async function SendEmbeds(message, serverGuild, bigboiinfo) {
    const EmbedArray = await SendCallerInfo(serverGuild, bigboiinfo)

    if (!message.channel.permissionsFor(message.guild.client.user).has('SEND_MESSAGES')) {
        await message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!\nBut here's your information:`)
        EmbedArray.forEach(Embed => message.author.send(Embed));
    }
    else EmbedArray.forEach(Embed => message.channel.send(Embed));
}
/**@param {Message} message @param {Guild} serverGuild*/
function SendEmotes(message, serverGuild) {
    let EmoteList = serverGuild.emojis.cache.map(emote => emote.name);
    if (!EmoteList) return message.channel.send(`There are no emotes in ${serverGuild.name}!`);

    var emoteListString = EmoteList.join(', ');

    message.channel.send(
        `**${serverGuild.name}'s Emotes (${EmoteList.length})**` +
        '```' + emoteListString.substring(0, emoteListString.length - 1) + '```');
}
/**@param {Message} message @param {Guild} serverGuild*/
function SendFeatures(message, serverGuild) {
    let FeatureList = serverGuild.features.map(feature => `${feature}\n`);

    return FeatureList ?
        message.channel.send(`There are no features in ${serverGuild.name}!`) :
        message.channel.send(`**${serverGuild.name}'s Features**` + '```' + FeatureList + '```')
}
//#endregion

/**@param {Guild} guild*/
function GetPGuildColor(guild) {
    return PinguGuild.GetPGuild(guild).embedColor;
}