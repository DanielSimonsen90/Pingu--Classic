import { Collection, User } from "discord.js";
export declare type DeveloperNames = 'Danho' | 'SynthySytro' | 'Slothman';
export declare var developers: Collection<DeveloperNames, string>;
export declare class DeveloperCollection extends Collection<DeveloperNames, User> {
    isPinguDev(user: User): boolean;
    update(user: User): this;
}
export default DeveloperCollection;
