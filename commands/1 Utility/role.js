const { Message, Permissions, Role, GuildMember } = require('discord.js');
const { PinguLibrary, DiscordPermissions } = require('../../PinguPackage');

module.exports = {
    name: 'role',
    cooldown: 5,
    description: 'Gives a role to author or mentioned',
    usage: '<add | remove | create | delete | rename> <role | role ID | role name> [user]',
    id: 1,
    guildOnly: true,
    example: ["add Admin", "remove SMod DiaGuy", "rename 778022131178405918 Discord Bot Developer"],
    permissions: [DiscordPermissions.SEND_MESSAGES, DiscordPermissions.MANAGE_ROLES],
    /**@param {Message} message @param {string[]} args*/
    async execute(message, args) {
        var command = args.shift(),
            getRoleResult = await getRole(message, args),
            person = message.mentions.members.first() || message.guild.member(message.author);
        var role = getRoleResult.role;
        args = getRoleResult.args;

        try {
            switch (command) {
                case 'give': case 'add': return AddRole(message, role, person);
                case 'remove': case 'take': return RemoveRole(message, role, person);
                case 'create': return CreateRole(message, args);
                case 'delete': return DeleteRole(message, role);
                case 'rename': return RenameRole(message, args, role);
                case 'color': return ColorRole(message, args, role);
                case 'set': case 'setpermission': return SetPermission(message, args, role);
                case 'unset': case 'removepermission': return RemovePermission(message, args, role);
                case 'check': case 'has': return CheckPermission(message, args, (role || person));
                default: PinguLibrary.errorLog(message.client, `Ran default case in *role`, message.content); break;
            }
        }
        catch (err) {
            if (err.message == "Invalid bitfield flag or number.")
                return message.channel.send("That is not a valid permission!");

            PinguLibrary.errorLog(message.client, message, message.content, err).then(() =>
                message.channel.send("I encountered an error when checking! I've contacted my developers."));
        }
    }
}
/**@param {Message} message
 * @param {string[]} args*/
async function getRole(message, args) {
    var role = message.guild.roles.cache.find(r => r.id == message.mentions.roles.first() || message.content.includes(r.id));
    if (role) {
        args.shift();
        return {
            role: await message.guild.roles.fetch(role.id),
            args
        }
    }
    role = message.guild.roles.cache.find(r => message.content.includes(r.name));
    if (role) {
        return {
            role: await message.guild.roles.fetch(role.id),
            args: args.join(' ').replace(role.name, ' ').split(' ')
        };
    }
    return undefined;
}

/**Adds specified role to specified person
 * @param {Message} message
 * @param {Role} role
 * @param {GuildMember} person*/
function AddRole(message, role, person) {
    message.guild.member(person).roles.add(role, `Requested by: ${message.author.username}`)
        .then(() => {
            var messagePerson = person.user == message.author ? "you" : person.displayName;
            return message.channel.send(`I have given ${messagePerson} ${role.name}.`);
        })
        .catch(err => {
            PinguLibrary.errorLog(message.client, `Unable to give ${person} a role`, message.content, err);
            message.author.send(`I was unable to give you ${name}!`);
        })
}
/**Removes specified role from specified person
 * @param {Message} message
 * @param {Role} role
 * @param {GuildMember} person*/
function RemoveRole(message, role, person) {
    message.guild.member(person).roles.remove(role, `Requested by: ${message.author.username}`)
        .then(() => {
            var messagePerson = person.user == message.author ? "you" : person.displayName;
            return message.channel.send(`I have removed ${role.name} from ${messagePerson}.`);
        })
        .catch(err => {
            PinguLibrary.errorLog(message.client, `Unable to remove role from ${person}`, message.content, err)
            message.author.send(`I was unable to remove ${name}!`);
        });
}
/**Creates a new role into guild
 * @param {Message} message
 * @param {string[]} args*/
