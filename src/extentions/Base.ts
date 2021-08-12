import { Base } from "discord.js";
import ms from 'ms';

declare module 'discord.js' {
    interface Base {
        doIn<T>(callback: (self?: this) => T |Promise<T>, time: number | string): Promise<T>
    }
}

Base.prototype.doIn = function<ReturnType>(this: Base, callback: (self?: Base) => ReturnType | Promise<ReturnType>, time: number) {
    const timeout = typeof time == 'number' ? time : ms(time);
    return new Promise<ReturnType>((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(callback(this));
            }, timeout);
        } catch (err) {
            reject(err);
        }
    })
}