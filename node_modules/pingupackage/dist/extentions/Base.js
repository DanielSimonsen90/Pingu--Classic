"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ms_1 = require("ms");
discord_js_1.Base.prototype.doIn = function (callback, time) {
    const timeout = typeof time == 'number' ? time : ms_1.default(time);
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(callback(this));
            }, timeout);
        }
        catch (err) {
            reject(err);
        }
    });
};
