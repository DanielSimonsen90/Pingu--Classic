const { Client, VoiceState, MessageEmbed } = require("discord.js");
const { PinguEvents } = require("../../PinguPackage");

module.exports = {
    name: 'events: voiceStateUpdate',
    /**@param {{preState: VoiceState, state: VoiceState}}*/
    async setContent({ preState, state }) {
        return module.exports.content = await GetEmbed();

        async function GetEmbed() {
            let userTag = state.member.user.tag;
            let forceDisconnectExecutor = await PinguEvents.GetAuditLogs(state.guild, 'MEMBER_DISCONNECT');
            let forceMoveExecutor = await PinguEvents.GetAuditLogs(state.guild, 'MEMBER_MOVE');
            let forceDeaf = await PinguEvents.GetAuditLogs(state.guild, 'MEMBER_UPDATE', 'deaf', state.member.user);
            let forceMute = await PinguEvents.GetAuditLogs(state.guild, 'MEMBER_UPDATE', 'mute', state.member.user);

            if (state.channel && !preState.channel) return new MessageEmbed()
                .setDescription(PinguEvents.SetDescription('Connected', `**${userTag}** connected to ${state.channel}`))
                .setColor(PinguEvents.Colors.Create);
            else if (!state.channel && preState.channel) return new MessageEmbed()
                .setDescription(PinguEvents.SetDescription('Disconnected', `**${userTag}** disconnected from ${preState.channel} ${(forceDisconnectExecutor != PinguEvents.noAuditLog ? `by ${forceDisconnectExecutor}` : "")}`))
                .setColor(PinguEvents.Colors.Delete);
            else if (state.channel != preState.channel) return new MessageEmbed()
                .setDescription(PinguEvents.SetDescription('Move', `Moved from **${preState.channel}** to **${state.channel}** ${(forceMoveExecutor != PinguEvents.noAuditLog ? `by **${forceMoveExecutor}**` : "")}`))
                .setColor(PinguEvents.Colors.Update);
            else if (state.selfDeaf != preState.selfDeaf) return new MessageEmbed()
                .setDescription(PinguEvents.SetDescription('Deaf', `**${userTag}** ${(state.selfDeaf ? '' : 'un')}deafened themselves`))
                .setColor(PinguEvents.Colors.Update);
            else if (state.selfMute != preState.selfMute) return new MessageEmbed()
                .setDescription(PinguEvents.SetDescription('Mute', `**${userTag}** ${(state.selfMute ? '' : 'un')}muted themselves`))
                .setColor(PinguEvents.Colors.Update);
            else if (state.serverDeaf != preState.serverDeaf) return new MessageEmbed()
                .setDescription(PinguEvents.SetDescription('Deaf', `**${userTag}** was ${(state.serverDeaf ? '' : 'un')}deafened by **${forceDeaf}**`))
                .setColor(state.serverDeaf ? PinguEvents.Colors.Delete : PinguEvents.Colors.Create);
            else if (state.serverMute != preState.serverMute) return new MessageEmbed()
                .setDescription(PinguEvents.SetDescription('Mute', `**${userTag}** was ${(state.serverMute ? '' : 'un')}muted by **${forceMute}**`))
                .setColor(state.serverMute ? PinguEvents.Colors.Delete : PinguEvents.Colors.Create);
            else if (state.streaming != preState.streaming) return new MessageEmbed()
                .setDescription(PinguEvents.SetDescription('Streaming', `**${userTag}** ${(state.streaming ? 'started' : 'stopped')} streaming`))
                .setColor(state.streaming ? PinguEvents.Colors.Create : PinguEvents.Colors.Delete);
            else if (state.selfVideo != preState.selfVideo) return new MessageEmbed()
                .setDescription(PinguEvents.SetDescription('Video', `**${userTag}** ${(state.selfVideo ? 'started' : 'stopped')} being a cam-girl`))
                .setColor(state.selfVideo ? PinguEvents.Colors.Create : PinguEvents.Colors.Delete);
            return new MessageEmbed().setDescription(PinguEvents.UnknownUpdate(preState, state));
        }
    },
    /**@param {Client} client
     @param {{preState: VoiceState, state: VoiceState}}*/
    execute(client, { preState, state }) {

    }
}