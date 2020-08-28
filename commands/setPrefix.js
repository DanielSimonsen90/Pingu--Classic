const mysql = require('mysql');
const { Message } = require('discord.js');

module.exports = {
    name: 'setprefix',
    description: 'set the prefix of server',
    usage: '<new prefix>',
    id: 4,
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        return message.channel.send(`This doesn't work`);

        var GuildCon = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "1234",
            database: "PinguGuilds"
        });

        GuildCon.query(`SELECT * FROM GuildPrefix WHERE id = '${message.guild.id}'`, (err, rows) => {

            if (err) throw err;
            if (rows[0]) return console.log(`Prefix in ${message.guild.name} has been changed to ${args[0]}`);

            let sql, Prefix;

            if (!rows[0]) {
                Prefix = '*';
                sql = `INSERT INTO GuildPrefix (id, Prefix, GuildName) VALUES ('${message.guild.id}', '*', ${message.guild.name})`;
            } else {
                Prefix = rows[0].Prefix;
                sql = `UPDATE GuildPrefix SET Prefix = ${Prefix === args[0]} WHERE id = ${message.guild.id}`;
            }
            GuildCon.query(sql, console.log)
            message.channel.send(`Prefix has been changed to **${args[0]}**!`)
        })
    },
};