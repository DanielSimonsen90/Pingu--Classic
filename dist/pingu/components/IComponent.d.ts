import { MessageActionRowComponent, MessageSelectMenu, MessageSelectMenuOptions } from "discord.js";
import ButtonComponent, { ButtonComponentOptions } from "./ButtonComponent";
export declare type IComponent = ButtonComponent | MessageActionRowComponent;
export default IComponent;
interface ComponentData {
    Button: ButtonComponentOptions;
    SelectMenu: MessageSelectMenu | MessageSelectMenuOptions;
}
export interface ComponentTypes {
    Button: ButtonComponent;
    SelectMenu: MessageSelectMenu;
}
export interface ComponentTypeof {
    Button: typeof ButtonComponent;
    SelectMenu: typeof MessageSelectMenu;
}
declare function ComponentConstruct<Type extends keyof ComponentData>(type: Type, data: ComponentData[Type]): ComponentTypes[Type];
export { ComponentConstruct as Component };
