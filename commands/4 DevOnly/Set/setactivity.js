const { PinguCommand } = require("PinguPackage");
const { Presence } = require('discord.js')

module.exports = new PinguCommand('setactivity', 'DevOnly', "Make me do something else than listening to people's screams", {
    usage: '<status type> <status message>',
    examples: ["listening my jam"]
}, async ({ client, message, args }) => {
    return message.channel.send(await (async () => {
        /**@param {Promise<Presence>} promise */
        const response = async (promise) => {
            const presense = await promise;
            const { type, name } = presense.activities[0];
            return `Updated activity to ${type} ${name}.`;
        };

        if (!args[0] || !args[1]) return response(client.setActivity());
        
        const activityTypes = ['PLAYING', 'WATCHING', 'LISTENING', 'COMPETING'];
        const type = args.shift().toUpperCase();
        if (!activityTypes.includes(type)) return `Activity type not recognized! Please choose: ${activityTypes.join(' | ')}`;
        
        const name = args.join(' ');
        return response(client.setActivity({ name: `${name} ${client.DefaultPrefix}help`, type }));
    })());
});