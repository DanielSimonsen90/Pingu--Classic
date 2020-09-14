const { Message, MessageEmbed } = require('discord.js');
const request = require('request');
const Config = require('../../config.json');

module.exports = {
    name: 'gif',
    description: 'Searches google for pingu memes',
    usage: '',
    id: 2,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const PermCheck = PermissionCheck(message);
        if (PermCheck != `Permission Granted`) return message.channel.send(PermCheck);

        if (!Config || !Config.api_key || !Config.google_custom_search)
            return message.channel.send('Image search requires both a YouTube API key and a Google Custom Search key!');

        // gets us a random result in first 5 pages
        const page = 1 + Math.floor(Math.random() * 5) * 10;

        // we request 10 items
        request('https://www.googleapis.com/customsearch/v1?key=' + Config.api_key + '&cx=' + Config.google_custom_search + '&q=' + ('pingu gif') + '&searchType=image&alt=json&num=10&start=' + page, function (err, res, body) {

            // "https://www.googleapis.com/customsearch/v1?key=AIzaSyAeAr2Dv1umzuLes_zhlY0lON4Pf_uAKeM&cx=013524999991164939702:z24cpkwx9nz&q=sloth&searchType=image&alt=json&num=10&start=31"
            let data;
            try { data = JSON.parse(body); }
            catch (error) { return console.log(error); }
            if (!data) {
                console.log(data);
                return message.channel.send('Error:\n' + JSON.stringify(data));
            }
            else if (!data.items || data.items.length == 0) {
                console.log(data);
                return message.channel.send('No result for \'' + 'penguins :(' + '\'');
            }
            let color;
            if (message.channel.type != 'dm') {
                const pGuilds = require('../../guilds.json');
                color = pGuilds.find(pguild => pguild.guildID == message.guild.id).embedColor;
            }
            else color = 15527148;

            message.channel.send(new MessageEmbed()
                .setImage(data.items[Math.floor(Math.random() * data.items.length)].link)
                .setColor(color)
            );
        });
    },
};

/**@param {Message} message*/
function PermissionCheck(message) {
    const PermArr = ["SEND_MESSAGES", "EMBED_LINKS"],
        PermArrMsg = ["send messages", "send embed links"];
    if (message.channel.type != 'dm')
        for (var x = 0; x < PermArr.length; x++)
            if (!message.channel.permissionsFor(message.client.user).has(PermArr))
                return `Hey! I don't have permission to **${PermArrMsg}** in #${message.channel.name}!`;
    return `Permission Granted`;
}