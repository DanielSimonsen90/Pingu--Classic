const request = require('request');
const { Message, MessageEmbed } = require('discord.js');
const { PinguCommand, PinguLibrary, config } = require('PinguPackage');

module.exports = new PinguCommand('activity', 'Fun', 'You <activity> <person>!', {
    usage: '<activity> <@person>',
    guildOnly: true,
    example: ["hug @Danho#2105"],
    permissions: ['EMBED_LINKS']
}, async ({ message, args, pGuildClient }) => {
    //Permission check
    const PermCheck = PermissionCheck(message, args);
    if (PermCheck != PinguLibrary.PermissionGranted) return message.channel.send(PermCheck);

    //Create Person variables
    const User = message.author.username,
        Activity = DefineActivity(message, args),
        Person = DefinePerson(message);

    //ActivityLink Function
    if (!config || !config.api_key || !config.google_custom_search) {
        PinguLibrary.errorLog(message.client, 'Unable to send gif\nImage search requires both a YouTube API key and a Google Custom Search key!', message.content, null, {
            params: { message, pGuildClient },
            additional: {
                activity: { User, Activity, Person },
                keys: {
                    api_key: config.api_key,
                    google_custom_search: config.google_custom_search
                }
            }
        }).then(() =>
            message.channel.send(`I was unable to search for a gif! I have contacted my developers...`));
    }

    //Gets us a random result in first 5 pages
    const page = 1 + Math.floor(Math.random() * 5) * 10;

    //We request 10 items
    request('https://www.googleapis.com/customsearch/v1?key=' + config.api_key + '&cx=' + config.google_custom_search + '&q=' + (`"anime" "${args[0]}" person "gif"`) + '&searchType=image&alt=json&num=10&start=' + page, function (err, res, body) {
        try { var data = JSON.parse(body); }
        catch (err) {
            PinguLibrary.errorLog(message.client, `Getting data`, message.content, err, {
                params: { message, pGuildClient },
                additional: {
                    activity: { User, Activity, Person },
                    keys: {
                        api_key: config.api_key,
                        google_custom_search: config.google_custom_search
                    }
                }
            });
        }

        if (!data) {
            PinguLibrary.errorLog(message.client, `Getting data in activity`, message.content, null, {
                params: { message, pGuildClient },
                additional: {
                    page, data,
                    activity: { User, Activity, Person }
                }
            }).then(() =>
                message.channel.send(`I was unable to recieve a gif! I have contacted my developers...`));
        }
        else if (!data.items || !data.items.length) {
            PinguLibrary.errorLog(message.client, `I was unable to get data for activity`, message.content, null, {
                params: { message, pGuildClient },
                additional: {
                    page, data,
                    activity: { User, Activity, Person }
                }
            }).then(() =>
                message.channel.send(`I was unable to find a gif! I have contacted my developers...`));
        }

        const embed = new MessageEmbed()
            .setTitle(`${User} ${Activity} ${Person}`)
            .setImage(data.items[Math.floor(Math.random() * data.items.length)].link)
            .setColor(pGuildClient.embedColor);

        //Return the whole thing LuL
        //React with F if the user uses *activity on themselves
        if (Person == User) message.channel.send(embed).then(NewMessage => { NewMessage.react('🇫'); });
        else message.channel.send(embed);
    });
});

/**@param {Message} message 
 * @param {string[]} args*/
function PermissionCheck(message, args) {
    if (!args[0]) return `Provide me with proper arguments please UwU`;

    return PinguLibrary.PermissionGranted;
}
/**@param {Message} message*/
function DefinePerson(message) {
    let Person = message.mentions.users.first() && message.mentions.users.first().username || message.author.username;

    return Person.includes('!') ? Person.replace('!', '') : Person;
}
/**@param {Message} message 
 * @param {string[]} args*/
function DefineActivity(message, args) {
    if (args[0].toLowerCase() == 'fuck' && !message.channel.nsfw)
        return `nono`;

    //Grammarly fix Activity
    args[0] += args[0].endsWith('s') || args[0].endsWith('h') ? 'es' :
        args[0].endsWith('y') ? args[0].substring(0, args[0].length - 1) + 'ies' :
            's';

    return args.slice(0, args.length - 1).join(' ') || args[0];
}
