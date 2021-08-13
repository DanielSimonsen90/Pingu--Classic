import PinguUser from '../pingu/user/PinguUser';
import BasePinguClient from '../pingu/client/BasePinguClient';
declare module 'discord.js' {
    interface User {
        isPinguDev(): boolean;
        pUser(): PinguUser;
        client: BasePinguClient;
    }
}
