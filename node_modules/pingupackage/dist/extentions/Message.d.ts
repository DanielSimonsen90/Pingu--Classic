import { ReactionRole } from "../pingu";
declare module 'discord.js' {
    interface Message {
        reactioRoles(): Collection<EmojiResolvable, ReactionRole>;
        editEmbeds(...embeds: MessageEmbed[]): Promise<this>;
        editFiles(...files: MessageAttachment[]): Promise<this>;
    }
}
