"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonComponent = void 0;
const discord_js_1 = require("discord.js");
class ButtonComponent extends discord_js_1.MessageButton {
    constructor(data) {
        super(data);
        this.onclick = data.onclick;
    }
    _collector;
    onclick;
    setOnClick(onclick) {
        this.onclick = onclick;
        return this;
    }
    onstop;
    resetTimer(options) {
        return this._collector.resetTimer(options);
    }
    listenTo(channel, options) {
        const filter = (i) => i.isButton() && i.customId == this.customId && options.filter ? options.filter(i) : true;
        this._collector = channel.createMessageComponentCollector({ ...options, filter })
            .on('collect', i => this.onclick(i))
            .on('end', (collected, reason) => this.onstop(collected
            .filter(c => c.isButton())
            .valueArr(), reason));
        return this;
    }
    stopListening(reason) {
        this._collector.stop(reason);
        this._collector = null;
        return this;
    }
}
exports.ButtonComponent = ButtonComponent;
exports.default = ButtonComponent;
