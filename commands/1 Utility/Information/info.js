const { Message, MessageEmbed, Collection } = require('discord.js');
const { PinguLibrary, PinguGuild, PinguUser, DiscordPermissions, PClient, EmbedField, Queue, TimeLeftObject, Marry } = require('PinguPackage');

const availableTypes = ['server', 'guild', 'user', 'bot', 'client'];

module.exports = {
    name: 'info',
    description: 'All da information you need',
    usage: '<type: server | user> <property: all | <property>>',
    guildOnly: false,
    id: 1,
    examples: [""],
    permissions: [DiscordPermissions.SEND_MESSAGES],
    /**@param {{message: Message, args: string[], pAuthor: PinguUser, pGuild: PinguGuild, pGuildClient: PClient}}*/
    async execute({ message, args, pAuthor, pGuild, pGuildClient }) {
        if (!args || !args[0]) args[0] = message.guild ? 'guild' : 'user';
        if (!availableTypes.includes(args[0])) return message.channel.send(`**${type}** is an invalid type!`);

        let userType = args.shift();
        let type = ['server', 'guild'].includes(userType) ? 'guild' :
            ['client', 'bot'].includes(userType) ? 'client' : 'user';

        let obj = type == 'guild' ? pGuild : type == 'user' ? pAuthor : pGuildClient;

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

        return await GetInfo(message, userType, type, obj, prop, pGuildClient);
    }
}

//IMPORTANT INFORMATION
//9 + 10 = 25
//(credit to Spag for figuring that out)

/**@param {Message} message
 * @param {'server' | 'guild' | 'user' | 'bot' | 'client'} userType
 * @param {'guild' | 'user' | 'client'} type
 * @param {PinguGuild | PinguUser | PClient} obj
 * @param {string} prop
 * @param {PClient} pGuildClient*/
