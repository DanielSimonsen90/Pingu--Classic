const { Message, MessageEmbed, Permissions } = require('discord.js');
const request = require('request');
const config = require('../../config.json');
const { PinguLibrary, PinguGuild, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'gif',
    description: 'Searches google for pingu memes',
    usage: '',
    id: 2,
    /**@param {{message: Message, pGuild: PinguGuild}}*/
    async execute({ message, pGuild }) {
        const PermCheck = PermissionCheck(message);
        if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

        if (!config || !config.api_key || !config.google_custom_search) {
            PinguLibrary.errorLog(message.client, 'Unable to send gif\nImage search requires both a YouTube API key and a Google Custom Search key!').then(() =>
                message.channel.send(`I was unable to search for a gif! I have contacted my developers...`));
        }

        // gets us a random result in first 5 pages
        const page = 1 + Math.floor(Math.random() * 5) * 10;
        const gifType = Math.floor(Math.random() * 2) == 1 ? "Club Penguin" : "Pingu";

        // we request 10 items
        request('https://www.googleapis.com/customsearch/v1?key=' + config.api_key + '&cx=' + config.google_custom_search + '&q=' + (`${gifType} gif`) + '&searchType=image&alt=json&num=10&start=' + page + "&fileType=gif", function (err, res, body) {

            // "https://www.googleapis.com/customsearch/v1?key=AIzaSyAeAr2Dv1umzuLes_zhlY0lON4Pf_uAKeM&cx=013524999991164939702:z24cpkwx9nz&q=sloth&searchType=image&alt=json&num=10&start=31"
            let data;
            try { data = JSON.parse(body); }
            catch (err) { PinguLibrary.errorLog(`Getting data in activity, request()\n${err}`); }

            if (!data) {
                PinguLibrary.errorLog(`Getting data in activity, request()\n${JSON.stringify(data)}`).then(() =>
                    message.channel.send(`I was unable to recieve a gif! I have contacted my developers...`));
            }
            else if (!data.items || data.items.length == 0) {
                PinguLibrary.errorLog(`Data for activity has no items\n${data}`).then(() =>
                    message.channel.send(`I was unable to find a gif! I have contacted my developers...`));
            }

            let item = data.items[Math.floor(Math.random() * data.items.length)];
            while (item.fileFormat != 'image/gif') 
                item = data.items[Math.floor(Math.random() * data.items.length)];

            message.channel.send(new MessageEmbed()
                .setImage(item.link)
                .setColor(message.guild ? pGuild.embedColor : PinguLibrary.DefaultEmbedColor)
            );
        });
    },
};

/**@param {Message} message*/
function PermissionCheck(message) {
    if (message.channel.type != 'dm') {
        return PinguLibrary.PermissionCheck(message, [
            DiscordPermissions.SEND_MESSAGES,
            DiscordPermissions.EMBED_LINKS
        ]);
    }
    return PinguLibrary.PermissionGranted;
}