import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { APIMessage } from "discord-api-types";
import { Message } from "discord.js";
import PinguClientBase from "../../../client/PinguClientBase";
import { ExecuteFunctionPublic } from "../PinguCommandBase";
import { InteractionCommandParams, SlashCommandOption } from "./PinguSlashCommandBuilder";

export interface SubCommandExtraOptions {
    allowPrivate?: boolean
}
export interface SubCommandConstructionData<Client = PinguClientBase, ExecutePropsType = {}, AdditionalParams = {}> {
    options?: SlashCommandOption[],
    extra?: SubCommandExtraOptions,
    onInteraction?: (params: InteractionCommandParams<Client> & AdditionalParams, execute: ExecuteFunctionPublic<ExecutePropsType>) => Promise<Message | APIMessage>
}

export class PinguSlashCommandSub<
    Client extends PinguClientBase = PinguClientBase,
    ExecutePropsType = {},
    AdditionalParams = {}
> extends SlashCommandSubcommandBuilder {
    constructor(name: string, description: string, data: SubCommandConstructionData<Client, ExecutePropsType, AdditionalParams>) {
        super();

        const options = data.options ?? [];
        const extra = data.extra ?? { allowPrivate: true };

        const { allowPrivate } = extra;

        this.setName(name)
        this.setDescription(description)

        if (allowPrivate ?? true) options.push(SlashCommandOption('Boolean', 'private', 'Send response privately'));

        options.forEach(({ name, description, required, choices, type }) => 
        this[`add${type}Option`](o => o
            .setName(name)
            .setDescription(description)
            .setRequired(required)
            .addChoices?.(...choices)
        ));
    }

    public onInteraction(params: InteractionCommandParams<Client> & AdditionalParams, execute: ExecuteFunctionPublic<ExecutePropsType>): Promise<Message | APIMessage> {
        return params.client.log('error', `onInteraction not defined for ${this.name}`);
    }
}

export default PinguSlashCommandSub;