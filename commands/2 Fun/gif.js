const { Message, MessageEmbed, Permissions } = require('discord.js');
const request = require('request');
const config = require('../../config.json');
const { PinguLibrary, PinguGuild } = require('../../PinguPackage');

module.exports = {
    name: 'gif',
    description: 'Searches google for pingu memes',
    usage: '',
    id: 2,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const PermCheck = PermissionCheck(message);
        if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

        if (!config || !config.api_key || !config.google_custom_search) {
            PinguLibrary.errorLog(message.client, 'Unable to send gif\nImage search requires both a YouTube API key and a Google Custom Search key!').then(() =>
                message.channel.send(`I was unable to search for a gif! I have contacted my developers...`));
        }

        // gets us a random result in first 5 pages
        const page = 1 + Math.floor(Math.random() * 5) * 10;

        // we request 10 items
        request('https://www.googleapis.com/customsearch/v1?key=' + config.api_key + '&cx=' + config.google_custom_search + '&q=' + ('pingu gif') + '&searchType=image&alt=json&num=10&start=' + page, function (err, res, body) {

            // "https://www.googleapis.com/customsearch/v1?key=AIzaSyAeAr2Dv1umzuLes_zhlY0lON4Pf_uAKeM&cx=013524999991164939702:z24cpkwx9nz&q=sloth&searchType=image&alt=json&num=10&start=31"
            let data;
            try { data = JSON.parse(body); }
            catch (err) { PinguLibrary.errorLog(`I had an error while getting data in activity, request()\n${err}`); }

            if (!data) {
                PinguLibrary.errorLog(`I had an error while getting data in activity, request()\n${JSON.stringify(data)}`).then(() =>
                    message.channel.send(`I was unable to recieve a gif! I have contacted my developers...`));
            }
            else if (!data.items || data.items.length == 0) {
                PinguLibrary.errorLog(`I was unable to get data for activity\n${data}`).then(() =>
                    message.channel.send(`I was unable to find a gif! I have contacted my developers...`));
            }

            message.channel.send(new MessageEmbed()
                .setImage(data.items[Math.floor(Math.random() * data.items.length)].link)
                .setColor(message.channel.type != 'dm' ? PinguGuild.GetPGuild(message.guild).embedColor : 15527148)
            );
        });
    },
};

/**@param {Message} message*/
function PermissionCheck(message) {
    if (message.channel.type != 'dm') {
        return PinguLibrary.PermissionCheck(message, [
            Permissions.FLAGS.SEND_MESSAGES,
            Permissions.FLAGS.EMBED_LINKS
        ]);
    }
    return PinguLibrary.PermissionGranted;
}