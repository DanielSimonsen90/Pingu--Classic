import { Collection, EmojiResolvable, Message, MessageEmbed, MessageAttachment } from "discord.js";
import { ReactionRole } from "../pingu";

declare module 'discord.js' {
    interface Message {
        reactioRoles(): Collection<EmojiResolvable, ReactionRole>;

        editEmbeds(...embeds: MessageEmbed[]): Promise<this>;
        editFiles(...files: MessageAttachment[]): Promise<this>;
    }
}

Message.prototype.reactioRoles = function(this: Message) {
    try {
        const { guild } = this;
        if (!guild) throw { reason: 'No guild' }
    
        const pGuild = guild.pGuild();
        if (!pGuild) throw { reason: 'No pGuild' }

        return pGuild.settings.reactionRoles.reduce((result, rr) => {
            const emoji = guild.emojis.cache.find(e => e.name === rr.emoteName) || rr.emoteName;
            return result.set(emoji, rr);
        }, new Collection<EmojiResolvable, ReactionRole>())
    } catch (err) {
        if (err.reason) return new Collection();
        throw err;
    }
}

Message.prototype.editEmbeds = function(this: Message, ...embeds: MessageEmbed[]) {
    return this.edit({ embeds })
}
Message.prototype.editFiles = function(this: Message, ...files: MessageAttachment[]) {
    return this.edit({ files })
}