import { Collection, GuildMember } from "discord.js";
export declare type DeveloperNames = 'Danho' | 'SynthySytro' | 'Slothman';
export declare var developers: Collection<DeveloperNames, string>;
export declare class DeveloperCollection extends Collection<DeveloperNames, GuildMember> {
    isPinguDev(member: GuildMember): boolean;
    update(member: GuildMember): this;
}
export default DeveloperCollection;
