import { 
    ButtonInteraction, InteractionButtonOptions, 
    InteractionCollector, InteractionCollectorOptions, 
    MessageButton, MessageComponentInteraction, 
    TextBasedChannels 
} from 'discord.js';

export type OnClick = (interaction: ButtonInteraction) => any
export interface ButtonComponentOptions extends InteractionButtonOptions {
    onclick?: OnClick
}

export class ButtonComponent extends MessageButton {
    constructor(data?: ButtonComponentOptions) {
        super(data);
        this.onclick = data.onclick;
    }

    private _collector: InteractionCollector<MessageComponentInteraction>
    public onclick: OnClick;
    public setOnClick(onclick: OnClick) {
        this.onclick = onclick;
        return this;
    }
    public listenTo(channel: TextBasedChannels, options?: InteractionCollectorOptions<MessageComponentInteraction>) {
        const filter = (i: MessageComponentInteraction) => i.isButton() && i.customId == this.customId && options.filter(i);
        this._collector = channel.createMessageComponentCollector({ ...options, filter });

        this._collector.on('collect', i => {
            this.onclick(i as ButtonInteraction);
        });
        return this;
    }
    public stopListening(reason?: string) {
        this._collector.stop(reason);
        this._collector = null;
        return this;
    }
}
export default ButtonComponent;