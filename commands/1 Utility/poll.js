const { Message, MessageEmbed } = require('discord.js'),
    ms = require('ms');
module.exports = {
    name: 'poll',
    cooldown: 5,
    description: 'Create a poll for users to react',
    usage: '<time> <question>',
    guildOnly: true,
    id: 1,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        //Permission check
        const PermResponse = PermissionCheck(message, args);
        if (PermResponse != `Permission Granted`) return message.channel.send(PermResponse);

        //Create scrubby variables
        const Time = args[0] || '10m';
        let Poll = args.slice(1).join(" "),
            PollMessage;
        message.delete();

        const pGuilds = require('../../guilds.json');
        const color = pGuilds.find(pguild => pguild.guildID == message.guild.id).EmbedColor;

        //Create Embed
        let Embed = new MessageEmbed()
            .setTitle(Poll)
            .setColor(color)
            .setDescription(`Time set: ${Time}`)
            .setFooter(`Poll created by @${message.author.tag}.`);

        //Send Embed and react.
        message.channel.send(Embed).then(NewMessage => {
            PollMessage = NewMessage;
            PollMessage.react('👍').then(() => PollMessage.react('👎'));
        })

        try { setTimeout(OnTimeOut(message, Embed, PollMessage, Poll), ms(Time)); }
        catch (error) { return console.log(error); }
    },
};
/**@param {Message} message @param {string[]} args*/
function PermissionCheck(message, args) {
    const PermArr = ["SEND_MESSAGES", "MANAGE_MESSAGES"],
        PermArrMsg = ["send messages", "manage messages"];
    for (var x = 0; x < PermArr.length; x++)
        if (!message.channel.permissionsFor(message.client.user).has(PermArr[x]))
            return `Hey! I don't have permission to **${PermArrMsg}** in #${message.channel.name}!`;

    if (message.guild.member(message.author).roles.cache.find(role => role.name == 'Polls') ||
        !message.channel.permissionsFor(message.author).has('ADMINISTRATOR'))
        return `You don't have \`administrator\` permissions or a \`Polls\` role!`;
    else if (!args[1])
        return 'Please provide a poll question!';
    else if (args[0].endsWith('s') && parseInt(args[0].substring(0, args[0].length - 1)) < 30)
        return 'Please specfify a time higher than 29s';
    else if (!parseInt(args[0].substring(0, args[0].length - 1)))
        return 'Please provide a valid time!';
    return `Permission Granted`;
}
/**@param {Message} message @param {MessageEmbed} Embed @param {Message} PollMessage @param {string} Poll*/
function OnTimeOut(message, Embed, PollMessage, Poll) {
    //Creating variables
    const Yes = PollMessage.reactions.cache.get('👍').count,
        No = PollMessage.reactions.cache.get('👎').count;
    let Verdict;

    //Defining Verdict
    Verdict = Yes > No ? "Yes" :
        No > Yes ? "No" :
            "Undecided";

    //Submitting Verdict
    message.channel.send(`The poll of "**${Poll}**", voted **${Verdict}**!`);

    PollMessage.edit(Embed.setTitle(`FINISHED!: ${Poll}`).setDescription(`Voting done! Final answer: ${Verdict}`));
}