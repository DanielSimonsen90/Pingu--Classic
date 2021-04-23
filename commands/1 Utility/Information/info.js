const { Message, MessageEmbed, Collection } = require('discord.js');
const {
    PinguCommand, PinguLibrary, PinguClient,
    PinguGuild, PinguGuildMember, PinguUser, PClient, PGuild,
    EmbedField, Queue, TimeLeftObject, Marry,
    UserAchievement, GuildMemberAchievement, GuildAchievement, PAchievement
} = require('PinguPackage');

module.exports = new PinguCommand('info', 'Utility', 'All da information you need', {
    usage: '<server | member | user> <property: all | <property>>'
}, async ({ message, args, pAuthor, pGuild, pGuildMember, pGuildClient }) => {
    let userType = args.shift().toLowerCase();
    let type =
        ['server', 'guild'].includes(userType) ? 'guild' :
            ['client', 'bot'].includes(userType) ? 'client' :
                ['guildmember', 'member'].includes(userType) ? 'member' : 'user';

    let obj = type == 'guild' ? pGuild :
        type == 'user' ? pAuthor :
            type == 'member' ? pGuildMember : pGuildClient;

    if (!args[0]) args[0] = 'all';
    if (!obj[args[0]] && args[0] != 'all')
        return message.channel.send(`Property for ${userType} is invalid! Please use any of the following:\n` + (() => {
            let send = Object.keys({ ...obj, ...{ all: "All properties to be listed" } })
                .filter(v => !['_id', '__v'].includes(v))
                .sort()
                .map(v => `- ${v.toLowerCase()}`)
                .join('\n')
            return "```\n" + send + "```";
        })());
    let prop = args.shift();

    return GetInfo(message, userType, type, obj, prop, pGuildClient);
});


//IMPORTANT INFORMATION
//9 + 10 = 25
//(credit to Spag for figuring that out)

/**@param {Message} message
 * @param {'server' | 'guild' | 'user' | 'bot' | 'client' | 'guildmember' | 'member'} userType
 * @param {'guild' | 'user' | 'client'} type
 * @param {PinguGuild | PinguUser | PClient} obj
 * @param {string} prop
 * @param {PClient} pGuildClient
 * @returns {MessageEmbed}*/
