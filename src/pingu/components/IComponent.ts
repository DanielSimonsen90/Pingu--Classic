import { MessageActionRowComponent, MessageSelectMenu, MessageSelectMenuOptions } from "discord.js";
import ButtonComponent, { ButtonComponentOptions } from "./ButtonComponent";

export type IComponent = ButtonComponent | MessageActionRowComponent;
export default IComponent;

interface ComponentData {
    Button: ButtonComponentOptions,
    SelectMenu: MessageSelectMenu | MessageSelectMenuOptions
}
export interface ComponentTypes {
    Button: ButtonComponent,
    SelectMenu: MessageSelectMenu
}
export interface ComponentTypeof {
    Button: typeof ButtonComponent,
    SelectMenu: typeof MessageSelectMenu
}
function ComponentConstruct<Type extends keyof ComponentData>(type: Type, data: ComponentData[Type]): ComponentTypes[Type] {
    return (() => {
        switch (type) {
            case 'Button': return new ButtonComponent(data as ButtonComponentOptions);
            case 'SelectMenu': return new MessageSelectMenu(data as MessageSelectMenuOptions);
            default: return null;
        }
    })() as ComponentTypes[Type];
}
export { ComponentConstruct as Component }