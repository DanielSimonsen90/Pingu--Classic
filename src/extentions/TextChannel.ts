import { BaseGuildTextChannel, DMChannel, MessageEmbed, ThreadChannel, PartialTextBasedChannelFields, MessageAttachment, Message } from "discord.js";

declare module 'discord.js' {
    interface PartialTextBasedChannelFields {
        sendEmbed(...embeds: MessageEmbed[]): Promise<Message>
        sendFiles(...files: MessageAttachment[]): Promise<Message>
    }
}

//#region sendEmbed
function sendEmbed(this: PartialTextBasedChannelFields, ...embeds: MessageEmbed[]) {
    return this.send({ embeds: [ ...embeds ] })
}
BaseGuildTextChannel.prototype.sendEmbed = sendEmbed;
DMChannel.prototype.sendEmbed = sendEmbed;
ThreadChannel.prototype.sendEmbed = sendEmbed;
//#endregion

//#region sendFiles
function sendFiles(this: PartialTextBasedChannelFields, ...files: MessageAttachment[]) {
    return this.send({ files: [ ...files ] });
}
BaseGuildTextChannel.prototype.sendFiles = sendFiles;
DMChannel.prototype.sendFiles = sendFiles;
ThreadChannel.prototype.sendFiles = sendFiles;
//#endregion