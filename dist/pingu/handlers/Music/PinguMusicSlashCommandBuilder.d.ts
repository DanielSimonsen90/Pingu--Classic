import PinguSlashCommandBuilderBase, { Option, ExtraOptions } from "../Command/Slash/PinguSlashCommandBuilderBase";
export default class PinguMusicSlashCommandBuilder extends PinguSlashCommandBuilderBase {
    constructor(name: string, description: string, options: Option[], extra: ExtraOptions);
    queueRequired: boolean;
}
