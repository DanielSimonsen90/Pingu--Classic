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
exports.PinguCommand = exports.CommandCategories = void 0;
var CommandCategories;
(function (CommandCategories) {
    CommandCategories[CommandCategories["Utility"] = 0] = "Utility";
    CommandCategories[CommandCategories["Fun"] = 1] = "Fun";
    CommandCategories[CommandCategories["Supporting"] = 2] = "Supporting";
    CommandCategories[CommandCategories["DevOnly"] = 3] = "DevOnly";
    CommandCategories[CommandCategories["GuildSpecific"] = 4] = "GuildSpecific";
})(CommandCategories = exports.CommandCategories || (exports.CommandCategories = {}));
const PinguHandler_1 = require("./PinguHandler");
class PinguCommand extends PinguHandler_1.default {
    constructor(name, category, description, data, execute) {
        //Must need these
        super(name);
        this.guildOnly = false;
        this.mustBeBeta = false;
        this.description = description;
        this.category = category;
        if (execute)
            this.execute = execute;
        if (data) {
            const { permissions } = data;
            this.permissions = (permissions === null || permissions === void 0 ? void 0 : permissions.length) ? [...permissions, 'SEND_MESSAGES'] : ['SEND_MESSAGES'];
            //Optional
            const { usage, guildOnly, specificGuildID, examples, aliases, mustBeBeta } = data;
            this.usage = usage || "";
            this.guildOnly = guildOnly || false;
            this.specificGuildID = specificGuildID;
            this.examples = (examples === null || examples === void 0 ? void 0 : examples.length) ? examples : [""];
            this.aliases = (aliases === null || aliases === void 0 ? void 0 : aliases.length) ? aliases : new Array();
            this.mustBeBeta = mustBeBeta || false;
        }
        else {
            this.usage = "";
            this.guildOnly = false;
            this.examples = [""];
            this.aliases = new Array();
            this.mustBeBeta = false;
        }
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return params.client.log('error', `Execute for command **${this.name}**, was not defined!`);
        });
    }
}
exports.PinguCommand = PinguCommand;
exports.default = PinguCommand;
