import { MessageActionRow } from "discord.js";
import IComponent, { ComponentTypes } from '../components/IComponent'

export class PinguActionRow extends MessageActionRow {
    constructor(public name: string, ...components: IComponent[]) {
        super({ components });
    }

    declare public components: IComponent[];

    public get<Component extends keyof ComponentTypes>(type: Component, id: string): ComponentTypes[Component] {
        return this.components.find(c => c.customId == id) as ComponentTypes[Component];
    }
    public getMultiple<Component extends keyof ComponentTypes>(type: Component, ...ids: string[]): Array<ComponentTypes[Component]> {
        return ids.map(id => this.get(type, id));
    }
    public getAll<Component extends keyof ComponentTypes>(type: Component): Array<ComponentTypes[Component]> {
        const ctorName = new Map<keyof ComponentTypes, string>([
            ['Button', 'ButtonComponent'],
            ['SelectMenu', 'SelectMenu']
        ]).get(type);
        return this.components.filter(c => c.constructor.name == ctorName) as Array<ComponentTypes[Component]>;
    }
}
export default PinguActionRow;