"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedField = void 0;
class EmbedField {
    constructor(title, value, inline = false) {
        this.name = title;
        this.value = value;
        this.inline = inline;
    }
    static Blank(inline = false) { return new EmbedField('\u200B', '\u200B', inline); }
}
exports.EmbedField = EmbedField;
