const request = require('request'),
    Config = require('../../config.json'),
    { Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'meme',
    description: 'Searches google for pingu memes',
    usage: '',
    id: 2, 
    execute(message) {
        PermCheck = CheckPermissions(message);
        if (PermCheck != `Permission Granted`) return message.channel.send(PermCheck);

        if (!Config || !Config.api_key || !Config.google_custom_search)
            return message.channel.send('Image search requires both a YouTube API key and a Google Custom Search key!');

        // gets us a random result in first 5 pages
        const page = 1 + Math.floor(Math.random() * 5) * 10;

        // we request 10 items
        request('https://www.googleapis.com/customsearch/v1?key=' + Config.api_key + '&cx=' + Config.google_custom_search + '&q=' + ('pingu memes') + '&searchType=image&alt=json&num=10&start=' + page, function(err, res, body) {

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
                return message.channel.send('No result for \'' + 'sloth' + '\'');
            }
            const randResult = data.items[Math.floor(Math.random() * data.items.length)];

            let color;
            if (message.channel.type != 'dm') {
                const pGuilds = require('../../guilds.json');
                color = pGuilds.find(pguild => pguild.guildID == message.guild.id).embedColor;
            }
            else color = 15527148;

            message.channel.send(new MessageEmbed().setImage(randResult.link).setColor(color));
        });
    },
};

/**@param {Message} message*/
function CheckPermissions(message) {
    if (message.channel.type != 'dm') {
        const PermissionCheck = message.channel.permissionsFor(message.client.user),
            PermArr = ["SEND_MESSAGES", "EMBED_LINKS"];
        for (var Perm = 0; Perm < PermArr.length; Perm++)
            if (!PermissionCheck.has(PermArr[Perm]))
                return `Sorry, ${message.author}. It seems like I don't have the **${PermArr[Perm]}** permission.`;
    }
    return `Permission Granted`;
}