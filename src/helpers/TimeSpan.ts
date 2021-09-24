type StyleDateTime = 'DATE' | 'TIME';
type StyleLongShort = 'LONG' | 'SHORT';
export type TimestampStyle = `${StyleLongShort}_${StyleDateTime}` | `${StyleLongShort}_DATE/TIME` | 'RELATIVE';
export const TimestampStyles = new Map<TimestampStyle, string>([
    ['SHORT_TIME', 't'],
    ['LONG_TIME', 'T'],
    ['SHORT_DATE', 'd'],
    ['LONG_DATE', 'D'],
    ['SHORT_DATE/TIME', 'f'],
    ['LONG_DATE/TIME', 'F'],
    ['RELATIVE', 'R']
]);
/**
 * @SHORT_TIME hh:mm
 * @LONG_TIME hh:mm:ss
 * @SHORT_DATE dd/MM/yyyy
 * @LONG_DATE dd Monthname yyyy
 * @SHORT_DATETIME dd Monthname yyyy hh:mm
 * @LONG_DATETIME Day, dd Monthname yyyy hh:mm
 * @RELATIVE x timeunit ago
 */
export function TimeFormat(timestamp: number | Date, ...formats: TimestampStyle[]) {
    const ms = typeof timestamp == 'number' ? timestamp : timestamp.getTime();
    if (!formats.length) return `<t:${Math.round(ms / 1000)}>`;
    return formats.map(format => `<t:${Math.round(ms / 1000)}:${TimestampStyles.get(format)}>`).join(', ');
}

/**
 * @param value string value to convert into ms
 * @options ms|s|m|h|d|w|M|y
 */
export function TimeString(input: string): number {
    const [value, unit] = input.match(/^(\d+(?:\.|,)?\d*)(ms|s|m|h|d|w|M|y)$/);
    const units = new Map<string, number>([
        ['ms', TimeSpan.millisecond],
        ['s', TimeSpan.second],
        ['m', TimeSpan.minute],
        ['h', TimeSpan.hour],
        ['d', TimeSpan.day],
        ['w', TimeSpan.week],
        ['M', TimeSpan.month],
        ['y', TimeSpan.year]
    ]);

    return parseInt(value) * units.get(unit);
}

export class TimeSpan {
    public static get millisecond(): number { return 1; }
    public static get second(): number { return TimeSpan.millisecond * 1000; }
    public static get minute(): number { return TimeSpan.second * 60; }
    public static get hour(): number { return TimeSpan.minute * 60; }
    public static get day(): number { return TimeSpan.hour * 24 }
    public static get week(): number { return TimeSpan.day * 7; }
    public static get month(): number {
        const now = new Date();
        return (
            [1, 3, 5, 7, 8, 10, 12].includes(now.getMonth()) ? 31 : 
            [4, 6, 9, 11].includes(now.getMonth()) ? 30 : 
            now.getFullYear() % 4 == 0 ? 29 : 28
        ) * TimeSpan.day; 
    }
    public static get year(): number {
        const now = new Date()
        return (365 + (now.getFullYear() % 4 == 0 ? 1 : 0)) * TimeSpan.day
    }

    public static ms(value: string): number {
        return TimeString(value);
    }

    constructor(value: Date | number, now: Date | number = Date.now()) {
        //General properties
        this.date = typeof value == 'number' ? new Date(value) : value;
        const nowDate = typeof now == 'number' ? new Date(now) : now;

        const highest = this.date.getTime() > nowDate.getTime() ? this.date : nowDate;
        const lowest = this.date == highest ? nowDate : this.date;
        this.pastTense = highest == nowDate;

        let timeDifference = Math.round(highest.getTime() - lowest.getTime());

        //Calculate time difference between Now & EndsAt and set to object properties
        this.years = reduceTime(TimeSpan.year);
        this.months = reduceTime(TimeSpan.month);
        this.weeks = reduceTime(TimeSpan.week);
        this.days = reduceTime(TimeSpan.day);
        this.hours = reduceTime(TimeSpan.hour);
        this.minutes = reduceTime(TimeSpan.minute);
        this.seconds = reduceTime(TimeSpan.second);
        this.milliseconds = reduceTime(TimeSpan.millisecond);

        function reduceTime(ms: number) {
            let result = 0;

            while (timeDifference > ms) {
                timeDifference -= ms;
                result++;
            }
            console.log(
                `TimeSpan.reduceTime(ms: number): ${result}`, 
                `timeDifference % ms: ${timeDifference % ms}`
            );
            
            return result;
        }
    }

    public years: number;
    public months: number;
    public weeks: number;
    public days: number;
    public hours: number;
    public minutes: number;
    public seconds: number;
    public milliseconds: number;
    
    public date: Date;
    public pastTense: boolean;

    public toString(includeMs?: boolean) {
        //console.log(`${this.years}Y ${this.months}M ${this.weeks}w ${this.days}d ${this.hours}h ${this.minutes}m ${this.seconds}s ${this.milliseconds}ms`);
        const times = [...[this.years, this.months, this.weeks, this.days, this.hours, this.minutes, this.seconds], includeMs ? this.milliseconds : -1];
        const timeMsg = ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"];
        const result = times.reduce((result, time, i) => (
            time > 0 ? `${result}**${times[i]}** ${timeMsg[i]}${times[i] != 1 ? 's' : ''}, ` : result
        ), '');

        return result.length > 2 && result.substring(0, result.length - 2) || '';
    }
    public toTimestampStyle(style?: TimestampStyle) {
        return TimeFormat(this.date, style);
    }
}

export default TimeSpan;