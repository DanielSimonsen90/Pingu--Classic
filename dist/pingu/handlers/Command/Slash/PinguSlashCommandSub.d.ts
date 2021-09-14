import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { APIMessage } from "discord-api-types";
import { Message } from "discord.js";
import PinguClientBase from "../../../client/PinguClientBase";
import { ExecuteFunctionPublic } from "../PinguCommandBase";
import { InteractionCommandParams, SlashCommandOption } from "./PinguSlashCommandBuilder";
export interface SubCommandExtraOptions {
    allowPrivate?: boolean;
}
export interface SubCommandConstructionData<Client = PinguClientBase, ExecutePropsType = {}, AdditionalParams = {}> {
    options?: SlashCommandOption[];
    extra?: SubCommandExtraOptions;
    onInteraction?: (params: InteractionCommandParams<Client> & AdditionalParams, execute: ExecuteFunctionPublic<ExecutePropsType>) => Promise<Message | APIMessage>;
}
export declare class PinguSlashCommandSub<Client extends PinguClientBase = PinguClientBase, ExecutePropsType = {}, AdditionalParams = {}> extends SlashCommandSubcommandBuilder {
    constructor(name: string, description: string, data: SubCommandConstructionData<Client, ExecutePropsType, AdditionalParams>);
    onInteraction(params: InteractionCommandParams<Client> & AdditionalParams, execute: ExecuteFunctionPublic<ExecutePropsType>): Promise<Message | APIMessage>;
}
export default PinguSlashCommandSub;
