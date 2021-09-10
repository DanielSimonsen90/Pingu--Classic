declare type StyleDateTime = 'DATE' | 'TIME';
declare type StyleLongShort = 'LONG' | 'SHORT';
export declare type TimestampStyle = `${StyleLongShort}_${StyleDateTime}` | `${StyleLongShort}_DATE/TIME` | 'RELATIVE';
export declare const TimestampStyles: Map<TimestampStyle, string>;
export declare function TimeFormat(timestamp: number | Date, format?: TimestampStyle): string;
export declare class TimeSpan {
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
