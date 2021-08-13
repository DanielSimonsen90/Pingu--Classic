import BasePinguClient from "../pingu/client/BasePinguClient";
declare type Pingu = BasePinguClient;
declare module 'discord.js' {
    interface Channel {
        client: Pingu;
    }
    interface Message {
        client: Pingu;
    }
    interface Guild {
        client: Pingu;
    }
    interface GuildMember {
        client: Pingu;
    }
    interface User {
        client: Pingu;
    }
}
export {};
