"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const PinguLibrary_1 = require("../pingu/library/PinguLibrary");
const PinguClient_1 = require("../pingu/client/PinguClient");
function DBExecute(client, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const mongoose = require('mongoose');
        try {
            yield mongoose.connect(`mongodb+srv://Pingu:${PinguClient_1.ToPinguClient(client).config.mongoPass}@pingudb.kh2uq.mongodb.net/PinguDB?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            yield callback(mongoose);
        }
        catch (err) {
            PinguLibrary_1.errorLog(client, 'Mongo error', null, new Error(err));
        }
        //finally { mongoose.connection.close(); }
    });
}
exports.DBExecute = DBExecute;
