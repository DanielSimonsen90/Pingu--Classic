declare type StyleDateTime = 'DATE' | 'TIME';
declare type StyleLongShort = 'LONG' | 'SHORT';
export declare type TimestampStyle = `${StyleLongShort}_${StyleDateTime}` | `${StyleLongShort}_DATE/TIME` | 'RELATIVE';
export declare const TimestampStyles: Map<TimestampStyle, string>;
/**
 * @SHORT_TIME hh:mm
 * @LONG_TIME hh:mm:ss
 * @SHORT_DATE dd/MM/yyyy
 * @LONG_DATE dd Monthname yyyy
 * @SHORT_DATETIME dd Monthname yyyy hh:mm
 * @LONG_DATETIME Day, dd Monthname yyyy hh:mm
 * @RELATIVE x timeunit ago
 */
export declare function TimeFormat(timestamp: number | Date, ...formats: TimestampStyle[]): string;
export declare const ValidTime: RegExp;
/**
 * @param value string value to convert into ms
 * @options ms|s|m|h|d|w|M|y
 */
export declare function TimeString(input: string): number;
export declare class TimeSpan {
    static get millisecond(): number;
    static get second(): number;
    static get minute(): number;
    static get hour(): number;
    static get day(): number;
    static get week(): number;
    static get month(): number;
    static get year(): number;
    static ms(value: string): number;
    static ValidTime: RegExp;
    constructor(value: Date | number, now?: Date | number);
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    date: Date;
    pastTense: boolean;
    toString(includeMs?: boolean): string;
    toTimestampStyle(style?: TimestampStyle): string;
}
export default TimeSpan;
