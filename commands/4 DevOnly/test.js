//const { _ } = require('discord.js');
const { PinguCommand, PinguLibrary, PinguUser, PinguGuild, TimeLeftObject } = require('PinguPackage');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {

},
    async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
        const startTime = Date.now();

        const [Guilds, Users] = await Promise.all([
            PinguGuild.GetPGuilds(),
            PinguUser.GetPUsers()
        ]);
        const getUser = (id) => client.users.cache.get(id);

        await Promise.all(client.commands
            .filter(cmd =>
                cmd.name.startsWith('updatep') &&
                cmd.name.endsWith('s')
            ).map(cmd => cmd.execute({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient })))

        for (var pGuild of Guilds) {
            const guild = client.guilds.cache.get(pGuild._id);
            if (!guild) continue;

            const ownerData = { guild, user: getUser(guild.ownerID), guildMember: guild.owner };

            //members
            for (var [pgmID, pgm] of pGuild.members) {
                const user = client.users.cache.get(pgmID);
                const member = guild.member(user);
                const data = { guild, user, guildMember: member }

                await PinguLibrary.AchievementCheck(client, data, 'EVENT', 'guildMemberAdd', [member]);
            }

            //owner
            await PinguLibrary.AchievementCheck(client, ownerData, 'EVENT', 'guildCreate', [guild]);
        }

        for (var pUser of Users) {
            const user = getUser(pUser._id);
            if (!user) continue;

            if (pUser.marry.partner) await PinguLibrary.AchievementCheck(client, { user }, 'COMMAND', 'marry', [{}]);
            if (pUser.daily.streak) await PinguLibrary.AchievementCheck(client, { user }, 'COMMAND', 'daily', [{ message: { author: user } }]);
        }

        const operationString = (finishTime) => `Operation took: ${new TimeLeftObject(new Date(startTime), new Date(finishTime)).toString()}`;
        message.channel.send(`Gave achievements!\n${operationString(Date.now())}`);

        //for (var pUser of Users) {
        //    let achievements = pUser.achievementConfig.achievements.filter((a, _, arr) => {
        //        const achievementCount = arr.filter(ac => ac._id == a._id).length;
        //        if (achievementCount > 1) return null;
        //    });

        //    pUser.achievementConfig.achievements = achievements;
        //    await PinguUser.UpdatePUser(client, { achievementConfig: pUser.achievementConfig }, pUser, module.exports.name,
        //        `Updated ${pUser.tag}'s achievements to not include duplicates.`,
        //        `Failed to update ${pUser.tag}'s achievements to not include duplicates.`
        //    );
        //}

        //return message.channel.send(`Updated duplicates.\n${operationString(Date.now())}`);
    });
