import { PermissionString, Message, Collection, Guild, MessagePayload, ReplyMessageOptions, InteractionReplyOptions, User } from "discord.js";
import PinguHandler from "../PinguHandler";
import PinguSlashCommandBuilder, { InteractionCommandParams } from "./Slash/PinguSlashCommandBuilder";

import Arguments from "../../../helpers/Arguments";
import PinguClientBase from "../../client/PinguClientBase";
import { APIMessage } from "discord-api-types";

type ReturnType = Promise<Message | APIMessage>;

export interface CommandParamsBase<Client = PinguClientBase> {
    client: Client,
    executor: User,
    guild: Guild
}
export interface ClassicCommandParams<Client = PinguClientBase> extends CommandParamsBase<Client>  {
    message?: Message,
    args?: Arguments,
}

interface CommandTypesParams {
    Interaction: InteractionCommandParams;
    Classic: ClassicCommandParams;
}
export type CommandTypes = keyof CommandTypesParams

type ReplyOptions = string | MessagePayload | ReplyMessageOptions | (InteractionReplyOptions & { fetchReply: true });
type ExecuteFunctionPropsPublic = { 
    guild: Guild,
    executor: User,
}
export interface ReplyMethods {
    replyPublic: (options: ReplyOptions) => ReturnType,
    replySemiPrivate: (options: ReplyOptions) => ReturnType,
    replyPrivate: (options: ReplyOptions) => ReturnType,
    followUp: (options: ReplyOptions) => ReturnType,
    replyReturn: (options: ReplyOptions) => ReturnType,
}
export interface ExecuteFunctionProps<Client = PinguClientBase> extends CommandParamsBase<Client>, ReplyMethods {
    executor: User,
    reply: ReplyMethods
}

export type ExecuteFunctionPublic<ExecutePropsType = {}> = (client:  PinguClientBase, props: ExecuteFunctionPropsPublic, extra?: ExecutePropsType) => ReturnType
export type ExecuteFunction<
    Client = PinguClientBase,
    ExtraProps = ClassicCommandParams & InteractionCommandParams,
    ExecutePropsType = {}
> = (client: Client, props: ExecuteFunctionProps<Client> & ExtraProps, extra?: ExecutePropsType) => ReturnType;

export interface BaseCommandData {
    usage?: string;
    permissions?: PermissionString[];
    examples?: string[];
    aliases?: string[];
}
export function throwInvalidTypeError<
    CommandData extends BaseCommandData, 
    Prop extends keyof CommandData
>(prop: Prop, cmdName: string, type: 'array' | 'string' | 'boolean' | 'number') {
    throw new Error(`"${prop}" for ${cmdName} is not typeof ${type}!`)
}

interface ExecuteHandler<T extends CommandTypes> extends ReplyMethods {
    execute: (params: CommandTypesParams[T], execute: ExecuteFunctionPublic) => ReturnType
}

export interface ExecuteFunctions<
    Client = PinguClientBase,
    ClassicParams = ClassicCommandParams, 
    SlashParams = InteractionCommandParams,
    ExecutePropsType = {},
    ExtraProps = ClassicParams & SlashParams,
> {
    classic: (params: ClassicParams, execute: ExecuteFunctionPublic<ExecutePropsType>) => ReturnType,
    execute: ExecuteFunction<Client, ExtraProps, ExecutePropsType>
}

export default class PinguCommandBase<ExecutePropsType = {}> extends PinguHandler {
    constructor(name: string, description: string, data: BaseCommandData, 
        slashCommandBuilder: PinguSlashCommandBuilder,
        executes: ExecuteFunctions<PinguClientBase, ClassicCommandParams, InteractionCommandParams, {}>
    ) {
        super(name);
        this.description = description;
        this.builder = slashCommandBuilder;

        const { permissions, usage, aliases, examples } = data;
        this.permissions = permissions ?? [];
        this.usage = usage ?? '';
        this.aliases = aliases ?? [];
        this.examples = examples?.length ? examples : [''];

        if (this.permissions && !this.permissions.push) throwInvalidTypeError('permissions', name, 'array');
        if (this.usage && typeof this.usage != 'string') throwInvalidTypeError('usage', name, 'string');
        if (this.examples && !this.examples.push) throwInvalidTypeError('examples', name, 'array');
        if (this.aliases && !this.aliases.push) throwInvalidTypeError('aliases', name, 'array');


        const { classic, execute } = executes;
        if (classic) this._executeClassic = classic;
        if (execute) this._execute = execute;
    }

    protected _logError(client: PinguClientBase, functionName: string) {
        return client.log('error', `${functionName} not defined for command ${this.name}`)
    }
    protected _execute(client: PinguClientBase, props: ExecuteFunctionProps<PinguClientBase>, extra?: ExecutePropsType | {}): ReturnType {
        return this._logError(client, `_execute`);
    }
    private _executeClassic(params: ClassicCommandParams, execute: ExecuteFunctionPublic): ReturnType {
        return this._logError(params.client, `_executeClassic`);
    }

    public description: string;
    public usage: string;
    public permissions: PermissionString[];
    public examples: string[];
    public aliases: string[];

    public builder: PinguSlashCommandBuilder;

    public execute<T extends CommandTypes>(type: T, params: CommandTypesParams[T]) {
        const pc = params as ClassicCommandParams;
        const ps = params as InteractionCommandParams;

        const handler = new Collection<CommandTypes, ExecuteHandler<T>>([
            ['Classic', {
                execute: this._executeClassic,
                replyPublic: pc.message.reply,
                replySemiPrivate: pc.message.reply,
                replyPrivate: pc.message.author.send,
                followUp: pc.message.channel.send,
                replyReturn: pc.message.reply
            }], [
                'Interaction', {
                    execute: (() => {
                        const subCommand = ps.interaction.options.getSubcommand();
                        if (subCommand) return (this.builder.subCommands.find(cmd => cmd.name == subCommand))?.onInteraction;
                        return null;
                    })(),
                    replyPublic: ps.interaction.reply,
                    replySemiPrivate: ps.interaction.replyPrivate,
                    replyPrivate: ps.interaction.replyPrivate,
                    followUp: ps.interaction.followUp,
                    replyReturn: ps.interaction.options.getBoolean('private') ? ps.interaction.replyPrivate : ps.interaction.reply
                }
            ]
        ]).get(type);


        if (!handler) return params.client.log('error', `Invalid execute type "${type}" for command ${this.name}`);

        const { execute, replyPublic, replySemiPrivate, replyPrivate, followUp, replyReturn } = handler;
        return execute(params, (client, { guild, executor }, extra) => this._execute(client, {
            executor, guild, ...params, reply: { replyPublic, replySemiPrivate, replyPrivate, followUp, replyReturn },
            replyPublic, replySemiPrivate, replyPrivate, followUp, replyReturn 
        }, extra));
    }
}