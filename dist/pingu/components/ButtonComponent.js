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
    listenTo(channel, options) {
        const filter = (i) => i.isButton() && i.customId == this.customId && options.filter(i);
        this._collector = channel.createMessageComponentCollector({ ...options, filter });
        this._collector.on('collect', i => {
            this.onclick(i);
        });
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
