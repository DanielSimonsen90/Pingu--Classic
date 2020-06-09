const request = require('request'),
    Config = require('../config.json'),
    Discord = require('discord.js');

module.exports = {
    name: 'activity',
    cooldown: 5,
    description: 'You <activity> <person>',
    usage: '<activity> <@person>',
    id: 2,
    execute(message, args) {
        //Permission check
        if (message.channel.type !== 'dm') {
            if (!message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES'))
                return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!`)
            else if (!message.channel.memberPermissions(message.guild.client.user).has('EMBED_LINKS'))
                return message.author.send(`Hey! I don't have permission to **use embed links** in #${message.channel.name}!`)
            else if (!args[0])
                return message.author.send(`Provide me with proper arguments please UwU`);
        }
        else return message.author.send(`I can't execute that command in DMs!`);

        //Create Person variables
        const User = message.author.username,
              Person = message.mentions.users.first().username || message.author.username; 

        if (Person.startsWith('<@!'))
            Person = `<@${Person.substring(3, Person.length)}`;

        //Test if activity is appropriate in current channel
        if (args[0].toLowerCase() === 'fuck' && !message.channel.nsfw)
            return message.channel.send(`I shouldn't be posting that stuff here!`);

        //Grammarly fix Activity
        args[0] += args[0].endsWith('s') ? 'es' :
            args[0].endsWith('y') ? args[0].substring(0, args[0].length - 1) + 'ies' : 's';

        var Activity = args.slice(0, args.length - 1).join(' ') || args[0];

        //ActivityLink Function
        if (!Config || !Config.api_key || !Config.google_custom_search)
            return message.channel.send('Image search requires both a YouTube API key and a Google Custom Search key!');
                
        //Gets us a random result in first 5 pages
        const page = 1 + Math.floor(Math.random() * 5) * 10;

        //We request 10 items
        request('https://www.googleapis.com/customsearch/v1?key=' + Config.api_key + '&cx=' + Config.google_custom_search + '&q=' + (`"anime" "${args[0]}" person "gif"`) + '&searchType=image&alt=json&num=10&start=' + page, function (err, res, body) {
            let data;
            try { data = JSON.parse(body); }
            catch (error) { return console.log(error); }

            console.log(data);
            if (!data) return message.author.send('Error:\n' + JSON.stringify(data));
            else if (!data.items || data.items.length == 0)
                return message.channel.send('I failed to find that!');

            const randResult = data.items[Math.floor(Math.random() * data.items.length)],
                embed = new Discord.RichEmbed()
                .setTitle(`${User} ${Activity} ${Person}`)
                .setImage(randResult.link)
                .setColor(0xfb8927);

            //Return the whole thing LuL
            //React with F if the user uses *activity on themselves
            if (Person === User)
                message.channel.send(embed)
                    .then((NewMessage) => { NewMessage.react('🇫'); });
            else message.channel.send(embed);
        });
    },
};