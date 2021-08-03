const request = require('request');
const { Message, MessageEmbed } = require('discord.js');
const { PinguCommand, config } = require('PinguPackage');

module.exports = new PinguCommand('activity', 'Fun', 'You <activity> <person>!', {
    usage: '<activity> <@person>',
    guildOnly: true,
    example: ["hug @Danho#2105"],
    permissions: ['EMBED_LINKS']
}, async ({ client, message, args, pGuildClient }) => {
    //Permission check
    if (args.length < 2) return message.channel.send(`You didn't provide me with enough arguments! What would you like to do to someone?`);

    //Create Person variables
    const user = message.author.username,
        activity = DefineActivity(message, args),
        person =  message.mentions.users.first()?.username || message.author.username;

    //ActivityLink Function
    if (!config || !config.api_key || !config.google_custom_search) {
        client.log('error', 'Unable to send gif\nImage search requires both a YouTube API key and a Google Custom Search key!', message.content, null, {
            params: { message, pGuildClient },
            additional: {
                activity: { user, activity, person },
                keys: {
                    api_key: config.api_key,
                    google_custom_search: config.google_custom_search
                }
            }
        }).then(() => message.channel.send(`I was unable to search for a gif! I have contacted my developers...`));
    }

    //Gets us a random result in first 5 pages
    const page = 1 + Math.floor(Math.random() * 5) * 10;
    const { body } = await requestImage();
    
    try { var data = JSON.parse(body); }
    catch (err) {
        client.log('error', `Getting data`, message.content, err, {
            params: { message, pGuildClient },
            additional: {
                activity: { user, activity, person },
                keys: { api_key: config.api_key, google_custom_search: config.google_custom_search }
            }
        });
    }

    if (!data) {
        client.log('error', `Getting data in activity`, message.content, null, {
            params: { message, pGuildClient },
            additional: {
                page, data,
                activity: { user, activity, person }
            }
        }).then(() => message.channel.send(`I was unable to recieve a gif! I have contacted my developers...`));
    }
    else if (!data.items || !data.items.length) {
        client.log('error', `I was unable to get data for activity`, message.content, null, {
            params: { message, pGuildClient },
            additional: {
                page, data,
                activity: { user, activity, person }
            }
        }).then(() => message.channel.send(`I was unable to find a gif! I have contacted my developers...`));
    }

    const embed = new MessageEmbed({
        title: `${user} ${activity} ${person}`,
        image: { url: data.items[Math.floor(Math.random() * data.items.length)].link },
        color: pGuildClient.embedColor || client.DefaultEmbedColor
    })

    const sent = await message.channel.send(embed);

    //React with F if the user uses *activity on themselves
    if (person == user) await sent.react('🇫');

    return sent;

    /**@returns {Promise<{ res: Response, body: string }>}*/
    function requestImage() {
        return new Promise((resolve, reject) => {
            request(`https://www.googleapis.com/customsearch/v1?key=${config.api_key}&cx=${config.google_custom_search}&q="anime ${args.first} person gif"&searcgType=image&alt=json&num=10&start=${page}`, (err, res, body) => {
                if (err) reject(err);
                else resolve({ res, body });
            })
        })
    }
});

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
