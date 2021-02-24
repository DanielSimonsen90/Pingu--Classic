const { GuildChannel, MessageEmbed, PermissionOverwrites, Collection } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('channelUpdate',
    async function setContent(preChannel, channel) {
        let description = GetDescription(channel.type);

        return module.exports.content = description ? new MessageEmbed().setDescription(description) : null;

        function GetDescription(type) {
            return type == 'dm' ? PinguEvent.UnknownUpdate(preChannel, channel) : GetGuildChannel(preChannel, channel);

            /**@param {GuildChannel} preGC
             * @param {GuildChannel} gC*/
            function GetGuildChannel(preGC, gC) {
                if (gC.name != preGC.name) return PinguEvent.SetDescriptionValues('Name', preGC.name, gC.name);
                else if (gC.parent != preGC.parent) return PinguEvent.SetRemove(
                    'Parent',
                    `${preGC.parent}`,
                    `${gC.parent}`,
                    `Set ${gC.parent} as Category`,
                    `Removed ${preGC.parent} as Category`,
                    PinguEvent.SetDescriptionValues
                );
                else if (gC.permissionOverwrites != preGC.permissionOverwrites) return GetPermissionChange(preGC.permissionOverwrites, gC.permissionOverwrites);
                else if (gC.position != preGC.position) return PinguEvent.SetDescriptionValues('Position', preGC.position, gC.position);
                else if (gC.type != preGC.type) return PinguEvent.SetDescriptionValues('Type', preGC.type, gC.type);

                return PinguEvent.UnknownUpdate(preGC, gC);

                /**@param {Collection<string, PermissionOverwrites>} prePerms
                 * @param {Collection<string, PermissionOverwrites>} perms*/
                function GetPermissionChange(prePerms, perms) {
                    let updateMessage = `[**Permission**]: `;

                    for (let permission of perms.array()) {
                        let oldPerm = prePerms.find(p => p.id == permission.id);

                        if (permission.allow) {
                            for (let allow of permission.allow.toArray()) {
                                let oldAllows = oldPerm && oldPerm.allow.toArray().find(a => a == allow);
                                if (!oldAllows) return updateMessage += `Allowed ${allow} for ${permission.type}`;
                            }
                        }
                        if (permission.deny) {
                            for (let deny of permission.deny.toArray()) {
                                let oldDenys = oldPerm && oldPerm.deny.toArray().find(d => d == deny);
                                if (!oldDenys) return updateMessage += `Denied ${deny} for ${permission.type}`;
                            }
                        }
                    }
                    return updateMessage += `Unable to find out what changed!`;
                }
            }
        }
    }
);