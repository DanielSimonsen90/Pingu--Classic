import { Guild, GuildChannel, PermissionString, User } from 'discord.js';
import BitPermission from '../helpers/BitPermission';
import BasePinguClient from './client/BasePinguClient';
interface PermissionCheck {
    author: User;
    channel: GuildChannel;
}
export declare class PermissionsManager {
    constructor(client: BasePinguClient<any>, given: PermissionString[]);
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
