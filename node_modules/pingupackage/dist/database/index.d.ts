export { PAchievement, PChannel, PClient, PGuild, PGuildMember, PItem, PMarry, PQueue, PRole, PUser } from './json';
import PinguClientShell from "../pingu/client/PinguClientShell";
export declare function DBExecute<T>(client: PinguClientShell, callback: (mongoose: typeof import('mongoose')) => Promise<T>): Promise<T>;
