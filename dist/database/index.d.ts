export { PAchievement, PChannel, PClient, PGuild, PGuildMember, PItem, PMarry, PQueue, PRole, PUser } from './json';
import BasePinguClient from "../pingu/client/BasePinguClient";
export declare function DBExecute<T>(client: BasePinguClient, callback: (mongoose: typeof import('mongoose')) => Promise<T>): Promise<T>;
