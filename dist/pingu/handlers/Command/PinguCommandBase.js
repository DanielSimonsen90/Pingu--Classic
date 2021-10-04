"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwInvalidTypeError = void 0;
const discord_js_1 = require("discord.js");
const PinguHandler_1 = require("../PinguHandler");
/** Propertytype invalid error */
function throwInvalidTypeError(prop, cmdName, type) {
    throw new Error(`"${prop}" for ${cmdName} is not typeof ${type}!`);
}
exports.throwInvalidTypeError = throwInvalidTypeError;
class PinguCommandBase extends PinguHandler_1.default {
    constructor(name, description, data, slashCommandBuilder, executes) {
        super(name);
        this.description = description;
        this.builder = slashCommandBuilder;
        const { permissions, usage, aliases, examples, components, guildOnly, specificGuildId } = data;
        this.components = components?.reduce((map, row) => map.set(row.name, row), new Map()) ?? new Map();
        this.permissions = permissions ?? [];
        this.usage = usage ?? '';
        this.aliases = aliases ?? [];
        this.examples = examples?.length ? examples : [''];
        this.guildOnly = guildOnly ?? false;
        this.specificGuildId = specificGuildId;
        if (this.permissions && !this.permissions.push)
            throwInvalidTypeError('permissions', name, 'array');
        if (this.usage && typeof this.usage != 'string')
            throwInvalidTypeError('usage', name, 'string');
        if (this.examples && !this.examples.push)
            throwInvalidTypeError('examples', name, 'array');
        if (this.aliases && !this.aliases.push)
            throwInvalidTypeError('aliases', name, 'array');
        if (this.guildOnly && typeof this.guildOnly != 'boolean')
            throwInvalidTypeError('guildOnly', name, 'boolean');
        if (this.specificGuildId && typeof this.specificGuildId != 'string')
            throwInvalidTypeError('specificGuildId', name, 'string');
        const { classic, execute } = executes;
        if (classic)
            this._executeClassic = classic;
        if (execute)
            this._execute = execute;
    }
    _logError(client, functionName) {
        return client.log('error', `${functionName} not defined for command ${this.name}`);
    }
    _execute(client, props, extra) {
        return this._logError(client, `_execute`);
    }
    _executeClassic(params, execute) {
        return this._logError(params.client, `_executeClassic`);
    }
    description;
    usage;
    permissions;
    examples;
    aliases;
    guildOnly;
    specificGuildId;
    builder;
    components;
    execute(type, params) {
        const pc = params;
        const ps = params;
        const handler = new discord_js_1.Collection([
            ['Classic', {
                    execute: this._executeClassic,
                    replyPublic: pc.message.reply,
                    replySemiPrivate: pc.message.reply,
                    replyPrivate: pc.message.author.send,
                    followUp: pc.message.channel.send,
                    replyReturn: pc.message.reply,
                    allowPrivate: false
                }], [
                'Interaction', {
                    execute: (() => {
                        const subCommand = ps.interaction.options.getSubcommand();
                        if (subCommand)
                            return (this.builder.subCommands.find(cmd => cmd.name == subCommand))?.onInteraction;
                        return this.builder.onInteraction;
                    })(),
                    replyPublic: ps.interaction.reply,
                    replySemiPrivate: ps.interaction.replyPrivate,
                    replyPrivate: ps.interaction.replyPrivate,
                    followUp: ps.interaction.followUp,
                    replyReturn: ps.interaction.options.getBoolean('private') ? ps.interaction.replyPrivate : ps.interaction.reply,
                    allowPrivate: ps.interaction.options.getBoolean('private')
                }
            ]
        ]).get(type);
        if (!handler)
            return params.client.log('error', `Invalid execute type "${type}" for command ${this.name}`);
        const { execute, replyPublic, replySemiPrivate, replyPrivate, followUp, replyReturn, allowPrivate } = handler;
        return execute(params, (client, commandProps, extra) => this._execute(client, {
            commandProps, ...params, reply: { replyPublic, replySemiPrivate, replyPrivate, followUp, replyReturn, allowPrivate },
            replyPublic, replySemiPrivate, replyPrivate, followUp, replyReturn, allowPrivate,
            components: this.components, client
        }, extra));
    }
}
exports.default = PinguCommandBase;
