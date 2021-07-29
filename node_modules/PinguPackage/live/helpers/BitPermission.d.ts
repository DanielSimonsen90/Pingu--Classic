import { PermissionString } from 'discord.js';
export declare class BitPermission {
    constructor(permString: PermissionString, bit: number);
    permString: PermissionString;
    bit: number;
}
export default BitPermission;
