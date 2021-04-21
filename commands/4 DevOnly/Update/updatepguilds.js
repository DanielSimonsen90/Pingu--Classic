const { MessageEmbed } = require("discord.js");
const { PinguCommand, PinguGuild, PinguLibrary, PinguGuildMember, GuildAchievementConfig } = require('PinguPackage');

module.exports = new PinguCommand('updatepguilds', 'DevOnly', `Creates new PinguGuilds to MongoDB, if they weren't added already`, {
    usage: '<guild name | guild id | show>',
    example: [`Pingu Support`, '460926327269359626', 'show']
}, async ({ client, message, args }) => {
    const BotGuilds = client.guilds.cache.array().sort((a, b) => a.name > b.name ? 1 : -1);
    let arg = args.join(' ').toLowerCase();

    let PinguGuildsArr = [];
    for (var i = 0; i < BotGuilds.length; i++) {
        let owner = !BotGuilds[i].owner ? BotGuilds[i].member(await BotGuilds[i].members.fetch(BotGuilds[i].ownerID)) : BotGuilds[i].owner;
        PinguGuildsArr[i] = new PinguGuild(BotGuilds[i], owner);

        if (arg == "show")
            await message.channel.send(new MessageEmbed()
                .setTitle(PinguGuildsArr[i].name)
                .setColor((PinguGuildsArr[i].clients[0] || PinguGuildsArr[i].clients[1]) &&
                    (PinguGuildsArr[i].clients[0].embedColor || PinguGuildsArr[i].clients[1].embedColor))
                .setThumbnail(BotGuilds[i].iconURL())
                .setDescription(`ID: ${PinguGuildsArr[i]._id}`)
                .setFooter(`Owner: ${PinguGuildsArr[i].guildOwner.user} | ${PinguGuildsArr[i].guildOwner._id}`)
                .addField('Prefix', (PinguGuildsArr[i].clients[0] || PinguGuildsArr[i].clients[1]) &&
                    (PinguGuildsArr[i].clients[0].prefix || PinguGuildsArr[i].clients[1].prefix)));
        if (arg && arg != "show" && ![PinguGuildsArr[i].name.toLowerCase(), PinguGuildsArr[i]._id].includes(arg)) continue;

        try {
            var pGuild = await PinguGuild.Get(BotGuilds[i]);
            if (!pGuild)
                await PinguGuild.Write(client, BotGuilds[i], module.exports.name, `Added **${BotGuilds[i].name}** to PinguGuilds from updatepguilds`);
            else {
                //pGuild.settings.config.achievements = new GuildAchievementConfig({
                //    guild: 'NONE',
                //    members: 'NONE'
                //}, pGuild._id);
                //pGuild.members = new Map();
                //BotGuilds[i].members.cache.array().forEach(gm => {
                //    if (gm.user.bot) return;
                //    let pgm = new PinguGuildMember(gm, pGuild.settings.config.achievements.notificationTypes.members);
                //    pGuild.members.set(pgm._id, pgm);
                //})
                //await PinguGuild.Update(client, ['settings', 'members'], pGuild, module.exports.name, `Added members & settings to ${pGuild.name}`);
            }
        } catch (err) {
            PinguLibrary.errorLog(client, 'Adding to PinguGuilds failed', message.content, err, {
                params: { client, message, args },
                additional: { arg, BotGuilds, owner, pGuild: PinguGuildsArr[i] },
                trycatch: { pGuild }
            });
        }
    }

    if (message.content.includes('updatepguilds'))
        message.react('✅');
    return message;
    //PinguLibrary.pGuildLog(message.client, module.exports.name, 'Going through servers complete!');
});