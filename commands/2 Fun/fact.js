const { MessageEmbed, Message } = require('discord.js');
module.exports = {
    name: 'fact',
    cooldown: 5,
    description: 'Pingu Facts woah',
    usage: '',
    id: 2,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        const PermCheck = PermissionCheck(message);
        if (PermCheck != `Permission Granted`) return message.author.send(PermCheck);

        const Facts = [
            //Literal Penguin facts
            "Penguins are birds but they __cannot__ fly whatsoever. Visit LearnToFly to learn more.",
            "There are in fact no penguins at the North Pole.",
            "Penguins actually drink the seawater.",
            "Penguins spend as much time in the water, as they do on land.",
            "Penguins huddle together in order to keep themselves warm.",
            "\"Chinstrap Penguins\" look like they're wearing a black helmet, which is useful, considering they are the most aggressive type of penguin of all species.",
            "\"Little Blue Penguins\" are considered the smallest penguin species, having their average height around 33 centimeters.",
            "Their colorscheme helps them camoflage, as their black back is hard to see from above, and their white stomach looks like the reflection of the sun.",
            "Penguins in Antarctica have no land based predators.",
            //Club Penguin Facts
            "Club Penguin was launched October 24, 2005, and had over 30 million users by late 2007.",
            "The original concept of Club Penguin, was when programmer, Lance Priebe, started to develop his \"Snow Blasters\" game in his spare time.",
            "The original target group of Club Penguin was around 6-14 year-olds",
            "The shutdown of the original Club Penguin, was announced on Janurary 30th, 2017, and executed March 29th, 2017.",
            "\"Club Penguin: Elite Penguin Force\", EPF, was released by Disney for the Nintendo DS on November 25th, 2008.",
            "\"Club Penguin: Game Day!\", was released for the Nintendo Wii in 2010.",
            "Club Penguin has had various apperances on UK television, including their Christmas, Halloween and Summer specials in 2014 and 2015.",
            "Books of Club Penguin were purchasable in 2008, as an honor of their third anniversary.",
            //Pingu Facts
            "Pingu is a stop motion comedy made for kids.It is famous worldwide for also not needing translations, as the characters only make sounds.",
            "Pingu's birthday is October 28th",
            "Pingu has a girlfriend named \"Pingi\".What are you doing with your life?",
            "Pingu has a tomboy sister named Pinga.",
            "There are 157 episodes of Pingu, including the original series and the revived series.",
            "Pingu was created by Otmar Gutmann from Switzerland."],
            Fact = Math.floor(Math.random() * (Facts.length - 1)),
            Title = Fact <= 8 ? "Penguin Facts" : Fact <= 16 ? "Club Penguin Facts" : "Pingu (TV) Facts";

        let color;
        if (message.channel.type != 'dm') {
            const pGuilds = require('../../guilds.json');
            color = pGuilds.find(pguild => pguild.guildID == message.guild.id).EmbedColor;
        }
        else color = 15527148;

        message.channel.send(new MessageEmbed()
            .setTitle(Title)
            .setDescription(Facts[Fact])
            .setColor(color)
            .attachFiles([`./commands/4 DevOnly/pfps/Greeny_Boi.png`])
            .setThumbnail(`attachment://Greeny_Boi.png`)
            .setFooter('For more facts, use *fact again!')
        );
    },
};

/**@param {Message} message*/
function PermissionCheck(message) {
    if (message.channel.type == 'dm')
        return `Permission Granted`;

    const PermArr = ["SEND_MESSAGES", "EMBED_LINKS"],
        PermArrMsg = ["send messages", "send embed links"];
    for (var x = 0; x < PermArr.length; x++)
        if (!message.channel.permissionsFor(message.guild.me).has(PermArr[x]))
            return `Hey! I don't have permission to ${PermArrMsg[x]} in #${message.channel.name}!`;
    return `Permission Granted`;
}