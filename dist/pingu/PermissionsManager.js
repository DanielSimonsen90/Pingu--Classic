"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsManager = void 0;
const DiscordPermissions_1 = require("../helpers/DiscordPermissions");
const BitPermission_1 = require("../helpers/BitPermission");
class PermissionsManager {
    constructor(client, given) {
        this.given = given;
        this._client = client;
        this.all = Object.keys(DiscordPermissions_1.default)
            .map(permString => new BitPermission_1.default(permString, 0))
            .map(({ permString }, i, arr) => new BitPermission_1.default(permString, i == 0 ? 1 : arr[i - 1].bit * 2));
        const { granted, missing } = this.guild();
        this.granted = granted;
        this.missing = missing;
    }
    _client;
    PermissionGranted = 'Permission Granted';
    given;
    granted;
    missing;
    all;
    guild(guild) {
        const granted = new Array();
        const missing = new Array();
        this.all.forEach(permission => (this.given.includes(permission.permString) &&
            (!guild || guild.me.permissions.has(permission.permString)) ?
            granted : missing).push(permission));
        return { granted, missing };
    }
    checkFor(check, ...permissions) {
        const checkPermission = (channel, member, permission) => channel.permissionsFor(member.user).has(permission);
        const { isPinguDev } = this._client.developers;
        const { testingMode } = this._client.config;
        for (const permission of permissions) {
            const permString = permission.toLowerCase().replace(/_+/, ' ');
            const { member, channel } = check;
            if (!channel) {
                if (!member.permissions.has(permission))
                    return `You don't have permission to **${permString}**!`;
                continue;
            }
            if (!checkPermission(channel, member, permission))
                return `I don't have permission to **${permString}** in ${channel}!`;
            else if (!checkPermission(channel, member, permission) &&
                (isPinguDev(member.user) && testingMode || !isPinguDev(member.user)))
                return `You don't have permission to **${permString}** in ${channel}!`;
        }
        return this.PermissionGranted;
    }
}
exports.PermissionsManager = PermissionsManager;
exports.default = PermissionsManager;
