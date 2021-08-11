import { User } from 'discord.js';
import { isPinguDev } from '../pingu/collection/DeveloperCollection';

declare module 'discord.js' {
    interface User {
        isPinguDev(): boolean
    }
}

User.prototype.isPinguDev = function(this: User) {
    return isPinguDev(this);
}