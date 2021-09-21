import { Collection } from "discord.js";

type MentionType = 
    'SNOWFLAKE' | 
    'USER' | 'NICKNAME' | 
    'CHANNEL' | 'ROLE' | 
    'EVERYONE' | 'HERE' | 
    'EMOJI' | 'UNICODE_EMOJI' | 'CUSTOM_EMOJI' | 
    'CUSTOM_ANIMATED_EMOJI' | 
    'TIMESTAMP' | 'IMAGE';

export class Mention {
    constructor(prop: string, v: string, i: number, types: {}, args: Arguments) {
        this.mentionType = prop.toUpperCase() as MentionType;
        this.regex = types[prop];
        this.value = this.regex.test(v);
        this.index = i;
        this.argument = (remove = true) => this.value && args.get(this.regex, remove) || null;
    }

    public mentionType: MentionType;
    public value: boolean;
    public index: number;
    public regex: RegExp;

    /**
     * Cuts and returns argument value from Argument class
     * @param remove Default: true
     * @returns Argument value from Argument class
     */
    public argument(remove = true): string {
        return null;
    }
}

export class Arguments extends Array<string> {
    public get first() {
        return this[0];
    }
    public get last() {
        return this[this.length - 1];
    }

    public get mentions() {
        const snowflakeLength = 18;
        const unixLength = 10;

        const types = {
            user: new RegExp(`^<@\\d{${snowflakeLength}}>$` || /^<@\d{18}>$/),
            nickname: new RegExp(`^<@!\\d{${snowflakeLength}}>$` || /^<@!\d{18}>$/),
            channel: new RegExp(`^<#\\d{${snowflakeLength}}>$` || /^<#\d{18}>$/),
            role: new RegExp(`^<@&\\d{${snowflakeLength}}>$` || /^<@&\d{18}>$/),
            everyone: new RegExp(`^@everyone$`),
            here: new RegExp(`^@here$`),

            snowflake: new RegExp(`^(\\d{${snowflakeLength}})$` || /^(\d{18})$/),
            emoji: new RegExp(/temp/),
            unicodeEmoji: new RegExp(/^[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]$/ug),
            customEmoji: new RegExp(`^<:\\w{2,}:\\d{${snowflakeLength}}>$` || /^<:\w{2,}:\d{18}>$/),
            customEmojiAnimated: new RegExp(`^<a:\\w{2,}:\\d{${snowflakeLength}}>$` || /^<a:\w{2,}:\d{18}>$/),
            timestamp: new RegExp(`^<t:\\d{${unixLength}}((:[tTdDfFR]{1})?)>$` || /^<t:\d{10}((:[tTdDfFR]{1})?)>$/),
            image: new RegExp(`^https://cdn.discordapp.com/$` || /^https:\/\/cdn.discordapp.com\/$/),
        };

        types.emoji = types.unicodeEmoji || types.customEmoji || types.customEmojiAnimated;
        const mentionTypes = Object.keys(types).filter(prop => prop != 'mentions');
        
        return [...this, ...mentionTypes]
            .map((v, i) => mentionTypes.map(prop => new Mention(prop, v, i, types, this)))
            .reduce((result, mentions) => {
                for (const m of mentions) {
                    if (!result.has(m.mentionType) || !result.get(m.mentionType).value)
                        result.set(m.mentionType, m);
                }
                return result;
            }, new Collection<MentionType, Mention>())
    }

    /**
     * Finds and cuts an element matching match
     * @param match Comparer
     * @param remove Default: true
     * @returns Match
     */
    public get(match: RegExp | string, remove = true) {
        const item = this.find(v => typeof match != 'string' && match.test(v) || match == v);
        return remove ? this.remove(item) : item;
    }
    /**
     * Finds and cuts all elements matching match
     * @param match Comparer
     * @param remove Default: true
     * @returns Match
     */
    public getAll(match: RegExp | string, remove = true) {
        const matches = this.filter(v => typeof match != 'string' && match.test(v) || match == v);
        
        if (!remove) return matches;

        for (const item of matches) {
            this.remove(item);
        }
    }
    public findIndexRegex(value: RegExp) {
        for (const item of this) {
            if (new RegExp(value).test(item))
                return this.indexOf(item);
        }
    }
    public lowercase() {
        for (const item of this) {
            this[item] = item.toLowerCase();
        }
        return this;
    }

    private remove(item: string) {
        if (!item || this.indexOf(item) == -1) return null;
        return this.splice(this.indexOf(item), 1)[0];
    }
}

export default Arguments;