async function GetInfo(message, userType, type, obj, prop, pGuildClient) {
    let arr = [];
    let result = await (type == 'guild' ? SendPGuild(obj) :
        type == 'user' ? SendPUser(obj) :
            type == 'member' ? SendPGuildMember(obj) : SendPClient(obj));

    result.forEach(i => i && message.channel.send(i));
    return result[0];

    /**@param {PinguGuild} pg*/
    async function SendPGuild(pg) {
        // [ name, guildOwner, clients ]
        let pgProps = Object.keys(pg)
            .sort((a, b) => ['guildOwner', 'name'].includes(a) ? -2 : a - b)
            .filter(v => !['_id', '__v', 'settings', 'members'].includes(v));

        // [ musicQueue, reactionRoles, achievements, giveawayConfig, pollConfig, suggestionConfig, themeConfig ]
        let pgSettings = [
            'musicQueue',
            // [ reactionRoles ]
            ...Object.keys(pg.settings).filter(v => !['config', 'welcomeChannel'].includes(v)),
            // [ achivements ]
            ...Object.keys(pg.settings.config).filter(v => v != 'decidables'),
            // [ giveawayConfig, pollConfig, suggestionConfig, themeConfig ]
            ...Object.keys(pg.settings.config.decidables)
        ]

        // [ achievements, giveawayConfig, musicQueue, pollConfig, reactionRoles, suggestionConfig, themeConfig ]
        pgSettings.sort();

        // [ achievements, musicQueue, giveawayConfig, pollConfig, suggestionConfig, themeConfig, reactionRoles ]
        pgSettings.sort((a, b) =>
            a.endsWith('Roles') ? 3 : b.endsWith('Roles') ? -3 :
                a.endsWith('Config') ? 2 : b.endsWith('Config') ? -2 : 0
        )
        //  [ name, guildOwner, clients, achievements, musicQueue, giveawayConfig, pollConfig, suggestionConfig, themeConfig, reactionRoles ]
        pgProps.push(...pgSettings);

        for (var item of pgProps) {
            if (prop != item && (prop != 'all' || ['welcomeChannel', 'guildOwner'].includes(item))) continue;

            let embed = await GetEmbed();
            if (embed) arr.push(MergeEmbeds(item, embed));

            async function GetEmbed() {
                let queue = Queue.get(message.guild.id);
                const { config } = pg.settings;
                const configDecidables = config.decidables;
                const configAchievements = config.achievements;

                switch (item) {
                    case 'musciQueue': return queue ? new MessageEmbed().addFields([
                        new EmbedField('Log Channel', `<#${queue.logChannel._id}>`, true),
                        new EmbedField('Voice Channel', `<#${queue.voiceChannel._id}>`, true),
                        new EmbedField('Playing?', queue.playing ? 'Yes' : 'No', false),
                        new EmbedField('Looping?', queue.loop ? 'Yes' : 'No', true),
                        new EmbedField('Songs in Queue', queue.songs.filter((_, i) => i < 11).map(s => `**${s.title}** | ${s.requestedBy}`).join('\n'), false)
                    ]) : null;
                    case 'giveawayConfig': return !configDecidables.giveawayConfig.firstTimeExecuted ?
                        new MessageEmbed().addFields([
                            new EmbedField('Giveaway Host Role',
                                configDecidables.giveawayConfig.hostRole ?
                                    `<@&${configDecidables.giveawayConfig.hostRole._id}>` :
                                    `None`,
                                true),
                            configDecidables.giveawayConfig.hostRole ?
                                new EmbedField(`Giveaway Hosters`, message.guild.members.cache
                                    .filter(gm => gm.roles.cache.has(configDecidables.giveawayConfig.hostRole._id)).size,
                                    true)
                                : null,
                            configDecidables.giveawayConfig.hostRole ? PinguLibrary.BlankEmbedField(true) : null,
                            new EmbedField('Giveaway Winner Role',
                                configDecidables.giveawayConfig.winnerRole ?
                                    `<@&${configDecidables.giveawayConfig.winnerRole._id}>` :
                                    `None`,
                                true),
                            configDecidables.giveawayConfig.winnerRole ?
                                new EmbedField(`Giveaway Winner${(message.guild.members.cache.filter(gm =>
                                    gm.roles.cache.has(configDecidables.giveawayConfig.winnerRole._id)).size > 1 ? 's' : '')}`,
                                    message.guild.members.cache.filter(gm =>
                                        gm.roles.cache.has(configDecidables.giveawayConfig.winnerRole._id)
                                    ).size, true)
                                : null,
                            configDecidables.giveawayConfig.winnerRole ? PinguLibrary.BlankEmbedField(true) : null,
                            new EmbedField(`Giveaways Hosted`, configDecidables.giveawayConfig.giveaways.length, true),
                            new EmbedField(`The Lucky One (Most frequent winner)`, configDecidables.giveawayConfig.giveaways
                                .filter(g => g) //Get new array so original .giveaways don't get modified
                                .reduce((acc, cur) => {
                                    cur.winners.forEach(pgm => acc.set(pgm._id, acc.get(pgm._id) ? acc.get(pgm._id) + 1 : 1));
                                    return acc;
                                }, new Collection()).first() || 'No giveaways hosted', true
                            ),
                            PinguLibrary.BlankEmbedField(true),
                            new EmbedField('Giveaway Channel', configDecidables.giveawayConfig.channel ? `<#${configDecidables.giveawayConfig.channel._id}>` : 'None', true),
                            new EmbedField('Allow Same Winner?', configDecidables.giveawayConfig.allowSameWinner ? 'Yes' : 'No', true),
                            PinguLibrary.BlankEmbedField(true)
                        ].filter(v => v)) :
                        new MessageEmbed().setDescription('Giveaway Config is not yet configured');
                    case 'pollConfig': return !configDecidables.pollConfig.firstTimeExecuted ?
                        new MessageEmbed().addFields([
                            new EmbedField('Poll Host Role', configDecidables.pollConfig.pollRole ? `<@&${configDecidables.pollConfig.pollRole._id}>` : 'None', true),
                            configDecidables.pollConfig.pollRole ? new EmbedField('Poll Hosters', message.guild.members.cache.filter(gm => gm.roles.cache.has(configDecidables.pollConfig.pollRole._id)).size, true) : null,
                            configDecidables.pollConfig.pollRole ? PinguLibrary.BlankEmbedField(true) : null,
                            new EmbedField('Polls Hosted', configDecidables.pollConfig.polls.length, true),
                            new EmbedField('Typical Poll Response', configDecidables.pollConfig.polls
                                .filter(p => p) //Get new array, so .polls won't get modified
                                .sort((a, b) => a.approved > b.approved ? -1 : 1) //Sort polls in alphabetical order, from .approved => [...No, ...Undecided, ...Yes]
                                .reduce((acc, cur) =>
                                    acc.set(cur.approved, acc.get(cur.approved) ? acc[cur.approved] + 1 : 1),
                                    new Collection()
                                ).first() || 'No polls hosted.', true
                            ),
                            new EmbedField('Polls Channel', configDecidables.pollConfig.channel ? `<#${configDecidables.pollConfig.channel._id}>` : 'None', true)
                        ].filter(v => v)) :
                        new MessageEmbed().setDescription(`Poll Config is not yet configured.`);
                    case 'suggestionConfig': return !configDecidables.suggestionConfig.firstTimeExecuted ?
                        new MessageEmbed().addFields([
                            new EmbedField('Suggestion Manager Role', configDecidables.suggestionConfig.managerRole ? `<@&${configDecidables.suggestionConfig.managerRole._id}>` : `None`, true),
                            configDecidables.suggestionConfig.managerRole ? new EmbedField(`Suggestion Managers`, message.guild.members.cache.filter(gm => gm.roles.cache.has(configDecidables.suggestionConfig.managerRole._id)).size, true) : null,
                            configDecidables.suggestionConfig.managerRole ? PinguLibrary.BlankEmbedField(true) : null,
                            new EmbedField(`Suggestions suggested(?)`, configDecidables.suggestionConfig.suggestions.length, true),
                            new EmbedField(`Typical Suggestion Response`, configDecidables.suggestionConfig.suggestions
                                .filter(s => s)
                                .sort((a, b) => a.approved[0] > b.approved[0])
                                .reduce((acc, cur) =>
                                    acc.set(cur.approved, acc.get(cur.approved) ? acc[cur.approved] + 1 : 1),
                                    new Collection()
                                ).first() || 'No suggestions suggested.', true
                            ),
                            new EmbedField(`Suggestion Channel`, configDecidables.suggestionConfig.channel ? `<#${configDecidables.suggestionConfig.channel._id}>` : `None`, true)
                        ].filter(v => v)) :
                        new MessageEmbed().setDescription('Suggestion Config is not yet configured!')
                    case 'themeConfig': return null //temp
                    case 'welcomeChannel': case 'guildOwner': case 'name': return new MessageEmbed()
                        .setTitle('General Information')
                        .addFields([
                            new EmbedField('Name', pg.name, true),
                            new EmbedField('Owner', `<@${pg.guildOwner._id}>`, true),
                            new EmbedField(`Welcome Channel`, pg.settings.welcomeChannel ? `<#${pg.settings.welcomeChannel._id}>` : 'None', true)
                        ])
                    case 'clients': return new MessageEmbed().setDescription(pg.clients.map(pc => pc ? getClientInfo(pc) : null).join('\n'));
                    case 'reactionRoles': return new MessageEmbed().setDescription(
                        pg.settings.reactionRoles[0] ?
                            pg.settings.reactionRoles
                                .map(rr => rr.pRole ? (() => {
                                    let titles = ['Reaction Name', 'Role', 'Message ID', 'Channel'].map(v => `**${v}**`);
                                    let values = [rr.emoteName, `<@&${rr.pRole._id}>`, "`" + rr.messageID + "`", `<#${rr.channel._id}>`];
                                    return titles.map((v, i) => `${v}: ${values[i]}`).join('\n') + '\n';
                                })() : null)
                                .filter(v => v)
                            : "No Reaction Roles saved."
                    );
                    case 'achievements': return new MessageEmbed().setDescription(
                        configAchievements.enabled ?
                            getAchievements(configAchievements.achievements, 'GUILD') :
                            `Pingu Achievements are not enabled in this server.`
                    );
                    default: return null;
                }
            }

        }
        return arr;
    }
    /**@param {PinguGuildMember} pgm*/
    async function SendPGuildMember(pgm) {
        //guild as PGuild, achievementConfig
        let pgmProps = Object.keys(pgm)
            .sort()
            .filter(v => !['_id', 'name'].includes(v))

        for (var item of pgmProps) {
            if (prop != item && prop != 'all') continue;

            let embed = await GetEmbed();
            if (embed) arr.push(MergeEmbeds(item, embed));

            async function GetEmbed() {
                switch (item) {
                    case 'guild': return new MessageEmbed().setDescription(await getMemberSince(pgm.guild) || 'Unavailable to calcualte');
                    case 'achievementsConfig': return new MessageEmbed().setDescription(
                        pgm.achievementConfig.enabled ?
                            getAchievements(pgm.achievementConfig.achievements, 'GUILDMEMBER') :
                            "Pingu Achievements are disabled."
                    );
                    default: return null;
                }
            }
        }
        return arr;
    }
    /**@param {PinguUser} pu*/
    async function SendPUser(pu) {
        let puProps = Object.keys(pu)
            .sort()
            .filter(v => !['_id', '__v', 'tag'].includes(v));

        for (var item of puProps) {
            if (prop != item && (prop != 'all')) continue;

            let embed = await GetEmbed();
            if (embed) arr.push(MergeEmbeds(item, embed));

            async function GetEmbed() {
                var partner = pu.marry.partner ? await message.client.users.fetch(pu.marry.partner._id) : null;
                var dailyStreakValid = !(pu.daily.lastClaim && pu.daily.lastClaim.setHours(pu.daily.lastClaim.getHours() + 32) < Date.now());
                let sharedServerInfo = (await Promise.all(pu.sharedServers.map(pg => getMemberSince(pg)))).filter(v => v).join('\n');

                switch (item) {
                    case 'marry': return new MessageEmbed()
                        .setDescription(partner ? new Marry(await PinguUser.Get(partner), pu.marry.internalDate).marriedMessage() : `You've never been married rip`)
                        .setThumbnail(partner ? partner.avatarURL() : pu.avatar)
                    case 'daily': return new MessageEmbed()
                        .setDescription(`Your current daily streak is at **${(!dailyStreakValid ? 0 : pu.daily.streak)}**`)
                        .setTimestamp(dailyStreakValid ? pu.daily.nextClaim && pu.daily.nextClaim.endsAt : Date.now())
                        .setFooter(`Viewing information for: ${userType} | Daily claimable at`);
                    case 'sharedServers': return new MessageEmbed().setDescription(sharedServerInfo)
                    case 'playlists': return null //Not implemented
                    case 'achievementConfig': return new MessageEmbed().setDescription(
                        pu.achievementConfig.enabled ?
                            getAchievements(pu.achievementConfig.achievements, 'USER') :
                            `Pingu Achievements are disabled.`
                    );
                }
            }
        }
        return arr;
    }
    /**@param {PClient} pc*/
    async function SendPClient(pc) {
        let pcProps = Object.keys(pc);
        let result = "";

        for (var item of pcProps) {
            if (prop != item && prop != 'all') continue;

            result = (result ? result + GetResult() : GetResult()) + '\n';
            function GetResult() {
                switch (item) {
                    case 'displayName': return `**Display Name**\n${pc.displayName}\n`;
                    case 'embedColor': return `**Embed Color**\n${pc.embedColor}\n`;
                    case 'prefix': return `**Prefix**\n${pc.prefix}\n`;
                    default: return "";
                }
            }
        }
        arr.push(MergeEmbeds(prop, new MessageEmbed().setDescription(result)));
        return arr;
    }

    /**@param {string} item
     * @param {MessageEmbed} embed*/
    function MergeEmbeds(item, embed) {
        let uppercase = item.indexOf(item.split('').find(c => c.toUpperCase() == c));
        let title = uppercase != -1 ?
            item.substring(0, 1).toUpperCase() +
            item.substring(1, uppercase).toLowerCase() + ' ' +
            item.substring(uppercase, item.length) :

            item.substring(0, 1).toUpperCase() +
            item.substring(1);


        let defaultEmbed = new MessageEmbed()
            .setTitle(title)
            .setColor(pGuildClient ? pGuildClient.embedColor : PinguClient.ToPinguClient(message.client).DefaultEmbedColor)
            .setFooter(`Viewing information for: ${userType}`);

        Object.keys(embed).forEach(k => embed[k] ? defaultEmbed[k] = embed[k] : defaultEmbed[k]);
        return defaultEmbed;
    }
    /**@param {PClient} client*/
    function getClientInfo(client) {
        let { _id, displayName, prefix, embedColor } = client;
        let titles = ['Bot', 'Display Name', 'Prefix', 'Embed Color (color of own role)'].map(v => `**${v}**`);
        let values = [`<@${_id}>`, displayName, prefix, embedColor].map((v, i) => i != 0 ? "`" + v + "`" : v);
        return titles.map((v, i) => `${v}: ${values[i]}`).join('\n') + "\n";
    }
    /**@param {PGuild} pGuild*/
    async function getMemberSince(pGuild) {
        if (!message.client.guilds.cache.has(pGuild._id)) return null;
        let guild = await message.client.guilds.fetch(pGuild._id);
        if (!guild) return null;

        let guildInfo = [`**${guild.name}**`];
        let authorJoined = (await guild.members.fetch(message.author)).joinedTimestamp;
        let clientJoined = guild.me.joinedTimestamp;

        var knownSince = new TimeLeftObject(new Date(authorJoined < clientJoined ? clientJoined : authorJoined), new Date(Date.now()));
        guildInfo.push(`Both been members for ${knownSince.toString()}.`);

        return guildInfo.join('\n') + '\n';
    }
    /**@param {PAchievement[]} pAchievements
     * @param {'USER' | 'GUILDMEMBER' | 'GUILD'} achievementType*/
    function getAchievements(pAchievements, achievementType) {
        const unlocked = HandleAchievements(true);
        const locked = HandleAchievements(false);
        return unlocked + locked;

        /**@param {boolean} unlocked*/
        function HandleAchievements(unlocked) {
            let result = `**${unlocked ? "Unlocked" : "Locked"} Achievements**\n`;

            const ids = pAchievements.map(a => a._id).sort((a, b) => a - b); //Unlocked achievements

            const achievements = getAllAchievements()
                .filter(a =>
                    ids.includes(a._id) && unlocked ||
                    !ids.includes(a._id) && !unlocked
                ).sort((a, b) => a._id - b._id);

            achievements.forEach(achievement => {
                const pAchievement = pAchievements.find(a => a._id);
                const format = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                };

                const achievedAtString = unlocked ? `| ${new Date(pAchievement.achievedAt).toLocaleDateString('da-DK', format)}` : "";

                result += `[${achievement._id}]: ${achievement.name} ${achievedAtString}\n`;
            });

            if (!achievements.length) result += `No ${unlocked ? "Unlocked" : "Locked"} achievements.\n`;

            return result + "\n";
        }
        function getAllAchievements() {
            switch (achievementType) {
                case 'USER': return UserAchievement.Achievements;
                case 'GUILDMEMBER': return GuildMemberAchievement.Achievements;
                case 'GUILD': return GuildAchievement.Achievements;
            }
        }
    }
}