import { Guild, GuildChannel, GuildMember, PermissionString, ThreadChannel, User } from 'discord.js'
import DiscordPermissions from '../helpers/DiscordPermissions';
import BitPermission from '../helpers/BitPermission';
import PinguClientBase from './client/PinguClientBase';

interface PermissionCheck {
    member?: GuildMember,
    channel?: GuildChannel,
    user?: User
}

export class PermissionsManager {
    constructor(client: PinguClientBase<any>, given: PermissionString[]) {
        this.given = given;
        this._client = client;
        this.all = Object.keys(DiscordPermissions)
            .map(permString => new BitPermission(permString as PermissionString, 0))
            .map(({ permString }, i, arr) =>  new BitPermission(permString, i == 0 ? 1 : arr[i - 1].bit * 2))
        const { granted, missing } = this.guild();
        this.granted = granted;
        this.missing = missing;
    }

    private _client: PinguClientBase<any>

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
        const checkPermission = (
            channel: GuildChannel | ThreadChannel, 
            user: User, 
            permission: PermissionString
        ) => channel.permissionsFor(user).has(permission);
        const { isPinguDev } = this._client.developers;
        const { testingMode } = this._client.config;

        for (const permission of permissions) {
            const permString = permission.toLowerCase().replace(/_+/, ' ');

            const { member, channel } = check;
            const user = member.user || check.user;

            if (!channel && !member) {
                throw new Error('Invalid PermissionCheck params. channel & member are undefined');
            }

            if (!channel && member) {
                if (!member.permissions.has(permission)) return `You don't have permission to **${permString}**!`;
                continue;
            } 
            
            if (!checkPermission(channel, user, permission)) return `I don't have permission to **${permString}** in ${channel}!`;
            else if (!checkPermission(channel, user, permission) && 
                (isPinguDev(user) && testingMode || !isPinguDev(user)))
                return `You don't have permission to **${permString}** in ${channel}!`
        }

        return this.PermissionGranted;
    }
}

export default PermissionsManager