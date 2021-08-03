const { Role, GuildMember } = require('discord.js');
const { PinguCommand } = require('PinguPackage');

module.exports = new PinguCommand('role', 'Utility', 'Gives a role to author or mentioned', {
    usage: '<add | remove | create | delete | rename> <role | role ID | role name> [user]',
    guildOnly: true,
    example: ["add Admin", "remove SMod @DiaGuy", "rename 778022131178405918 Discord Bot Developer"],
    permissions: ['MANAGE_ROLES']
}, async ({ client, message, args }) => {
    var command = args.shift(),
        role = await getRole(),
        person = message.mentions.members.first() || message.member;
    const reason = `Requested by: ${message.author.tag}`;

    try {
        switch (command) {
            case 'give': case 'add': return AddRole();
            case 'remove': case 'take': return RemoveRole();
            case 'create': return CreateRole();
            case 'delete': return DeleteRole();
            case 'rename': return RenameRole();
            case 'color': return ColorRole();
            case 'set': case 'setpermission': return SetPermission();
            case 'unset': case 'removepermission': return RemovePermission();
            case 'check': case 'has': return CheckPermission(role || person);
            default: return client.log('error', `Ran default case in *role`, message.content, null, {
                params: { message, args },
                additional: { command, person, role }
            }); 
        }
    }
    catch (err) {
        client.log('error', `${client.DefaultPrefix}role command error`, message.content, err, {
            params: { message, args },
            additional: { command, person, role }
        }).then(() => message.channel.send("I encountered an error when checking! I've contacted my developers."));
    }

    async function getRole() {
        let roleMention = args.mentions.get('ROLE');
        let role = message.mentions.roles.first();
        if (roleMention.value) {
            args.splice(roleMention.index);
            return role;
        }

        let snowflakeMention = args.mentions.get('SNOWFLAKE');
        if (snowflakeMention.value) {
            return message.guild.roles.fetch(args.splice(snowflakeMention.index, 1));
        }

        const roleNames = message.guild.roles.cache.map(r => r.name.toLowerCase());
        const roleNameIndex = args.findIndex(arg => roleNames.includes(arg.toLowerCase()));
        if (roleNameIndex == -1) return undefined;

        const roleName = args.splice(roleNameIndex, 1);
        return message.guild.roles.cache.find(r => r.name == roleName);
    }

    async function AddRole() {
        try {
            await person.roles.add(role, reason);
            var messagePerson = person.user == message.author ? "you" : person.displayName;
            return message.channel.send(`I have given ${messagePerson} ${role.name}.`);
        } catch (err) {
            client.log('error', `Unable to give ${person} a role`, message.content, err, { params: { message, role, person } });
            return message.author.send(`I was unable to give ${person} **${role.name}**!`);
        }
    }
    async function RemoveRole() {
        try {
            await person.roles.remove(role, reason);
            var messagePerson = person.user == message.author ? "you" : person.displayName;
            return message.channel.send(`I have removed ${role.name} from ${messagePerson}.`);
        } catch (err) {
            client.log('error', `Unable to remove role from ${person}`, message.content, err, { params: { message, role, person } });
            return message.author.send(`I was unable to remove **${role.name}** from ${person}!`);
        }
    }
    async function CreateRole() {
        const arguments = args.join(' ');
        const name = arguments.split('"')[0];

        try {
            await message.guild.roles.create({ data: { name }, reason });
            return message.channel.send(`**${name}** was created.`);
        } catch (err) {
            client.log('error', `Unable to create role`, message.content, err, {
                params: { message, args },
                additional: { arguments, name }
            });
            return message.author.send(`I was unable to create **${name}**!`)
        }
    }
    async function DeleteRole() {
        if (!role) return message.channel.send(`I wasn't able to find that role!`);
        try {
            await role.delete(reason);
            return message.channel.send(`Deleted **${role.name}**.`)
        } catch (err) {
            client.log('error', `Unable to delete role`, message.content, err, { params: { message, role } });
            message.author.send(`I was unable to delete **${role.name}**!`)            
        }
    }
    async function RenameRole() {
        const newName = args.splice(1).join(' ').replace(/"/, ' ');
        const oldName = role.name;
        
        try {
            await role.setName(newName, reason);
            return message.channel.send(`Successfully renamed **${oldName}** to **${newName}**!`)
        } catch (err) {
            client.log('error', `Unable to rename role`, message.content, err, { params: { message, role }, additional: { newName, oldName } });
            return message.author.send(`I was unable to rename **${oldName}** to **${newName}**!`);
        }
    }
    async function ColorRole() {
        const oldColor = role.hexColor;

        try {
            await role.setColor(args.length == 1 ? args.first : args.length == 3 ? args.map(a => parseInt(a)) : null, reason);
            return message.channel.send(`Recolored **${role.name}** from \`${oldColor}\` to \`${role.hexColor}\`.`);
        } catch (err) {
            client.log('error', `Unable to recolor role`, message.content, err, { params: { message, role, args }, additional: { oldColor } });
            return message.author.send(`I was unable to recolor **${oldColor}** with your arguments! Please make sure you're using RGB values seperated by space, or a HEX value!`);
        }
    }
    async function SetPermission() {
        const permission = args.join('_').toUpperCase();

        if (role.permissions.has(permission)) return message.channel.send(`**${role.name}** already has the **${permission}** permission!`);
        else if (!message.guild.me.hasPermission(permission)) return message.channel.send(`I can't set **${permission}** for **${role.name}**, because I don't have that permission myself!`);

        try {
            await role.setPermissions(role.permissions.a(permission), reason);
            return message.channel.send(`Gave **${role.name}** the **${permission}** permission.`)
        } catch (err) {
            if (err.message == 'Missing Permissions') return message.channel.send(`Please move my role **above** **${role.name}**, so I can set the **${permission}** permission!`);

            client.log('error', `Unable to set ${permission} to role`, message.content, err, {
                params: { message, args, role },
                additional: { permission }
            });
            return message.author.send(`I was unable to give **${role.name}** the **${permission}** permission!`);
        }
    }
    async function RemovePermission() {
        const permission = args.join('_').toUpperCase();

        if (!role.permissions.has(permission)) return message.channel.send(`**${role.name}** does not have the **${permission}** permission.`);
        else if (!message.guild.me.hasPermission(permission)) return message.channel.send(`I can't take **${permission}** from **${role.name}**, as I don't have that permission myself!`);

        const newPermissions = role.permissions.remove(permission);

        try {
            await role.setPermissions(newPermissions, reason);
            return message.channel.send(`Removed **${permission}** from **${role.name}**.`);
        } catch (err) {
            client.log('error', `Unable to remove **${permission}** from role`, message.content, err, {
                params: { message, args, role },
                additional: { newPermissions, permission }
            });
            return message.author.send(`I was unable to remove **${permission}** from **${role.name}**!`);
        }
    }
    /**@param {GuildMember | Role} personOrRole*/
    function CheckPermission(personOrRole) {
        const permission = args.join('_').toUpperCase();
        const hasPermission = personOrRole.permissions.has(permission);
        return message.channel.send(`${personOrRole.displayName || personOrRole.name} **${hasPermission ? `does` : `does not`}** have the **${permission}** permission.`);
    }
});

