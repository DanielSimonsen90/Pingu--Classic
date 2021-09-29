import { ButtonInteraction, CollectorResetTimerOptions, InteractionButtonOptions, InteractionCollectorOptions, MessageButton, MessageComponentInteraction, TextBasedChannels } from 'discord.js';
export declare type OnClick = (interaction: ButtonInteraction) => any;
export interface ButtonComponentOptions extends InteractionButtonOptions {
    onclick?: OnClick;
}
export declare class ButtonComponent extends MessageButton {
    constructor(data?: ButtonComponentOptions);
    private _collector;
    onclick: OnClick;
    setOnClick(onclick: OnClick): this;
    onstop: (interactions: Array<ButtonInteraction>, reason?: string) => any;
    resetTimer(options?: CollectorResetTimerOptions): void;
    listenTo(channel: TextBasedChannels, options?: InteractionCollectorOptions<MessageComponentInteraction>): this;
    stopListening(reason?: string): this;
}
export default ButtonComponent;
