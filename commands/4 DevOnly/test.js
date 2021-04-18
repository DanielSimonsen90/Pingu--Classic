//const { _ } = require('discord.js');
const { PinguCommand, PinguLibrary, PinguUser, PinguGuild, TimeLeftObject } = require('PinguPackage');
const ms = require('ms');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {

},
    async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
        const pUsers = await PinguUser.GetPUsers();
        const users = (await Promise.all(pUsers.map(pu => client.users.fetch(pu._id)))).filter(v => v);

        users.forEach(async user => {
            const dm = await user.createDM();
            const pUser = pUsers.find(pu => pu._id == user.id)
            const serversShared = pUser.sharedServers.length;

            try {
                const sent = await dm.send(
                    `Hello!\n` +
                    `\n` +
                    `If you don't know me, we share ${(serversShared > 1 ? `${serversShared} servers` : "a server")} together and therefore I want you to know this...` +
                    `I have recently been upgraded with an achievement system, and so I will most likely send you a few congratulation messages, for achieveing pre-defined achievements.\n` +
                    `Please note that this might become annoying - especially in the "start" - so you are welcome to block me if it bothers you.\n` +
                    `\n` +
                    `Since I share ${(serversShared > 1 ? "more than one" : "a")} server with you, I have your Discord account as an entry in my database. ` +
                    `You can see what save from you, by using my \`${client.DefaultPrefix}info user all\` command.\n` +
                    `If you wish to be deleted from my database, you are welcome to react to this message - although I'm programmed to add you automatically again, if you use one of my features...\n` +
                    `\n` +
                    `Thank you for understanding, and have an amazing day ${(PinguLibrary.getEmote(client, "hypers", PinguLibrary.SavedServers.PinguSupport(client)))}`
                );
                await sent.react('🗑️');
                sent.createReactionCollector((reaction, user) => !user.bot, { time: ms('24h') }).on('collect', (reaction, user) => {
                    await PinguUser.DeletePUser(client, user, module.exports.name,
                        `Successfully deleted ${user.tag} from my database, after reacting to the notice message in DMs.`,
                        `Failed to delete ${user.tag} from my database, after reacting to the notice message in DMs.`
                    );
                    return dm.send("Your data has been deleted!");
                })

            } catch { return; }

        })

    });
