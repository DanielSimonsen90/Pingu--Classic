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
}
export default PinguActionRow;