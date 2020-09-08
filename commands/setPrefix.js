const //mongoose = require('mongoose'),
    //{ mongoPass } = require('../config.json'),
    { Message } = require('discord.js');

//mongoose.connect(mongoPass, {
//    useNewUrlParser: true,
//    useUnifiedTopology: true
//});

//const GuildData = require('../models/data.js');
module.exports = {
    name: 'setprefix',
    description: 'set the prefix of server',
    usage: '<new prefix>',
    id: 4,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        return message.channel.send(`This doesn't work`);
        //GuildData.findOne({
        //    guildID: message.guild.id
        //}, (err, data) => {
        //        if (err) console.log(err);
        //        if (!data) {
        //            const newData = new GuildData({
        //                name: message.guild.name,
        //                guildID: message.guild.id,
        //                prefix: args[0]
        //            });
        //            newData.save().catch(err => console.log(err));
        //        }
        //        else data.prefix = args[0];
        //        return message.channel.send(`Prefix has been changed to **${args[0]}**!`);

        //})


        //Source: https://www.youtube.com/watch?v=M6QPcuGmGNw&t=715s
        //MongooseDB: https://cloud.mongodb.com/v2/5f57d37c523b020a20b98f86#clusters/connect?clusterId=PinguData

        message.channel.send(`Prefix has been changed to **${args[0]}**!`)
    },
};