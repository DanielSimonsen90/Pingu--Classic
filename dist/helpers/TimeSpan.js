"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSpan = exports.TimeFormat = exports.TimestampStyles = void 0;
exports.TimestampStyles = new Map([
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
function TimeFormat(timestamp, format) {
    const ms = typeof timestamp == 'number' ? timestamp : timestamp.getTime();
    return `<t:${Math.round(ms / 1000)}${format ? `:${exports.TimestampStyles.get(format)}` : ''}>`;
}
exports.TimeFormat = TimeFormat;
class TimeSpan {
    constructor(value, now = Date.now()) {
        //General properties
        this.date = typeof value == 'number' ? new Date(value) : value;
        const nowDate = typeof now == 'number' ? new Date(now) : now;
        const highest = this.date.getTime() > nowDate.getTime() ? this.date : nowDate;
        const lowest = this.date == highest ? nowDate : this.date;
        this.pastTense = highest == nowDate;
        let timeDifference = Math.round(highest.getTime() - lowest.getTime());
        //How long is each time module in ms
        const millisecond = 1;
        const second = millisecond * 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
        const month = ([1, 3, 5, 7, 8, 10, 12].includes(nowDate.getMonth()) ? 31 :
            [4, 6, 9, 11].includes(nowDate.getMonth()) ? 30 :
                nowDate.getFullYear() % 4 == 0 ? 29 : 28) * day;
        const year = (365 + (nowDate.getFullYear() % 4 == 0 ? 1 : 0)) * day;
        //Calculate time difference between Now & EndsAt and set to object properties
        this.years = reduceTime(year);
        this.months = reduceTime(month);
        this.weeks = reduceTime(week);
        this.days = reduceTime(day);
        this.hours = reduceTime(hour);
        this.minutes = reduceTime(minute);
        this.seconds = reduceTime(second);
        this.milliseconds = reduceTime(millisecond);
        function reduceTime(ms) {
            let result = 0;
            while (timeDifference > ms) {
                timeDifference -= ms;
                result++;
            }
            console.log(`TimeSpan.reduceTime(ms: number): ${result}`, `timeDifference % ms: ${timeDifference % ms}`);
            return result;
        }
    }
    years;
    months;
    weeks;
    days;
    hours;
    minutes;
    seconds;
    milliseconds;
    date;
    pastTense;
    toString(includeMs) {
        //console.log(`${this.years}Y ${this.months}M ${this.weeks}w ${this.days}d ${this.hours}h ${this.minutes}m ${this.seconds}s ${this.milliseconds}ms`);
        const times = [...[this.years, this.months, this.weeks, this.days, this.hours, this.minutes, this.seconds], includeMs ? this.milliseconds : -1];
        const timeMsg = ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"];
        const result = times.reduce((result, time, i) => (time > 0 ? `${result}**${times[i]}** ${timeMsg[i]}${times[i] != 1 ? 's' : ''}, ` : result), '');
        return result.length > 2 && result.substring(0, result.length - 2) || '';
    }
    toTimestampStyle(style) {
        return TimeFormat(this.date, style);
    }
}
exports.TimeSpan = TimeSpan;
exports.default = TimeSpan;
