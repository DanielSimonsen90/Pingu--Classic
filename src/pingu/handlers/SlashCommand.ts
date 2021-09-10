import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandOptionBase } from "@discordjs/builders/dist/interactions/slashCommands/mixins/CommandOptionBase";

class SlashCommandOption {
    constructor(
        public name: string,
        public description: string,
        public required = false
    ) {}
}

interface SlashCommandData {
    name: string,
    description: string,
    defaultPermission?: boolean,
    options?: SlashCommandOption[]
}

export default class SlashCommand extends SlashCommandBuilder {
    constructor(data: SlashCommandData) {
        super();

        const { name, description, defaultPermission, options } = data;
        this.setName(name);
        this.setDescription(description);
        this.setDefaultPermission(defaultPermission ?? true);
        

    }
}

const test = new SlashCommand({
    name: 'test',
    description: 'This is a cool test',
    options: [
        
    ]
})
