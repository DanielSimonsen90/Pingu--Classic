import { Collection, Snowflake, User } from "discord.js";

export type DeveloperNames = 'Danho' | 'SynthySytro' | 'Slothman';
export var developers = new Collection<DeveloperNames, Snowflake>([
    ['Danho', '245572699894710272'],
    ['SynthySytro', '405331883157880846'],
    ['Slothman', '290131910091603968']
]);

export class DeveloperCollection extends Collection<DeveloperNames, User> {
    isPinguDev(user: User): boolean {
        return this.get(developers.findKey(id => id == user.id)) != null;
    }
    update(user: User) {
        if (!this.some(u => u.id == user.id)) return this;

        const name = this.findKey(u => u.id == user.id);
        return this.set(name, user);
    }
}

export default DeveloperCollection