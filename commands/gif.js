module.exports = {
    name: 'gif',
    description: 'Searches google for pingu memes',
    usage: '',
    id: 2,
    execute(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!`)
            else if (!message.channel.memberPermissions(message.guild.client.user).has('EMBED_LINKS'))
                message.channel.send(`I'm sorry there's no embed. I don't have the **embed links** permission.`)
        }

        const request = require('request'),
            Config = require('../config.json'),
            Discord = require('discord.js');


        if (!Config || !Config.api_key || !Config.google_custom_search)
            return message.channel.send('Image search requires both a YouTube API key and a Google Custom Search key!');

        // gets us a random result in first 5 pages
        const page = 1 + Math.floor(Math.random() * 5) * 10;

        // we request 10 items
        request('https://www.googleapis.com/customsearch/v1?key=' + Config.api_key + '&cx=' + Config.google_custom_search + '&q=' + ('pingu gif') + '&searchType=image&alt=json&num=10&start=' + page, function (err, res, body) {

            // "https://www.googleapis.com/customsearch/v1?key=AIzaSyAeAr2Dv1umzuLes_zhlY0lON4Pf_uAKeM&cx=013524999991164939702:z24cpkwx9nz&q=sloth&searchType=image&alt=json&num=10&start=31"
            let data;
            try {
                data = JSON.parse(body);
            }
            catch (error) {
                return console.log(error);
            }
            if (!data) {
                console.log(data);
                return message.channel.send('Error:\n' + JSON.stringify(data));
            }
            else if (!data.items || data.items.length == 0) {
                console.log(data);
                return message.channel.send('No result for \'' + 'penguins :(' + '\'');
            }
            const randResult = data.items[Math.floor(Math.random() * data.items.length)],
                embed = new Discord.RichEmbed().setImage(randResult.link).setColor(0xfb8927);

            message.channel.send(embed);
        });
    },
};