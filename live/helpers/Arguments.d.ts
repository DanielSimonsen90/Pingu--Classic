import { Collection } from "discord.js";
declare type MentionType = 'USER' | 'NICKNAME' | 'CHANNEL' | 'ROLE' | 'EVERYONE' | 'HERE' | 'SNOWFLAKE' | 'EMOJI' | 'UNICODE_EMOJI' | 'CUSTOM_EMOJI' | 'CUSTOM_ANIMATED_EMOJI' | 'TIMESTAMP' | 'IMAGE';
export declare class Mention {
    constructor(prop: string, v: string, i: number, types: {});
    mentionType: MentionType;
    value: boolean;
    index: number;
}
export declare class Arguments extends Array<string> {
    get first(): string;
    get last(): string;
    get mentions(): Collection<MentionType, Mention>;
    get(match: RegExp | string): string;
    findIndexRegex(regexValue: string): number;
    lowercase(): this;
}
export default Arguments;
