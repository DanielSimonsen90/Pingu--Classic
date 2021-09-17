import { PermissionString, Message, MessagePayload, ReplyMessageOptions, InteractionReplyOptions, User, GuildMember, CommandInteraction } from "discord.js";
import PinguHandler from "../PinguHandler";
import PinguSlashCommandBuilder, { InteractionCommandParams } from "./Slash/PinguSlashCommandBuilder";
import Arguments from "../../../helpers/Arguments";
import PinguClientBase from "../../client/PinguClientBase";
import { APIMessage } from "discord-api-types";
import PinguActionRow from "../../collection/PinguActionRow";
/** Used for returning execute functions */
export declare type ReturnType = Promise<Message | APIMessage>;
/** All the common properties from commands */
declare type CommandPropsCombined = Message | CommandInteraction;
/** Properties from command caller */
declare type CommandProps = Omit<CommandPropsCombined, 'member'> & {
    executor: User;
    member: GuildMember;
};
/** When returning provided execute function in command handler, these properties should be returned with it */
interface ExecuteFunctionPropsPublic {
    commandProps: CommandProps;
}
/** An execute function *must* have these properties */
export interface CommandParamsBase<Client = PinguClientBase> extends ExecuteFunctionPropsPublic {
    client: Client;
}
/** A classic v12 command handler must have these properties */
export interface ClassicCommandParams<Client = PinguClientBase> extends CommandParamsBase<Client> {
    message?: Message;
    args?: Arguments;
}
/** Methods of handling commands */
interface CommandTypesParams {
    Interaction: InteractionCommandParams;
    Classic: ClassicCommandParams;
}
/** Interaction | Classic */
export declare type CommandTypes = keyof CommandTypesParams;
/** Acceptable types for replying to command */
export declare type ReplyOptions = string | MessagePayload | ReplyMessageOptions | (InteractionReplyOptions & {
    fetchReply: true;
});
/** All kinds of reply methods */
export interface ReplyMethods {
    /** Replies so all eyes can see response */
    replyPublic: (options: ReplyOptions) => ReturnType;
    /** Either replies public or replies private, depending on what's most appropriate */
    replySemiPrivate: (options: ReplyOptions) => ReturnType;
    /** Replies private */
    replyPrivate: (options: ReplyOptions) => ReturnType;
    /** Follow up for @see replyReturn */
    followUp: (options: ReplyOptions) => ReturnType;
    /** Final reply - either replies public or private, depending on allowPrivate option */
    replyReturn: (options: ReplyOptions) => ReturnType;
    allowPrivate?: boolean;
}
/** Properties included in execute function */
export interface ExecuteFunctionProps<Client = PinguClientBase> extends ExecuteFunctionPropsPublic, CommandParamsBase<Client>, ReplyMethods {
    reply: ReplyMethods;
    components: Map<string, PinguActionRow>;
}
/** Execute function when calling in execute handlers */
export declare type ExecuteFunctionPublic<ExecutePropsType = {}> = (client: PinguClientBase, props: ExecuteFunctionPropsPublic['commandProps'], extra?: ExecutePropsType) => ReturnType;
/** Actual execute function */
export declare type ExecuteFunction<Client = PinguClientBase, ExtraProps = ClassicCommandParams & InteractionCommandParams, ExecutePropsType = {}> = (client: Client, props: ExecuteFunctionProps<Client> & ExtraProps, extra?: ExecutePropsType) => ReturnType;
/** Default data for a command */
export interface BaseCommandData {
    usage?: string;
    permissions?: PermissionString[];
    examples?: string[];
    aliases?: string[];
    components?: PinguActionRow[];
}
/** Propertytype invalid error */
export declare function throwInvalidTypeError<CommandData extends BaseCommandData, Prop extends keyof CommandData>(prop: Prop, cmdName: string, type: 'array' | 'string' | 'boolean' | 'number'): void;
/** All execute functions */
export interface ExecuteFunctions<Client = PinguClientBase, ClassicParams = ClassicCommandParams, SlashParams = InteractionCommandParams, ExecutePropsType = {}, ExtraProps = ClassicParams & SlashParams> {
    classic: (params: ClassicParams, execute: ExecuteFunctionPublic<ExecutePropsType>) => ReturnType;
    execute: ExecuteFunction<Client, ExtraProps, ExecutePropsType>;
}
export default class PinguCommandBase<ExecutePropsType = {}> extends PinguHandler {
    constructor(name: string, description: string, data: BaseCommandData, slashCommandBuilder: PinguSlashCommandBuilder, executes: ExecuteFunctions<PinguClientBase, ClassicCommandParams, InteractionCommandParams, ExecutePropsType>);
    protected _logError(client: PinguClientBase, functionName: string): Promise<Message>;
    protected _execute(client: PinguClientBase, props: ExecuteFunctionProps<PinguClientBase>, extra?: ExecutePropsType | {}): ReturnType;
    private _executeClassic;
    description: string;
    usage: string;
    permissions: PermissionString[];
    examples: string[];
    aliases: string[];
    builder: PinguSlashCommandBuilder;
    components: Map<string, PinguActionRow>;
    execute<T extends CommandTypes>(type: T, params: CommandTypesParams[T]): ReturnType;
}
export {};
