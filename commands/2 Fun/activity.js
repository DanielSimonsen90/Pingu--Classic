const request = require('request'),
    config = require('../../config.json'),
    { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'activity',
    cooldown: 5,
    description: 'You <activity> <person>',
    usage: '<activity> <@person>',
    guildOnly: true,
    id: 2,
    example: ["hug @Danho#2105"],
    /**@param {Discord.Message} message @param {string[]} args */
    execute(message, args) {
        //Permission check
        const PermCheck = PermissionCheck(message, args);
        if (PermCheck != `Permission Granted`) return message.channel.send(PermCheck);

        //Create Person variables
        const User = message.author.username,
            Activity = DefineActivity(message, args),
            Person = DefinePerson(message);

        //ActivityLink Function
        if (!config || !config.api_key || !config.google_custom_search)
            return message.channel.send('Image search requires both a YouTube API key and a Google Custom Search key!');

        //Gets us a random result in first 5 pages
        const page = 1 + Math.floor(Math.random() * 5) * 10;

        //We request 10 items
        request('https://www.googleapis.com/customsearch/v1?key=' + config.api_key + '&cx=' + config.google_custom_search + '&q=' + (`"anime" "${args[0]}" person "gif"`) + '&searchType=image&alt=json&num=10&start=' + page, function (err, res, body) {
            let data;
            try { data = JSON.parse(body); }
            catch (error) { return console.log(error); }

            if (!data) {
                console.log(data);
                return message.author.send('Error:\n' + JSON.stringify(data));
            }
            else if (!data.items || data.items.length == 0) {
                console.log(data);
                return message.channel.send('I failed to find that!');
            }

            const pGuilds = require('../../guilds.json');
            const color = pGuilds.find(pguild => pguild.guildID == message.guild.id).embedColor;

            const embed = new MessageEmbed()
                .setTitle(`${User} ${Activity} ${Person}`)
                .setImage(data.items[Math.floor(Math.random() * data.items.length)].link)
                .setColor(color);

            //Return the whole thing LuL
            //React with F if the user uses *activity on themselves
            if (Person == User)
                message.channel.send(embed).then((NewMessage) => { NewMessage.react('🇫'); });
            else message.channel.send(embed);
        });
    },
};

/**@param {Discord.Message} message @param {string[]} args*/
function PermissionCheck(message, args) {
    if (message.channel.type == 'dm')
        return `I can't execute that command in DMs!`;

    const PermArr = ["SEND_MESSAGES", "EMBED_LINKS"],
        PermArrMsg = ["send messages", "use embed links"];

    for (var x = 0; x < PermArr.length; x++)
        if (!message.channel.permissionsFor(message.client.user).has(PermArr[x]))
            return `Hey! I don't have permission to **${PermArrMsg[x]}** in #${message.channel.name}!`;

    if (!args[0]) return `Provide me with proper arguments please UwU`;

    return `Permission Granted`;
}
/**@param {Discord.Message} message*/
function DefinePerson(message) {
    let Person = message.mentions.users.first().username || message.author.username;

    return Person.includes('!') ? Person.replace('!', '') : Person;
}
/**@param {Discord.Message} message @param {string[]} args*/
function DefineActivity(message, args) {
    if (args[0].toLowerCase() === 'fuck' && !message.channel.nsfw)
        return `nono`;

    //Grammarly fix Activity
    args[0] += args[0].endsWith('s') || args[0].endsWith('h') ? 'es' :
        args[0].endsWith('y') ? args[0].substring(0, args[0].length - 1) + 'ies' :
            's';

    return args.slice(0, args.length - 1).join(' ') || args[0];
}
