import { Collection, GuildMember, User } from "discord.js";
export declare type DeveloperNames = 'Danho' | 'SynthySytro' | 'Slothman';
export declare var developers: Collection<DeveloperNames, string>;
export declare class DeveloperCollection extends Collection<DeveloperNames, GuildMember> {
    isPinguDev(user: User): boolean;
    update(member: GuildMember): this;
}
export default DeveloperCollection;
