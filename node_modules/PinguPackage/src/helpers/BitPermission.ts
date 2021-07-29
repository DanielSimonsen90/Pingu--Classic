import { PermissionString } from 'discord.js';

export class BitPermission {
    constructor(permString: PermissionString, bit: number) {
        this.permString = permString;
        this.bit = bit;
    }
    public permString: PermissionString
    public bit: number
}

export default BitPermission;