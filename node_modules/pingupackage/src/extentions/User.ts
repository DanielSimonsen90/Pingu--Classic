import { User } from 'discord.js';
import PinguUser from '../pingu/user/PinguUser';
import { isPinguDev } from '../pingu/collection/DeveloperCollection';
import BasePinguClient from '../pingu/client/BasePinguClient';

declare module 'discord.js' {
    interface User {
        isPinguDev(): boolean
        pUser(): PinguUser
        client: BasePinguClient
    }
}

User.prototype.isPinguDev = function(this: User) {
    return isPinguDev(this);
}
User.prototype.pUser = function(this: User) {
    return this.client.pUsers.get(this);
}