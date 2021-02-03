const { Message, MessageEmbed, Client } = require("discord.js");
const { PinguGuild, PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'updatepguilds',
    description: 'Updates PinguGuilds to /servers/ with new stuff from PinguPackage.ts',
    usage: '<guild name | guild id | show>',
    example: [`Pingu Support`, '460926327269359626', 'show'],
    id: 4,
    /**@param {{message: Message, args: string[]}}*/
    async execute({ message, args }) {
        const BotGuilds = message.client.guilds.cache.array().sort((a, b) => a.name > b.name ? 1 : -1);
        let arg = args.join(' ').toLowerCase();

        let PinguGuildsArr = [];
        for (var i = 0; i < BotGuilds.length; i++) {
            let owner = !BotGuilds[i].owner ? BotGuilds[i].member(await BotGuilds[i].members.fetch(BotGuilds[i].ownerID)) : BotGuilds[i].owner;
            PinguGuildsArr[i] = new PinguGuild(BotGuilds[i], owner);

            if (arg == "show")
                await message.channel.send(new MessageEmbed()
                    .setTitle(PinguGuildsArr[i].name)
                    .setColor((PinguGuildsArr[i].clients[0] || PinguGuildsArr[i].clients[1]) &&
                        (PinguGuildsArr[i].clients[0].embedColor || PinguGuildsArr[i].clients[1].embedColor))
                    .setThumbnail(BotGuilds[i].iconURL())
                    .setDescription(`ID: ${PinguGuildsArr[i]._id}`)
                    .setFooter(`Owner: ${PinguGuildsArr[i].guildOwner.user} | ${PinguGuildsArr[i].guildOwner._id}`)
                    .addField('Prefix', (PinguGuildsArr[i].clients[0] || PinguGuildsArr[i].clients[1]) &&
                        (PinguGuildsArr[i].clients[0].prefix || PinguGuildsArr[i].clients[1].prefix)));
            if (arg && arg != "show" && ![PinguGuildsArr[i].name.toLowerCase(), PinguGuildsArr[i]._id].includes(arg)) continue;

            try {
                if (!await PinguGuild.GetPGuild(BotGuilds[i]))
                    await PinguGuild.WritePGuild(message.client, BotGuilds[i], this.name,
                        `Successfully created PinguGuild for **${BotGuilds[i].name}**`,
                        `Failed creating PinguGuild for **${BotGuilds[i].name}**`
                    );
            } catch (err) { PinguLibrary.errorLog(message.client, 'Adding to PinguGuilds failed', message.content, err); }
        }

        if (message.content.includes('updatepguilds'))
            message.react('✅');
        //PinguLibrary.pGuildLog(message.client, module.exports.name, 'Going through servers complete!');
    }
}

/**@param {Client} client
 * @param {PinguGuild} pGuild
 * @param {PinguGuild} emptyPGuild*/
async function Update(client, pGuild, emptyPGuild) {
    let updated = AddedOrRemovedProperty(
        Object.assign({}, pGuild.toObject()),
        Object.assign({}, emptyPGuild.toObject())
    );
    console.log(updated);
    return await PinguGuild.UpdatePGuild(client, updated, pGuild, module.exports.name,
        `Successfully updated **${pGuild.name}**`,
        `Failed to update **${pGuild.name}**`,
    );

    /**@param {any} current
     * @param {any} empty*/
    function AddedOrRemovedProperty(current, empty) {
        let updated = {};
        try {
            var currentProps = Object.keys(current);
            var emptyProps = Object.keys(empty);
        }
        catch {
            return empty;
        }

        for (let prop of currentProps) {
            if (!emptyProps.includes(prop))
                updated[prop] = undefined;
        } //Removed
        for (let prop of emptyProps) {
            if (!currentProps.includes(prop))
                updated[prop] = emptyPGuild[prop];
        } //Added
        //Check sub properties on empty pGuild (new property was added) then replace default data with saved data from current pGuild (keep data that was saved before updating)
        updated = CheckSubProperties(current, current, CheckSubProperties(current, empty, updated)); //Check sub-properties
        return updated;

        function CheckSubProperties(current, obj, updated) {
            //For each property in object
            for (let prop in obj) {
                //Set updated object's property to be equal to next statement:
                //If property exists in current pGuild, check if property is object
                //  If property is object, run through AddedOrRemoved, to check property's sub-properties
                //  else save updated[prop] = current[prop] (treat as normal type; string, number, boolean)
                //else treat as new property in pGuild object
                updated[prop] = current[prop] ?
                    (typeof current[prop] === 'object' ?
                        AddedOrRemovedProperty(current[prop], obj[prop]) :
                        current[prop]) :
                    obj[prop];
            }
            //Return final object
            return updated;
        }
    }
}