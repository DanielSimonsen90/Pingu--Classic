import { PermissionString, Message, Guild, MessagePayload, ReplyMessageOptions, InteractionReplyOptions, User } from "discord.js";
import PinguHandler from "../PinguHandler";
import PinguSlashCommandBuilder, { InteractionCommandParams } from "./Slash/PinguSlashCommandBuilder";
import Arguments from "../../../helpers/Arguments";
import PinguClientBase from "../../client/PinguClientBase";
import { APIMessage } from "discord-api-types";
declare type ReturnType = Promise<Message | APIMessage>;
export interface CommandParamsBase<Client = PinguClientBase> {
    client: Client;
    executor: User;
    guild: Guild;
}
export interface ClassicCommandParams<Client = PinguClientBase> extends CommandParamsBase<Client> {
    message?: Message;
    args?: Arguments;
}
interface CommandTypesParams {
    Interaction: InteractionCommandParams;
    Classic: ClassicCommandParams;
}
export declare type CommandTypes = keyof CommandTypesParams;
declare type ReplyOptions = string | MessagePayload | ReplyMessageOptions | (InteractionReplyOptions & {
    fetchReply: true;
});
declare type ExecuteFunctionPropsPublic = {
    guild: Guild;
    executor: User;
};
export interface ReplyMethods {
    replyPublic: (options: ReplyOptions) => ReturnType;
    replySemiPrivate: (options: ReplyOptions) => ReturnType;
    replyPrivate: (options: ReplyOptions) => ReturnType;
    followUp: (options: ReplyOptions) => ReturnType;
    replyReturn: (options: ReplyOptions) => ReturnType;
}
export interface ExecuteFunctionProps<Client = PinguClientBase> extends CommandParamsBase<Client>, ReplyMethods {
    executor: User;
    reply: ReplyMethods;
}
export declare type ExecuteFunctionPublic<ExecutePropsType = {}> = (client: PinguClientBase, props: ExecuteFunctionPropsPublic, extra?: ExecutePropsType) => ReturnType;
export declare type ExecuteFunction<Client = PinguClientBase, ExtraProps = ClassicCommandParams & InteractionCommandParams, ExecutePropsType = {}> = (client: Client, props: ExecuteFunctionProps<Client> & ExtraProps, extra?: ExecutePropsType) => ReturnType;
export interface BaseCommandData {
    usage?: string;
    permissions?: PermissionString[];
    examples?: string[];
    aliases?: string[];
}
export declare function throwInvalidTypeError<CommandData extends BaseCommandData, Prop extends keyof CommandData>(prop: Prop, cmdName: string, type: 'array' | 'string' | 'boolean' | 'number'): void;
export interface ExecuteFunctions<Client = PinguClientBase, ClassicParams = ClassicCommandParams, SlashParams = InteractionCommandParams, ExecutePropsType = {}, ExtraProps = ClassicParams & SlashParams> {
    classic: (params: ClassicParams, execute: ExecuteFunctionPublic<ExecutePropsType>) => ReturnType;
    execute: ExecuteFunction<Client, ExtraProps, ExecutePropsType>;
}
export default class PinguCommandBase<ExecutePropsType = {}> extends PinguHandler {
    constructor(name: string, description: string, data: BaseCommandData, slashCommandBuilder: PinguSlashCommandBuilder, executes: ExecuteFunctions<PinguClientBase, ClassicCommandParams, InteractionCommandParams, {}>);
    protected _logError(client: PinguClientBase, functionName: string): Promise<Message>;
    protected _execute(client: PinguClientBase, props: ExecuteFunctionProps<PinguClientBase>, extra?: ExecutePropsType | {}): ReturnType;
    private _executeClassic;
    description: string;
    usage: string;
    permissions: PermissionString[];
    examples: string[];
    aliases: string[];
    builder: PinguSlashCommandBuilder;
    execute<T extends CommandTypes>(type: T, params: CommandTypesParams[T]): ReturnType;
}
export {};
