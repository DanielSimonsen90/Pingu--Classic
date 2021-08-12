import { BaseGuildTextChannel, DMChannel, MessageEmbed, ThreadChannel, PartialTextBasedChannelFields, MessageAttachment } from "discord.js";

declare module 'discord.js' {
    interface PartialTextBasedChannelFields {
        sendEmbeds(...embeds: MessageEmbed[]): Promise<Message>
        sendFiles(...files: MessageAttachment[]): Promise<Message>
    }
}

//#region sendEmbed
function sendEmbed(this: PartialTextBasedChannelFields, ...embeds: MessageEmbed[]) {
    return this.send({ embeds })
}
BaseGuildTextChannel.prototype.sendEmbeds = sendEmbed;
DMChannel.prototype.sendEmbeds = sendEmbed;
ThreadChannel.prototype.sendEmbeds = sendEmbed;
//#endregion

//#region sendFiles
function sendFiles(this: PartialTextBasedChannelFields, ...files: MessageAttachment[]) {
    return this.send({ files });
}
BaseGuildTextChannel.prototype.sendFiles = sendFiles;
DMChannel.prototype.sendFiles = sendFiles;
ThreadChannel.prototype.sendFiles = sendFiles;
//#endregion