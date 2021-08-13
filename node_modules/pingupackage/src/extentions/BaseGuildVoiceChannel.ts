import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { BaseGuildVoiceChannel } from "discord.js";

declare module 'discord.js' {
    interface BaseGuildVoiceChannel {
        join(): VoiceConnection
    }
}

BaseGuildVoiceChannel.prototype.join = function(this: BaseGuildVoiceChannel) {
    if (!this.joinable) throw new Error(`Voice channel is not joinable!`);

    return joinVoiceChannel({
        channelId: this.id,
        guildId: this.guildId,
        adapterCreator: this.guild.voiceAdapterCreator
    });
}