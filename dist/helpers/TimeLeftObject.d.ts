declare type StyleDateTime = 'DATE' | 'TIME';
declare type StyleLongShort = 'LONG' | 'SHORT';
export declare type TimestampStyle = `${StyleLongShort}_${StyleDateTime}` | `${StyleLongShort}_DATE/TIME` | 'RELATIVE';
export declare const TimestampStyles: Map<TimestampStyle, string>;
export declare class TimeLeftObject {
    constructor(now: Date | number, endsAt: Date | number);
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    endsAt: Date;
    toString(): string;
}
export default TimeLeftObject;
