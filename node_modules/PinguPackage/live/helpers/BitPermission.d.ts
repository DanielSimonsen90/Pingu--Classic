import { PermissionString } from 'discord.js';
export declare class BitPermission {
    constructor(permString: PermissionString | string, bit: number);
    permString: PermissionString | string;
    bit: number;
}
export default BitPermission;
