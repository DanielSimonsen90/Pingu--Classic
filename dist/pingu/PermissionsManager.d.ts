import { Guild, GuildChannel, GuildMember, PermissionString, User } from 'discord.js';
import BitPermission from '../helpers/BitPermission';
import PinguClientBase from './client/PinguClientBase';
interface PermissionCheck {
    member?: GuildMember;
    channel?: GuildChannel;
    user?: User;
}
export declare class PermissionsManager {
    constructor(client: PinguClientBase<any>, given: PermissionString[]);
    private _client;
    readonly PermissionGranted = "Permission Granted";
    given: PermissionString[];
    granted: BitPermission[];
    missing: BitPermission[];
    all: BitPermission[];
    guild(guild?: Guild): {
        granted: BitPermission[];
        missing: BitPermission[];
    };
    checkFor(check: PermissionCheck, ...permissions: PermissionString[]): string;
}
export default PermissionsManager;