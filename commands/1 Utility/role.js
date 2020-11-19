const { Message } = require('discord.js');
const { PinguSupport } = require('../../PinguPackage');

module.exports = {
    name: 'role',
    cooldown: 5,
    description: 'Gives a role to author or mentioned',
    usage: '<add | remove | create | delete> <role | role ID | role name> [user]',
    id: 1,
    example: ["add Admin", "remove SMod DiaGuy"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        if (!message.channel.permissionsFor(message.client.user).has('MANAGE_ROLES'))
            return message.author.send(`I don't permission to **manage roles**!`).then(() => message.delete());
        else if (!message.channel.permissionsFor(message.author).has('MANAGE_ROLES') && message.author.id != '245572699894710272')
            return message.channel.send(`You do not have permission to **manage roles**, so I will not do this for you.`)

        var role = getRole(message);
        var person = message.mentions.members.first() || message.guild.member(message.author);
        var command = args.shift();

        if (['give', 'add'].includes(command)) {
            message.guild.member(person).roles.add(role)
                .then(() => {
                    var messagePerson = person.user == message.author ? "you" : person.displayName;
                    return message.channel.send(`I have given ${messagePerson} ${role.name}.`);
                })
                .catch(err => {
                    PinguSupport.errorLog(message.client, `Unable to give author a role: ${err}`)
                    message.author.send(`I was unable to give you ${name}!`);
                })
        }
        else if (['remove', 'take'].includes(command)) {
            message.guild.member(person).roles.remove(role)
                .then(() => {
                    var messagePerson = person.user == message.author ? "you" : person.displayName;
                    return message.channel.send(`I have removed ${role.name} from ${messagePerson}.`);
                })
                .catch(err => {
                    PinguSupport.errorLog(message.client, `Unable to remove role: ${err}`)
                    message.author.send(`I was unable to remove ${name}!`);
                    message.author.send()
                });
        }
        else if (command == 'create') {
            var argString = args.join(' ');
            var name = argString.split('"')[0];
            message.guild.roles.create({ data: { name: name } })
                .then(role => message.channel.send(`${role.name} was created.`))
                .catch(err => {
                    PinguSupport.errorLog(message.client, `Unable to create role: ${err}`)
                    message.author.send(`I was unable to create ${name}!`);
                });
        }
        else if (command == 'delete') {
            if (!role) return message.channel.send(`I wasn't able to find that role!`);
            message.guild.rolesw.cache.delete(role)
            return message.channel.send(`Deleted ${role.name}.`);
        }
    }
}
/**@param {Message} message*/
function getRole(message) {
    return message.guild.roles.cache.find(r => r.id == message.mentions.roles.first() ||
        message.content.includes(r.name) ||
        message.content.includes(r.id)
    );
}
