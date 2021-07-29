const { Message, MessageAttachment } = require('discord.js');
const { PinguCommand } = require('PinguPackage');
const fs = require('fs');
const ms = require('ms');

module.exports = new PinguCommand('clearerrors', 'DevOnly', `Clears all errors in folder`, {
    
}, async ({ message, args }) => {
    const errorPath = '../../../errors';

    const errorFolder = fs.readdirSync(errorPath);
    if (!errorFolder) return message.channel.send(`Error folder not found!`);

    const files = errorFolder.filter(file => file.endsWith('.json'));
    const { length } = files;

    if (!args[0] || args[0].toLowerCase() != 'clear') return message.channel.send(`There are ${length} errors in folder`);

    if (args[0] == 'show') {
        let errorId = args[1];

        if (!errorId) 
            errorId = await createMessageCollector(
                message.channel.send(`If I need to show you an error, I need to know which error you want. Length is ${length}.`)
            );
        else if (isNaN(errorId) || errorId > length || errorId < 0) 
            errorId = await createMessageCollector(
                message.channel.send(`Please provide a proper number!`)
            );

        //If not parsable, "You didn't reply in time!" recieved.
        if (isNaN(errorId)) return message.channel.send(errorId);

        let error = files.find(file => file.includes(errorId));

        return error ? 
            message.channel.send(`Error #${errorId}`, new MessageAttachment(`${errorPath}/${error}`, error)) :
            message.channel.send(`I couldn't find that error!`);

    }

    files.forEach(file => fs.unlink(`${errorPath}/${file}`));

    return message.channel.send(`Deleted ${length} errors.`);

    /**@param {Promise<Message>} promise
     * @returns {Promise<string>}*/
    async function createMessageCollector(promise) {
        const sent = await promise;
        const filter = m => m.author.id == message.author.id;
        const collector = sent.channel.createMessageCollector(filter, { time: ms('10s') });

        /**@param {string} response */
        function invalid(response) {
            collector.resetTimer();
            return message.channel.send(response);
        }

        return new Promise((resolve, reject) => {
            collector.on('collect', m => {

                if (isNaN(m.content)) return invalid(`Invalid error number!`);

                let errorId = parseInt(m.content);

                if (errorId > length || errorId < 0) return invalid(`Please provide a proper number! The length is ${length}.`);

                resolve(m.content);
            }).on('end', () => reject(`You didn't reply in time!`))
        })
            
    }
})