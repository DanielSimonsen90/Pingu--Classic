declare module 'discord.js' {
    interface PartialTextBasedChannelFields {
        sendEmbeds(...embeds: MessageEmbed[]): Promise<Message>;
        sendFiles(...files: MessageAttachment[]): Promise<Message>;
    }
}
export {};
