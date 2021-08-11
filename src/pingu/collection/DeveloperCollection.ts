import { Collection, GuildMember, Snowflake, User } from "discord.js";

export type DeveloperNames = 'Danho' | 'SynthySytro' | 'Slothman';
export var developers = new Collection<DeveloperNames, Snowflake>([
    ['Danho', '245572699894710272'],
    ['SynthySytro', '405331883157880846'],
    ['Slothman', '290131910091603968']
]);

export function isPinguDev(user: User): boolean {
    return this.get(developers.findKey(id => id == user.id)) != null;
}

export class DeveloperCollection extends Collection<DeveloperNames, GuildMember> {
    isPinguDev(user: User): boolean {
        return isPinguDev(user);
    }
    update(member: GuildMember) {
        if (!this.some(u => u.id == member.id)) return this;

        const name = this.findKey(u => u.id == member.id);
        return this.set(name, member);
    }
}

export default DeveloperCollection