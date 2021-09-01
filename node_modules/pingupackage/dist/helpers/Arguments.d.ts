import { Collection } from "discord.js";
declare type MentionType = 'USER' | 'NICKNAME' | 'CHANNEL' | 'ROLE' | 'EVERYONE' | 'HERE' | 'SNOWFLAKE' | 'EMOJI' | 'UNICODE_EMOJI' | 'CUSTOM_EMOJI' | 'CUSTOM_ANIMATED_EMOJI' | 'TIMESTAMP' | 'IMAGE';
export declare class Mention {
    constructor(prop: string, v: string, i: number, types: {}, args: Arguments);
    mentionType: MentionType;
    value: boolean;
    index: number;
    regex: RegExp;
    argument(remove?: boolean): string;
}
export declare class Arguments extends Array<string> {
    get first(): string;
    get last(): string;
    get mentions(): Collection<MentionType, Mention>;
    /**
     * Finds and cuts an element matching match
     * @param match Comparer
     * @param remove Default: true
     * @returns Match
     */
    get(match: RegExp | string, remove?: boolean): string;
    /**
     * Finds and cuts all elements matching match
     * @param match Comparer
     * @param remove Default: true
     * @returns Match
     */
    getAll(match: RegExp | string, remove?: boolean): string[];
    findIndexRegex(value: RegExp): number;
    lowercase(): this;
    private remove;
}
export default Arguments;
