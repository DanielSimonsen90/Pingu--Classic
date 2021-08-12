"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedField = void 0;
class EmbedField {
    static Blank(inline = false) { return new EmbedField('\u200B', '\u200B', inline); }
    constructor(title, value, inline = false) {
        this.name = title;
        this.value = value;
        this.inline = inline;
    }
    name;
    value;
    inline;
}
exports.EmbedField = EmbedField;
exports.default = EmbedField;