async function GetInfo(message, userType, type, obj, prop, pGuildClient) {
    let arr = [];
    let result = await (type == 'guild' ? SendPGuild(obj) :
        type == 'user' ? SendPUser(obj) : SendPClient(obj));

    result.forEach(i => i && message.channel.send(i));

    /**@param {PinguGuild} pg*/
    async function SendPGuild(pg) {
        let pgProps = Object.keys(pg)
            .sort((a, b) => ['welcomeChannel', 'guildOwner', 'name'].includes(a) ? -2 : a > b ? 1 : -1)
            .filter(v => !['_id', '__v'].includes(v));
        pgProps.push('musicQueue');

        for (var item of pgProps) {
            if (prop != item && (prop != 'all' || ['welcomeChannel', 'guildOwner'].includes(item))) continue;

            let embed = await GetEmbed();
            if (embed) arr.push(MergeEmbeds(item, embed));

            async function GetEmbed() {
                let queue = Queue.get(message.guild.id);

                switch (item) {
                    case 'musciQueue': return queue ? new MessageEmbed().addFields([
                        new EmbedField('Log Channel', `<#${queue.logChannel._id}>`, true),
                        new EmbedField('Voice Channel', `<#${queue.voiceChannel._id}>`, true),
                        new EmbedField('Playing?', queue.playing ? 'Yes' : 'No', false),
                        new EmbedField('Looping?', queue.loop ? 'Yes' : 'No', true),
                        new EmbedField('Songs in Queue', queue.songs.filter((_, i) => i < 11).map(s => `**${s.title}** | ${s.requestedBy}`).join('\n'), false)
                    ]) : null;
                    case 'pollConfig': return !pg.pollConfig.firstTimeExecuted ?
                        new MessageEmbed().addFields([
                            new EmbedField('Poll Host Role', pg.pollConfig.pollRole ? `<@&${pg.pollConfig.pollRole._id}>` : 'None', true),
                            pg.pollConfig.pollRole ? new EmbedField('Poll Hosters', message.guild.members.cache.filter(gm => gm.roles.cache.has(pg.pollConfig.pollRole._id)).size, true) : null,
                            pg.pollConfig.pollRole ? PinguLibrary.BlankEmbedField(true) : null,
                            new EmbedField('Polls Hosted', pg.pollConfig.polls.length, true),
                            new EmbedField('Typical Poll Response', pg.pollConfig.polls
                                .filter(p => p) //Get new array, so .polls won't get modified
                                .sort((a, b) => a.approved[0] > b.approved[0]) //Sort polls in alphabetical order, from .approved => [...No, ...Undecided, ...Yes]
                                .find((_, __, arr) => {
                                    let verdicts = new Collection(); //Save Yes/No/Undecided in Discord.Collection<string, number> => verdicts<approvedKey: "y" | "n" | "u", amountOfApproved>
                                    verdicts.set('y', 0).set('n', 0).set('u', 0); //Set all verdicts to 0 as reset

                                    arr.forEach(v => verdicts.set(v.approved[0], verdicts.get(v.approved[0]) + 1)); //For each value/poll in array, replace the first letter of approved ("y", "n", "u") to previous value + 1

                                    let verdictKey = verdicts.findKey(v => v == Math.max(verdicts.array())) //Find the highest value in verdicts, and save the key in verdictKey
                                    return verdictKey == 'y' ? 'Yes' : verdictKey == 'n' ? 'No' : 'Undecided'; //Return result string from key
                                }) || 'No polls hosted.', true
                            ),
                            new EmbedField('Polls Channel', pg.pollConfig.channel ? `<#${pg.pollConfig.channel._id}>` : 'None', true)
                        ].map(v => v)) :
                        new MessageEmbed().setDescription(`Poll Config is not yet configured.`);
                    case 'giveawayConfig': return !pg.giveawayConfig.firstTimeExecuted ?
                        new MessageEmbed().addFields([
                            new EmbedField('Giveaway Host Role', pg.giveawayConfig.hostRole ? `<@&${pg.giveawayConfig.hostRole._id}>` : `None`, true),
                            pg.giveawayConfig.hostRole ? new EmbedField(`Giveaway Hosters`, message.guild.members.cache.filter(gm => gm.roles.cache.has(pg.giveawayConfig.hostRole._id)).size, true) : null,
                            pg.giveawayConfig.hostRole ? PinguLibrary.BlankEmbedField(true) : null,
                            new EmbedField('Giveaway Winner Role', pg.giveawayConfig.winnerRole ? `<@&${pg.giveawayConfig.winnerRole._id}>` : `None`, true),
                            pg.giveawayConfig.winnerRole ? new EmbedField(`Giveaway Winner${(message.guild.members.cache.filter(gm => gm.roles.cache.has(pg.giveawayConfig.winnerRole._id)).size > 1 ? 's' : '')}`, message.guild.members.cache.filter(gm => gm.roles.cache.has(pg.giveawayConfig.winnerRole._id)).size, true) : null,
                            pg.giveawayConfig.winnerRole ? PinguLibrary.BlankEmbedField(true) : null,
                            new EmbedField(`Giveaways Hosted`, pg.giveawayConfig.giveaways.length, true),
                            new EmbedField(`The Lucky One (Most frequent winner)`, pg.giveawayConfig.giveaways
                                .filter(g => g) //Get new array so original .giveaways don't get modified
                                .find((_, __, arr) => {
                                    let winners = new Collection(); //Collection<string, number> => Collection<userID, amountOfWins>

                                    //Go through all giveaways, and all giveaways' winners, set winners collection to previous value++
                                    arr.forEach(g => g.winners.forEach(w => winners.set(w._id, winners.get(w._id) ? winners.get(w._id) + 1 : 1)));

                                    //Find winner id, whose value is the max value
                                    let winnerID = winners.findKey(v => v == Math.max(winners.array()));

                                    //Return user
                                    return `<@${winnerID}>`;
                                }) || 'No giveaways hosted', true
                            ),
                            PinguLibrary.BlankEmbedField(true),
                            new EmbedField('Giveaway Channel', pg.giveawayConfig.channel ? `<#${pg.giveawayConfig.channel._id}>` : 'None', true),
                            new EmbedField('Allow Same Winner?', pg.giveawayConfig.allowSameWinner ? 'Yes' : 'No', true),
                            PinguLibrary.BlankEmbedField(true)
                        ].map(v => v)) :
                        new MessageEmbed().setDescription('Giveaway Config is not yet configured');
                    case 'welcomeChannel': case 'guildOwner': case 'name': return new MessageEmbed()
                        .setTitle('General Information')
                        .addFields([
                            new EmbedField('Name', pg.name, true),
                            new EmbedField('Owner', `<@${pg.guildOwner._id}>`, true),
                            new EmbedField(`Welcome Channel`, pg.welcomeChannel ? `<#${pg.welcomeChannel._id}>` : 'None', true)
                        ])
                    case 'clients': return new MessageEmbed().setDescription(pg.clients.map(pc => pc ? getClientInfo(pc) : null).join('\n'));
                    case 'reactionRoles': return pg.reactionRoles[0] ? new MessageEmbed().setDescription(
                        pg.reactionRoles
                            .map(rr => rr.pRole ? (() => {
                                let titles = ['Reaction Name', 'Role', 'Message ID', 'Channel'].map(v => `**${v}**`);
                                let values = [rr.emoteName, `<@&${rr.pRole._id}>`, "`" + rr.messageID + "`", `<#${rr.channel._id}>`];
                                return titles.map((v, i) => `${v}: ${values[i]}`).join('\n') + '\n';
                            })() : null)
                            .filter(v => v)
                    ) : new MessageEmbed().setDescription(`No Reaction Roles saved.`);
                    case 'suggestions': return null; //Not implemented
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
                let sharedServerInfo = await (async () => {
                    let serverInfo = [];

                    for (var pg of pu.sharedServers) {
                        let guildInfo = [`**${pg.name}**`];
                        if (!message.client.guilds.cache.has(pg._id)) continue;
                        let guild = await message.client.guilds.fetch(pg._id);
                        if (!guild) continue;

                        let authorJoined = (await guild.members.fetch(message.author)).joinedTimestamp;
                        let clientJoined = guild.me.joinedTimestamp;

                        var knownSince = new TimeLeftObject(new Date(authorJoined < clientJoined ? clientJoined : authorJoined), new Date(Date.now()));
                        guildInfo.push(`Both been members for ${knownSince.toString()}.`);

                        serverInfo.push(guildInfo.join('\n') + '\n');
                    }

                    return serverInfo.join('\n');
                })();

                switch (item) {
                    case 'marry': return new MessageEmbed()
                        .setDescription(partner ? new Marry(await PinguUser.GetPUser(partner), pu.marry.internalDate).marriedMessage : `You've never been married rip`)
                        .setThumbnail(partner ? partner.avatarURL() : pu.avatar)
                    case 'daily': return new MessageEmbed()
                        .setDescription(`Your current daily streak is at **${(!dailyStreakValid ? 0 : pu.daily.streak)}**`)
                        .setTimestamp(dailyStreakValid ? pu.daily.nextClaim.endsAt : Date.now())
                        .setFooter(`Viewing information for: ${userType} | Daily claimable at`);
                    case 'sharedServers': return new MessageEmbed().setDescription(sharedServerInfo)
                    case 'playlists': return null //Not implemented
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
            item.substring(1, item.length);


        let defaultEmbed = new MessageEmbed()
            .setTitle(title)
            .setColor(pGuildClient.embedColor)
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
}

