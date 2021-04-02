export declare class EmbedField {
    constructor(title: string, value: string, inline?: boolean);
    name: string;
    value: string;
    inline: boolean;
}
export declare function BlankEmbedField(inline?: boolean): EmbedField;
