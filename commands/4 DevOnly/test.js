const { Collection } = require('discord.js');
const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('test', 'DevOnly', `Test command for Danho`, {

}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    const { roles, channels, setIcon, setSplash, members, me } = message.guild;

    if (!me.roles.cache.find(r => r.name == 'All-Seeing Eye'))
        return message.channel.send("Gib me da eye");

    const reason = "Danho's The Nice Guys theme";
    await Promise.all([
        GiveMembersNiceMembersRole(),
        RenameChannels(),
        RenameRoles(),
        SetBasicServerImages(),
    ]);
    return sendToThemeLog();

    async function GiveMembersNiceMembersRole() {
        const niceMembersRole = await roles.create({
            data: {
                name: "Nice Members",
                color: "#000001"
            },
            reason
        });
        return await Promise.all(members.cache.array().map(gm => gm.roles.add(niceMembersRole)));
    }
    async function RenameChannels() {
        const channelsToModify = new Collection();
        (function setInfo() {
            channelsToModify.set('829217100778307614', 'nice-guidelines📜');
            channelsToModify.set('472484901237686292', 'nice-announcements📢');
            channelsToModify.set('472483818893344779', 'nice-door🚪');
            channelsToModify.set('505809025221525525', 'nice-advertisement🎥');
        })();
        (function setChats() {
            channelsToModify.set('405763731713425420', 'nice-chat💬');
            channelsToModify.set('829217100778307614', 'nice-jam🎶');
            channelsToModify.set('829217100778307614', 'nice-moment🌞');
            channelsToModify.set('485532271319842825', 'nice-quotes📌');
        })();
        (function setVoiceChannels() {
            channelsToModify.set('652197369865175041', 'nice-tits😶');
            channelsToModify.set('405763731713425422', 'Nice Vibes🍹');
            channelsToModify.set('721110569050046504', 'Nice Party🥤');
            channelsToModify.set('475616873115811860', 'Kiss the nice guy goodnight💋');
        })();
        (function setStreamChannels() {
            channelsToModify.set('829217100778307614', 'nice-streams-only📢');
            channelsToModify.set('829217100778307614', 'nice-clips🎬');
        })();
        (function setBotChannels() {
            channelsToModify.set('829217100778307614', 'nice-spam🤖');
            channelsToModify.set('829217100778307614', 'nice-music📻');
            channelsToModify.set('829217100778307614', 'nice-memes😂');
        })();
        (function setPrivateChannels() {
            channelsToModify.set('829217100778307614', 'nice-code⌨');
            channelsToModify.set('829217100778307614', 'nice-kids-wait-👶');
            channelsToModify.set('829217100778307614', 'nice-package-bro🍆');
        })();

        return Promise.all(channelsToModify.map((name, id) => channels.cache.get(id).setName(name, reason)));
    }
    async function RenameRoles() {
        const rolesToModify = new Collection();
        (function setManagementRoles() {
            rolesToModify.set('699870814421516301', 'Nicest Guy');
            rolesToModify.set('497439032138006530', 'Nice Workers');
            rolesToModify.set('720894710092267550', 'Nice HAdmins');
            rolesToModify.set('691624820269383690', 'Nice Admins');
        })();
        (function setACtiveRoles() {
            rolesToModify.set('791368426522017792', 'Nice Chatters');
            rolesToModify.set('791368683933925407', 'Nice Talkers');
        })();

        return Promise.all(rolesToModify.map((name, id) => roles.cache.get(id).setName(name)));
    }
    async function SetBasicServerImages() {
        return Promise.all([
            setIcon("https://media.discordapp.net/attachments/474129152065273866/829216820795146250/NiceGuy.png"),
            setSplash("https://media.discordapp.net/attachments/474129152065273866/829216872007860296/-MtRn5iEKqMjNq-4bVPC3rrWUUp-noq_RldW6i8ccrBDP8nfuxqHN6wZ9Q6P9c3gq3QuXZWSBLue5A8p2WNbXfwMQoMYZu7S2oo1.png")
        ]);
    }
    async function sendToThemeLog() {
        const themeLogChannel = channels.cache.get('781087883259543563');

        const fileBuffer = require('fs').readFileSync('../../../../../Desktop/theme.txt');
        if (!fileBuffer || !fileBuffer.toString()) return message.channel.send("Couldn't find theme.txt!");

        return themeLogChannel.send(fileBuffer.toString());
    }
});
