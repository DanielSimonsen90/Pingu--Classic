const { Collection } = require('discord.js');
const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {

}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    const { roles, channels, setIcon, setSplash, members, me } = message.guild;

    if (!me.roles.cache.find(r => r.name == 'All-Seeing Eye'))
        return message.channel.send("Gib me da eye");

    const reason = "Bica's Nigger's Rise Up theme";
    await Promise.all([
        NTNChannels(),
        NTNRoles(),
        SetBasicServerImages(),
    ]);

    async function NTNChannels() {
        const niceChannels = channels.cache.array().filter(c => c.name.startsWith('nice'));
        return Promise.all(niceChannels.map(c => c.setName(c.name.replace('nice', 'nigger')));
    }
    async function NTNRoles() {
        const niceRoles = roles.cache.array().filter(r => r.name.startsWith("nice"));
        return Promise.all(niceRoles.map(r => r.setName(r.name.replace('nice', 'nigger')));
    }
    async function SetBasicServerImages() {
        return Promise.all([
            setIcon("https://media.discordapp.net/attachments/511951317091090433/832303225192972309/Aljolson.png")
        ]);
    }
});
