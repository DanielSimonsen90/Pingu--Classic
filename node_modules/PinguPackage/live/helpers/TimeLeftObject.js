"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLeftObject = void 0;
class TimeLeftObject {
    constructor(Now, EndsAt) {
        //General properties
        this.endsAt = EndsAt;
        let timeDifference = Math.round(EndsAt.getTime() - Now.getTime());
        //How long is each time module in ms
        let second = 1000;
        let minute = second * 60;
        let hour = minute * 60;
        let day = hour * 24;
        let week = day * 7;
        let month = ([1, 3, 5, 7, 8, 10, 12].includes(Now.getMonth()) ? 31 : [4, 6, 9, 11].includes(Now.getMonth()) ? 30 : Now.getFullYear() % 4 == 0 ? 29 : 28) * day;
        let year = (365 + (Now.getFullYear() % 4 == 0 ? 1 : 0)) * day;
        //Calculate time difference between Now & EndsAt and set to object properties
        this.years = reduceTime(year);
        this.months = reduceTime(month);
        this.weeks = reduceTime(week);
        this.days = reduceTime(day);
        this.hours = reduceTime(hour);
        this.minutes = reduceTime(minute);
        this.seconds = reduceTime(second);
        this.milliseconds = reduceTime(1);
        function reduceTime(ms) {
            let result = 0;
            while (timeDifference > ms) {
                timeDifference -= ms;
                result++;
            }
            return result;
        }
    }
    toString() {
        //console.log(`${this.days}Y ${this.days}M ${this.days}w ${this.days}d ${this.hours}h ${this.minutes}m ${this.seconds}s`);
        let returnMsg = '';
        const times = [this.years, this.months, this.weeks, this.days, this.hours, this.minutes, this.seconds], timeMsg = ["year", "month", "week", "day", "hour", "minute", "second"];
        for (var i = 0; i < times.length; i++)
            if (times[i] > 0) {
                returnMsg += `**${times[i]}** ${timeMsg[i]}`;
                if (times[i] != 1)
                    returnMsg += 's';
                returnMsg += `, `;
            }
        return returnMsg.substring(0, returnMsg.length - 2);
    }
}
exports.TimeLeftObject = TimeLeftObject;
exports.default = TimeLeftObject;
