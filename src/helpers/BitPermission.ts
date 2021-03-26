import { PermissionString } from 'discord.js';

export class BitPermission {
    constructor(permString: PermissionString | string, bit: number) {
        this.permString = permString;
        this.bit = bit;
    }
    public permString: PermissionString | string
    public bit: number
}