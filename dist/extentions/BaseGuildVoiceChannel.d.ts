import { VoiceConnection } from "@discordjs/voice";
declare module 'discord.js' {
    interface BaseGuildVoiceChannel {
        join(): VoiceConnection;
    }
}