function CreateRole(message, args) {
    var argString = args.join(' ');
    var name = argString.split('"')[0];
    message.guild.roles.create({ data: { name: name }, reason: `Requested by: ${message.author.username}` })
        .then(role => message.channel.send(`${role.name} was created.`))
        .catch(err => {
            PinguLibrary.errorLog(message.client, `Unable to create role`, message.content, err)
            message.author.send(`I was unable to create ${name}!`);
        });
}
/**Deletes specified role from guild
 * @param {Message} message
 * @param {Role} role*/
function DeleteRole(message, role) {
    if (!role) return message.channel.send(`I wasn't able to find that role!`);
    role.delete(`Requested by: ${message.author.username}`)
        .then(() => message.channel.send(`Deleted ${role.name}.`));
}
/**Renames specified role to new name
 * @param {Message} message
 * @param {string[]} args
 * @param {Role} role*/
function RenameRole(message, args, role) {
    args.shift();
    var newName = args.join(' '), oldName = role.name;
    if (newName.includes('"')) newName = newName.replace('"', ' ');
    role.setName(newName, `Requested by: ${message.author.username}`)
        .then(() => message.channel.send(`Successfully renamed "${oldName}" to "${newName}"`));
}
/**Colors specified role to color mentioned
 * @param {Message} message
 * @param {string[]} args
 * @param {Role} role*/
function ColorRole(message, args, role) {
    var oldColor = role.hexColor;
    role.setColor(args.length == 1 ? args[0] : args.length == 3 ? args.map(i => parseInt(i), `Requested by: ${message.author.username}`) : null)
        .then(() => message.channel.send(`Recolored ${role.name} from \`${oldColor}\` to \`${role.hexColor}\``))
        .catch(err => {
            message.channel.send(`Unable to color ${role.name} to ${args.join(' ')}!`);
            PinguLibrary.errorLog(message.client, `Unable to color role with ${args.join(' ')}!`, message.content, err);
        });
}
/**@param {Message} message
 * @param {string[]} args
 * @param {Role} role*/
function SetPermission(message, args, role) {
    var permission = args.join('_').toUpperCase();
    if (role.permissions.has(permission))
        return message.channel.send(`${role.name} already has the "${permission}" permission!`);
    else if (!message.guild.me.hasPermission(permission))
        return message.channel.send(`I can't set this permission, as I don't even have that permission myself!`);
    role.setPermissions(role.permissions.add(permission), `Requested by: ${message.author.username}`)
        .then(() => message.channel.send(`Permission set!`))
        .catch(err =>
            err.message == 'Missing Permissions' ?
                message.channel.send(`That role is above my highest role!`) :
                PinguLibrary.errorLog(message.client, "Error when setting perm to role", message.content, err)
                    .then(() => message.channel.send(`I encountered an error while setting that permission! I have contacted my developers.`)));
}
/**@param {Message} message
 * @param {string[]} args
 * @param {Role} role*/
async function RemovePermission(message, args, role) {
    var permission = args.join('_').toUpperCase();
    if (!role.permissions.has(permission))
        return message.channel.send(`${role.name} doesn't have the "${permission}" permission!`);
    else if (!message.guild.me.hasPermission(permission))
        return message.channel.send(`I can't remove this permission, as I don't have that permission myself!`);

    var removedPermissions = role.permissions.remove(permission);
    await role.setPermissions(removedPermissions, `Removed ${permission}, requested by ${message.author.username}.`);
    message.channel.send(`"${permission}" was removed from ${role.name}!`);
}
/**@param {Message} message
 * @param {string[]} args
 * @param {GuildMember | Role} personOrRole*/
function CheckPermission(message, args, personOrRole) {
    var permission = args.join('_').toUpperCase();
    var hasPermission = personOrRole.permissions.has(permission);
    return message.channel.send(`${personOrRole.displayName || personOrRole.name} **${hasPermission ? `does` : `does not`}** have the ${permission} permission.`);
}
