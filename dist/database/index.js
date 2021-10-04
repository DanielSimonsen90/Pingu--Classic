"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBExecute = exports.PUser = exports.PRole = exports.PQueue = exports.PMarry = exports.PItem = exports.PGuildMember = exports.PGuild = exports.PClient = exports.PChannel = exports.PAchievement = void 0;
var json_1 = require("./json");
Object.defineProperty(exports, "PAchievement", { enumerable: true, get: function () { return json_1.PAchievement; } });
Object.defineProperty(exports, "PChannel", { enumerable: true, get: function () { return json_1.PChannel; } });
Object.defineProperty(exports, "PClient", { enumerable: true, get: function () { return json_1.PClient; } });
Object.defineProperty(exports, "PGuild", { enumerable: true, get: function () { return json_1.PGuild; } });
Object.defineProperty(exports, "PGuildMember", { enumerable: true, get: function () { return json_1.PGuildMember; } });
Object.defineProperty(exports, "PItem", { enumerable: true, get: function () { return json_1.PItem; } });
Object.defineProperty(exports, "PMarry", { enumerable: true, get: function () { return json_1.PMarry; } });
Object.defineProperty(exports, "PQueue", { enumerable: true, get: function () { return json_1.PQueue; } });
Object.defineProperty(exports, "PRole", { enumerable: true, get: function () { return json_1.PRole; } });
Object.defineProperty(exports, "PUser", { enumerable: true, get: function () { return json_1.PUser; } });
async function DBExecute(client, callback) {
    return new Promise(async (resolve, reject) => {
        const mongoose = require('mongoose');
        if (!client.config.mongoPass)
            return null;
        try {
            await mongoose.connect(`mongodb+srv://Pingu:${client.config.mongoPass}@pingudb.kh2uq.mongodb.net/PinguDB?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            resolve(callback(mongoose));
        }
        catch (err) {
            client.log('error', 'Mongo error', null, new Error(err));
            reject(err);
        }
        //finally { mongoose.connection.close(); }
    });
}
exports.DBExecute = DBExecute;
