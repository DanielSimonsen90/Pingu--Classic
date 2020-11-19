const { Message, Permissions } = require('discord.js');
const { PinguLibrary } = require('../../PinguPackage');

module.exports = {
    name: 'role',
    cooldown: 5,
    description: 'Gives a role to author or mentioned',
    usage: '<add | remove | create | delete> <role | role ID | role name> [user]',
    id: 1,
    example: ["add Admin", "remove SMod DiaGuy"],
    /**@param {Message} message @param {string[]} args*/
    execute(message, args) {
        var permCheck = PinguLibrary.PermissionCheck(message, [Permissions.FLAGS.MANAGE_ROLES]);
        if (permCheck != PinguLibrary.PermissionGranted) {
            //if (!permCheck.includes("you") || !PinguLibrary.isPinguDev(message.author)) //Uncomment to abuse Pingu's Manage Roles permission
                return permCheck;
        }

        var role = getRole(message),
            person = message.mentions.members.first() || message.guild.member(message.author),
            command = args.shift();

        if (['give', 'add'].includes(command)) {
            message.guild.member(person).roles.add(role)
                .then(() => {
                    var messagePerson = person.user == message.author ? "you" : person.displayName;
                    return message.channel.send(`I have given ${messagePerson} ${role.name}.`);
                })
                .catch(err => {
                    PinguLibrary.errorLog(message.client, `Unable to give author a role: ${err}`);
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
                    PinguLibrary.errorLog(message.client, `Unable to remove role: ${err}`)
                    message.author.send(`I was unable to remove ${name}!`);
                });
        }
        else if (command == 'create') {
            var argString = args.join(' ');
            var name = argString.split('"')[0];
            message.guild.roles.create({ data: { name: name } })
                .then(role => message.channel.send(`${role.name} was created.`))
                .catch(err => {
                    PinguLibrary.errorLog(message.client, `Unable to create role: ${err}`)
                    message.author.send(`I was unable to create ${name}!`);
                });
        }
        else if (command == 'delete') {
            if (!role) return message.channel.send(`I wasn't able to find that role!`);
            message.guild.roles.cache.delete(role);
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
