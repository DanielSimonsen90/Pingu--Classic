import { 
    ButtonInteraction, CollectorResetTimerOptions, InteractionButtonOptions, 
    InteractionCollector, InteractionCollectorOptions, 
    MessageButton, MessageComponentInteraction, 
    TextBasedChannels 
} from 'discord.js';

export type OnClick = (interaction: ButtonInteraction) => Promise<any>
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
    public onstop: (interactions: Array<ButtonInteraction>, reason?: string) => any;
    public resetTimer(options?: CollectorResetTimerOptions) {
        return this._collector.resetTimer(options);
    }

    public listenTo(channel: TextBasedChannels, options?: InteractionCollectorOptions<MessageComponentInteraction>) {
        const filter = (i: MessageComponentInteraction) => i.isButton() && i.customId == this.customId && options.filter ? options.filter(i) : true;
        this._collector = channel.createMessageComponentCollector({ ...options, filter })
            .on('collect', async i => {
                i.component.disabled = true;
                await this.onclick(i as ButtonInteraction)
                i.component.disabled = false;
            })
            .on('end', 
                (collected, reason) => this.onstop(collected
                    .filter(c => c.isButton())
                    .valueArr() as Array<ButtonInteraction>, 
                reason
        ));
        return this;
    }
    public stopListening(reason?: string) {
        this._collector.stop(reason);
        this._collector = null;
        return this;
    }
}
export default ButtonComponent;