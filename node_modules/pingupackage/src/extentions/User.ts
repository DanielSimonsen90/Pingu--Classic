import { User } from 'discord.js';
import PinguUser from '../pingu/user/PinguUser';
import BasePinguClient from '../pingu/client/BasePinguClient';

declare module 'discord.js' {
    interface User {
        isPinguDev(): boolean
        pUser(): PinguUser
        client: BasePinguClient
    }
}

User.prototype.isPinguDev = function(this: User) {
    return this.client.developers.isPinguDev(this);
}
User.prototype.pUser = function(this: User) {
    return this.client.pUsers.get(this);
}