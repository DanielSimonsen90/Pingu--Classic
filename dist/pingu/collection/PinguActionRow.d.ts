import { MessageActionRow } from "discord.js";
import IComponent, { ComponentTypes } from '../components/IComponent';
export declare class PinguActionRow extends MessageActionRow {
    name: string;
    constructor(name: string, ...components: IComponent[]);
    components: IComponent[];
    get<Component extends keyof ComponentTypes>(type: Component, id: string): ComponentTypes[Component];
}
export default PinguActionRow;
