//const { _ } = require('discord.js');
const { PinguCommand, PinguLibrary, PinguUser, PinguGuild, TimeLeftObject } = require('PinguPackage');
const ms = require('ms');
const { MessageReaction, User } = require('discord.js');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {

}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    const pUsers = await PinguUser.GetPUsers();
    const users = (await Promise.all(pUsers.map(pu => client.users.fetch(pu._id)))).filter(v => v);

    //users.forEach(async user => {
        const user = message.author;
        const dm = await user.createDM();
        const pUser = pUsers.find(pu => pu._id == user.id)
        const serversShared = pUser.sharedServers.length;

        try {
            const sent = await dm.send(
                `Hello!\n` +
                `\n` +
                `If you don't know me, we share ${(serversShared > 1 ? `${serversShared} servers` : "a server")} together and therefore I want you to know this...\n` +
                `I have recently been upgraded with an achievement system, and so I will most likely send you a few congratulation messages, for achieveing pre-defined achievements.\n` +
                `Please note that this might become annoying - especially in the "start" - so you are welcome to block me if it bothers you.\n` +
                `\n` +
                `Since I share ${(serversShared > 1 ? "more than one" : "a")} server with you, I have your Discord account as an entry in my database. ` +
                `You can see what save from you, by reacting ℹ️ to this message.\n` +
                `If you wish to be deleted from my database, you are welcome to react 🗑️ to this message - although be aware that I'm programmed to add you automatically again, if you use one of my features...\n` +
                `\n` +
                `Thank you for understanding, and have an amazing day ${(PinguLibrary.getEmote(client, "hypers", PinguLibrary.SavedServers.PinguSupport(client)))}`
            );

            const reactions = ['ℹ️', '🗑️'];
            for (var reaction of reactions) await sent.react(reaction);

            /**@param {MessageReaction} reaction
             * @param {User} user*/
            const filter = (reaction, user) => !user.bot && reactions.includes(reaction.emoji.name);

            const collector = sent.createReactionCollector(filter, { time: ms('24h') });
            collector.on('collect', async (reaction, user) => {
                switch (reaction.emoji.name) {
                    case reactions[0]: return client.commands.get('info').execute({
                        client,
                        message: {
                            channel: dm,
                            client,
                            author: user,
                        },
                        args: ["user", "all"],
                        pAuthor: pUser
                    });
                    case reactions[1]:
                        await PinguUser.DeletePUser(client, user, module.exports.name,
                            `Successfully deleted ${user.tag} from my database, after reacting to the notice message in DMs.`,
                            `Failed to delete ${user.tag} from my database, after reacting to the notice message in DMs.`
                        );
                        await dm.send("Your data has been deleted!");
                        return collector.stop("Data was deleted, no reason to stay active");
                    default: return;
                }
            })
        } catch { return; }
    })
//});