const { PinguCommand, PinguLibrary } = require('PinguPackage');
const fs = require('fs');

module.exports = new PinguCommand('clearerrors', 'DevOnly', `Clears all errors in folder`, {
    
}, async ({ client, message, args, pAuthor, pGuild, pGuildClient }) => {
    const errorPath = '../../../errors';

    const errorFolder = fs.readdirSync(errorPath);
    if (!errorFolder) return message.channel.send(`Error folder not found!`);

    const files = errorFolder.filter(file => file.endsWith('.json'));
    const { length } = files;

    if (!args[0] || args[0].toLowerCase() != 'clear') return message.channel.send(`There are ${length} errors in folder`);

    if (args[0] == 'show') {
        let errorId = args[1];
        if (!errorId) return (await message.channel.send(`If I need to show you an error, I need to know which error you want. Length is ${length}.`))
            .channel.createMessageCollector(msg => msg.author.id == message.author.id, { max: 1, time: 5000 })
            .on('collect', messages => {
                let m = messages.first();
                
                if (isNaN(m.content))
                    return message.channel.send(`Invalid error number!`);

                errorId = parseInt(m.content);

            });
        else if (isNaN(errorId) || errorId > length || errorId < 0) return message.channel.send(`Please provide a proper number!`)

        let error = files.find(file => file.includes(errorId));

        if (!error) return message.channel.send(`I couldn't find that error!`);
    }

    files.forEach(file => fs.unlink(`${errorPath}/${file}`));

    return message.channel.send(`Deleted ${length} errors.`);
})