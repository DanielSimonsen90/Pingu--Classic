const { Client, DMChannel, GuildChannel, MessageEmbed, PermissionOverwrites, Collection } = require("discord.js");
const { PinguEvents } = require("../../PinguPackage");

module.exports = {
    name: 'events: channelUpdate',
    /**@param {{preChannel: DMChannel | GuildChannel, channel: DMChannel | GuildChannel}}*/
    setContent({ preChannel, channel }) {
        return module.exports.content = new MessageEmbed().setDescription(GetDescription(channel.type));

        function GetDescription(type) {
            return type == 'dm' ? PinguEvents.UnknownUpdate(preChannel, channel) : GetGuildChannel(preChannel, channel);
            
            /**@param {GuildChannel} preGC
             * @param {GuildChannel} gC*/
            function GetGuildChannel(preGC, gC) {
                if (gC.name != preGC.name) return PinguEvents.SetDescriptionValues('Name', preGC.name, gC.name);
                else if (gC.parent != preGC.parent) return PinguEvents.SetDescriptionValues('Parent', preGC.parent, gC.parent);
                else if (gC.permissionOverwrites != preGC.permissionOverwrites) return GetPermissionChange(preGC.permissionOverwrites, gC.permissionOverwrites);
                else if (gC.position != preGC.position) return PinguEvents.SetDescriptionValues('Position', preGC.position, gC.position);
                else if (gC.type != preGC.type) return PinguEvents.SetDescriptionValues('Type', preGC.type, gC.type);

                return PinguEvents.UnknownUpdate(preGC, gC);

                /**@param {Collection<string, PermissionOverwrites>} prePerms
                 * @param {Collection<string, PermissionOverwrites>} perms*/
                function GetPermissionChange(prePerms, perms) {
                    let updateMessage = `[**Permission**]: `;

                    for (let permission of perms.array()) {
                        let oldPerm = prePerms.find(p => p.id == permission.id);

                        if (permission.allow) {
                            for (let allow of permission.allow.toArray()) {
                                let oldAllows = oldPerm.allow.toArray().find(a => a == allow);
                                if (!oldAllows) return updateMessage += `Allowed ${allow} for ${permission.type}`;
                            }
                        }
                        if (permission.deny) {
                            for (let deny of permission.deny.toArray()) {
                                let oldDenys = oldPerm.deny.toArray().find(d => d == deny);
                                if (!oldDenys) return updateMessage += `Denied ${deny} for ${permission.type}`;
                            }
                        }
                    }
                    return updateMessage += `Unable to find out what changed!`;
                }
            }
        }
    },
    /**@param {Client} client
     * @param {{preChannel: DMChannel | GuildChannel, channel: DMChannel | GuildChannel}}*/
    execute(client, { preChannel, channel }) {

    }
}