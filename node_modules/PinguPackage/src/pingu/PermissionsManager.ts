import { Guild, GuildChannel, PermissionString, Snowflake, User } from 'discord.js'
import DiscordPermissions from '../helpers/DiscordPermissions';
import BitPermission from '../helpers/BitPermission';
import PinguClientShell from './client/PinguClientShell';

interface PermissionCheck {
    author: User,
    channel: GuildChannel
}

export class PermissionsManager {
    constructor(client: PinguClientShell, given: PermissionString[]) {
        this.given = given;
        this._client = client;
        this.all = Object.keys(DiscordPermissions)
            .map(permString => new BitPermission(permString as PermissionString, 0))
            .map(({ permString }, i, arr) =>  new BitPermission(permString, i == 0 ? 1 : arr[i - 1].bit * 2))
        const { granted, missing } = this.guild();
        this.granted = granted;
        this.missing = missing;
    }

    private _client: PinguClientShell

    public readonly PermissionGranted = 'Permission Granted';

    public given: PermissionString[]
    public granted: BitPermission[]
    public missing: BitPermission[]
    public all: BitPermission[]

    public guild(guild?: Guild) {
        const granted = new Array<BitPermission>();
        const missing = new Array<BitPermission>();

        this.all.forEach(permission => (
            this.given.includes(permission.permString) && 
            (!guild || guild.me.permissions.has(permission.permString)) ? 
            granted : missing
        ).push(permission))

        return { granted, missing };
    }
    public checkFor(check: PermissionCheck, ...permissions: PermissionString[]) {
        const checkPermission = (channel: GuildChannel, user: User, permission: PermissionString) => channel.permissionsFor(user).has(permission);
        const { isPinguDev } = this._client.developers;
        const { testingMode } = this._client.config;

        for (const permission of permissions) {
            const permString = permission.toLowerCase().replace(/_+/, ' ');

            const { author, channel } = check;
            
            if (!checkPermission(channel, author, permission)) return `I don't have permission to **${permString}** in ${channel}!`;
            else if (!checkPermission(channel, author, permission) && 
                    (isPinguDev(author) && testingMode || !isPinguDev(author)))
                return `You don't have permission to **${permString}** in ${channel}!`
        }

        return this.PermissionGranted;
    }
}

export default PermissionsManager