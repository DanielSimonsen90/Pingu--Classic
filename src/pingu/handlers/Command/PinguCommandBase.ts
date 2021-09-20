import { PermissionString, Message, Collection, Guild, MessagePayload, ReplyMessageOptions, InteractionReplyOptions, User, MessageComponentType, GuildMember, CommandInteraction } from "discord.js";
import PinguHandler from "../PinguHandler";
import PinguSlashCommandBuilder, { InteractionCommandParams } from "./Slash/PinguSlashCommandBuilder";

import Arguments from "../../../helpers/Arguments";
import PinguClientBase from "../../client/PinguClientBase";
import { APIMessage } from "discord-api-types";
import PinguActionRow from "../../collection/PinguActionRow";

/** Used for returning execute functions */
export type ReturnType = Promise<Message | APIMessage>;

/** All the common properties from commands */
type CommandPropsCombined = Message | CommandInteraction;
/** Properties from command caller */
export type CommandProps = Omit<CommandPropsCombined, 'member'> & {
    executor: User
    member: GuildMember
}
/** When returning provided execute function in command handler, these properties should be returned with it */
interface ExecuteFunctionPropsPublic { 
    commandProps: CommandProps
}

/** An execute function *must* have these properties */
export interface CommandParamsBase<Client = PinguClientBase> extends ExecuteFunctionPropsPublic {
    client: Client,
}
/** A classic v12 command handler must have these properties */
export interface ClassicCommandParams<Client = PinguClientBase> extends CommandParamsBase<Client>  {
    message?: Message,
    args?: Arguments,
}

/** Methods of handling commands */
interface CommandTypesParams {
    Interaction: InteractionCommandParams;
    Classic: ClassicCommandParams;
}
/** Interaction | Classic */
export type CommandTypes = keyof CommandTypesParams

/** Acceptable types for replying to command */
export type ReplyOptions = string | MessagePayload | ReplyMessageOptions | (InteractionReplyOptions & { fetchReply: true });

/** All kinds of reply methods */
export interface ReplyMethods {
    /** Replies so all eyes can see response */
    replyPublic: (options: ReplyOptions) => ReturnType,
    /** Either replies public or replies private, depending on what's most appropriate */
    replySemiPrivate: (options: ReplyOptions) => ReturnType,
    /** Replies private */
    replyPrivate: (options: ReplyOptions) => ReturnType,
    /** Follow up for @see replyReturn */
    followUp: (options: ReplyOptions) => ReturnType,
    /** Final reply - either replies public or private, depending on allowPrivate option */
    replyReturn: (options: ReplyOptions) => ReturnType,
    allowPrivate?: boolean
}
/** Properties included in execute function */
export interface ExecuteFunctionProps<Client = PinguClientBase> extends 
    ExecuteFunctionPropsPublic, CommandParamsBase<Client>, ReplyMethods 
{
    reply: ReplyMethods,
    components: Map<string, PinguActionRow>
}

/** Execute function when calling in execute handlers */
export type ExecuteFunctionPublic<ExecutePropsType = {}> = (client:  PinguClientBase, props: ExecuteFunctionPropsPublic['commandProps'], extra?: ExecutePropsType) => ReturnType
/** Actual execute function */
export type ExecuteFunction<
    Client = PinguClientBase,
    ExtraProps = ClassicCommandParams & InteractionCommandParams,
    ExecutePropsType = {}
> = (client: Client, props: ExecuteFunctionProps<Client> & ExtraProps, extra?: ExecutePropsType) => ReturnType;
/** Default data for a command */
export interface BaseCommandData {
    usage?: string;
    permissions?: PermissionString[];
    examples?: string[];
    aliases?: string[];
    components?: PinguActionRow[]
}
/** Propertytype invalid error */
export function throwInvalidTypeError<
    CommandData extends BaseCommandData, 
    Prop extends keyof CommandData
>(prop: Prop, cmdName: string, type: 'array' | 'string' | 'boolean' | 'number') {
    throw new Error(`"${prop}" for ${cmdName} is not typeof ${type}!`)
}

/** Execute handler for map in public execute function */
interface ExecuteHandler<T extends CommandTypes> extends ReplyMethods {
    execute: (params: CommandTypesParams[T], execute: ExecuteFunctionPublic) => ReturnType
}
/** All execute functions */
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
        executes: ExecuteFunctions<PinguClientBase, ClassicCommandParams, InteractionCommandParams, ExecutePropsType>
    ) {
        super(name);
        this.description = description;
        this.builder = slashCommandBuilder;

        const { permissions, usage, aliases, examples, components } = data;
        this.components = components?.reduce((map, row) => map.set(row.name, row), new Map()) ?? new Map();
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
    public components: Map<string, PinguActionRow>;

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
                replyReturn: pc.message.reply,
                allowPrivate: false
            }], [
            'Interaction', {
                execute: (() => {
                    const subCommand = ps.interaction.options.getSubcommand();
                    if (subCommand) return (this.builder.subCommands.find(cmd => cmd.name == subCommand))?.onInteraction;
                    return this.builder.onInteraction;
                })(),
                replyPublic: ps.interaction.reply,
                replySemiPrivate: ps.interaction.replyPrivate,
                replyPrivate: ps.interaction.replyPrivate,
                followUp: ps.interaction.followUp,
                replyReturn: ps.interaction.options.getBoolean('private') ? ps.interaction.replyPrivate : ps.interaction.reply,
                allowPrivate: ps.interaction.options.getBoolean('private')
            }
        ]]).get(type);


        if (!handler) return params.client.log('error', `Invalid execute type "${type}" for command ${this.name}`);

        const { execute, replyPublic, replySemiPrivate, replyPrivate, followUp, replyReturn, allowPrivate } = handler;
        return execute(params, (client, commandProps, extra) => this._execute(client, {
            commandProps, ...params, reply: { replyPublic, replySemiPrivate, replyPrivate, followUp, replyReturn, allowPrivate },
            replyPublic, replySemiPrivate, replyPrivate, followUp, replyReturn, allowPrivate,
            components: this.components
        }, extra));
    }
}