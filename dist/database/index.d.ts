export { PAchievement, PChannel, PClient, PGuild, PGuildMember, PItem, PMarry, PQueue, PRole, PUser } from './json';
import PinguClientBase from "../pingu/client/PinguClientBase";
export declare function DBExecute<T>(client: PinguClientBase, callback: (mongoose: typeof import('mongoose')) => Promise<T>): Promise<T>;
