export declare class TimeLeftObject {
    constructor(Now: Date, EndsAt: Date);
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
