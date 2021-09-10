import { SlashCommandBuilder } from "@discordjs/builders";
declare class SlashCommandOption {
    name: string;
    description: string;
    required: boolean;
    constructor(name: string, description: string, required?: boolean);
}
interface SlashCommandData {
    name: string;
    description: string;
    defaultPermission?: boolean;
    options?: SlashCommandOption[];
}
export default class SlashCommand extends SlashCommandBuilder {
    constructor(data: SlashCommandData);
}
export {};
