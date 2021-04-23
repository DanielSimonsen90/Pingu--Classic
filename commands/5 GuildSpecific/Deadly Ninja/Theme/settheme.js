const { Collection } = require('discord.js');
const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('settheme', 'GuildSpecific', `Sets the theme to whatever was coded`, {
    permissions: ["MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_GUILD"],
    guildOnly: true,
    specificGuildID: '405763731079823380'
}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
        const { roles, channels, setIcon, setSplash, members, me } = message.guild;

        if (!me.roles.cache.find(r => r.name == 'All-Seeing Eye'))
            return message.channel.send("Gib me da eye");

        const reason = "Bica's Nigger's Rise Up theme";
        await Promise.all([
            NTNChannels(),
            NTNRoles(),
            SetBasicServerImages(),
            TheRest()
        ]);

        async function NTNChannels() {
            const niceChannels = channels.cache.array().filter(c => c.name.startsWith('nice'));
            return Promise.all(niceChannels.map(c => c.setName(c.name.replace('nice', 'nigger'), reason)));
        }
        async function NTNRoles() {
            const niceRoles = roles.cache.array().filter(r => r.name.startsWith("nice"));
            return Promise.all(niceRoles.map(r => r.setName(r.name.replace('nice', 'nigger'), reason)));
        }
        async function SetBasicServerImages() {
            return Promise.all([
                message.guild.setIcon("https://media.discordapp.net/attachments/474129152065273866/833790900806615070/Aljolson.png", reason)
            ]);
        }
        async function TheRest() {
            const channelStuff = new Collection();
            channelStuff.set('652197369865175041', 'nice-hood😶');
            channelStuff.set('405763731713425422', 'hood Vibes🍹');
            channelStuff.set('475616873115811860', 'Kiss the BBC guy goodnight💋');
            channelStuff.set('826102383238184990', 'nigga-streams-only📢');
            channelStuff.set('655020851216908289', 'niggas-in-da-hood📻');
            channelStuff.set('635548726487810055', 'nigger-dic-bro🍆');

            return Promise.all(...channelStuff.map((name, id) => channels.cache.get(id).setName(name, reason)),
                roles.cache.get('699870814421516301').setName('Dredd Guy'));
        }
})