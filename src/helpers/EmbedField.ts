export class EmbedField {
    constructor(title: string, value: string, inline = false) {
        this.name = title;
        this.value = value;
        this.inline = inline;
    }

    public name: string
    public value: string
    public inline: boolean
}
export function BlankEmbedField(inline = false) {
    return new EmbedField('\u200B', '\u200B', inline)
}