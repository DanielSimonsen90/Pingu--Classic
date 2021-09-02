"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLeftObject = exports.TimestampStyles = void 0;
exports.TimestampStyles = new Map([
    ['SHORT_TIME', 't'],
    ['LONG_TIME', 'T'],
    ['SHORT_DATE', 'd'],
    ['LONG_DATE', 'D'],
    ['SHORT_DATE/TIME', 'f'],
    ['LONG_DATE/TIME', 'F'],
    ['RELATIVE', 'R']
]);
class TimeLeftObject {
    constructor(now, endsAt) {
        //General properties
        this.endsAt = typeof endsAt == 'number' ? new Date(endsAt) : endsAt;
        const nowDate = typeof now == 'number' ? new Date(now) : now;
        let timeDifference = Math.round(this.endsAt.getTime() - nowDate.getTime());
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
            console.log(`TimeLeftObject.reduceTime(ms: number): ${result}`, `timeDifference % ms: ${timeDifference % ms}`);
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
    endsAt;
    toString() {
        //console.log(`${this.years}Y ${this.months}M ${this.weeks}w ${this.days}d ${this.hours}h ${this.minutes}m ${this.seconds}s ${this.milliseconds}ms`);
        const times = [this.years, this.months, this.weeks, this.days, this.hours, this.minutes, this.seconds];
        const timeMsg = ["year", "month", "week", "day", "hour", "minute", "second"];
        const isPlural = (index) => times[index] != 1;
        const result = times.reduce((result, time, i) => (time > 0 ? `${result}**${times[i]}** ${timeMsg[i]}${isPlural(i) ? 's' : ''}, ` : result), '');
        return result.substring(0, result.length - 2);
    }
}
exports.TimeLeftObject = TimeLeftObject;
exports.default = TimeLeftObject;
