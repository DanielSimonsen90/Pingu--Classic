"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlankEmbedField = exports.EmbedField = void 0;
class EmbedField {
    constructor(title, value, inline = false) {
        this.name = title;
        this.value = value;
        this.inline = inline;
    }
}
exports.EmbedField = EmbedField;
function BlankEmbedField(inline = false) {
    return new EmbedField('\u200B', '\u200B', inline);
}
exports.BlankEmbedField = BlankEmbedField;
