const Discord = require('discord.js'),
    ms = require('ms');
module.exports = {
    name: 'poll',
    cooldown: 5,
    description: 'Create a poll for users to react',
    usage: '<time> <question>',
    guildOnly: true,
    id: 1,
    execute(message, args) {
        //Permission check
        if (!message.channel.memberPermissions(message.guild.client.user).has('SEND_MESSAGES'))
            return message.author.send(`Hey! I don't have permission to **send messages** in #${message.channel.name}!`)
        else if (!message.channel.memberPermissions(message.guild.client.user).has('MANAGE_MESSAGES'))
            return message.author.send(`Hey! I don't have permission to **manage messages**!`);
        else if (message.guild.member(message.author).roles.find('name', 'Polls') ||
            !message.channel.memberPermissions(message.author).has('ADMINISTRATOR'))
            return message.author.send(`You don't have \`administrator\` permissions or a \`Polls\` role!`)
        else if (!args[1])
            return message.author.send('Please provide a poll question!');
        else if (args[0].endsWith('s')) {
            if (parseInt(args[0].substring(0, args[0].length - 1)) < 30)
                return message.author.send('Please specfify a time higher than 29s');
        }
        else if (!parseInt(args[0].substring(0, args[0].length - 1)))
            return message.author.send('Please provide a valid time!');

        //Create scrubby variables
        const Time = args[0] || '10m';
        let Poll = args.slice(1).join(" "),
            PollMessage;
        message.delete();

        //Create Embed
        let Embed = new Discord.RichEmbed()
            .setTitle(Poll)
            .setColor(0xfb8927)
            .setDescription(`Time set: ${Time}`)
            .setFooter(`Poll created by @${message.author.tag}.`);

        //Send Embed and react.
        message.channel.send(Embed).then(NewMessage => {
            PollMessage = NewMessage;
            PollMessage.react('👍').then(() => {
                PollMessage.react('👎');
            })
        })

        try {
            setTimeout(function () {
                //Creating variables
                const Yes = PollMessage.reactions.get('👍').count,
                    No = PollMessage.reactions.get('👎').count;
                let Verdict;

                //Defining Verdict
                if (Yes > No)
                    Verdict = "Yes";
                else if (No > Yes)
                    Verdict = "No";
                else
                    Verdict = "Undecided";
                Verdict = `**${Verdict}**`;

                //Submitting Verdict
                message.channel.send(`The poll of "**${Poll}**", voted **${Verdict}**!`);

                Embed.setTitle(`FINISHED!: ${Poll}`).setDescription(`Voting done! Final answer: ${Verdict}`)
                PollMessage.edit(Embed);
            }, ms(Time));
        }
        catch{
            return message.author.send(`Please specify a time!`);
        }
    },
};