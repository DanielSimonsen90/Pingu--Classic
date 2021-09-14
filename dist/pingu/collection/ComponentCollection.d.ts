import { MessageActionRow, MessageActionRowComponent } from "discord.js";
import ButtonComponent from "../components/ButtonComponent";
declare type IComponent = ButtonComponent | MessageActionRowComponent;
export declare class ComponentCollection extends MessageActionRow {
    components: IComponent[];
    get(id: string): IComponent;
}
export {};
