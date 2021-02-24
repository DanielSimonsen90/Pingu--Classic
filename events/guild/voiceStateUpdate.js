const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('voiceStateUpdate', 
    async function setContent(preState, state) {
        let embed = await GetEmbed();
        return module.exports.content = embed.description ? embed : null;

        async function GetEmbed() {
            let userTag = state.member.user.tag;
            let forceDisconnectExecutor = await PinguEvent.GetAuditLogs(state.guild, 'MEMBER_DISCONNECT');
            let forceMoveExecutor = await PinguEvent.GetAuditLogs(state.guild, 'MEMBER_MOVE');
            let forceDeaf = await PinguEvent.GetAuditLogs(state.guild, 'MEMBER_UPDATE', 'deaf', state.member.user);
            let forceMute = await PinguEvent.GetAuditLogs(state.guild, 'MEMBER_UPDATE', 'mute', state.member.user);

            if (state.channel && !preState.channel) return new MessageEmbed()
                .setDescription(PinguEvent.SetDescription('Connected', `**${userTag}** connected to ${state.channel}`))
                .setColor(PinguEvent.Colors.Create);
            else if (!state.channel && preState.channel) return new MessageEmbed()
                .setDescription(PinguEvent.SetDescription('Disconnected', `**${userTag}** disconnected from ${preState.channel} ${(forceDisconnectExecutor != PinguEvent.noAuditLog ? `by ${forceDisconnectExecutor}` : "")}`))
                .setColor(PinguEvent.Colors.Delete);
            else if (state.channel != preState.channel) return new MessageEmbed()
                .setDescription(PinguEvent.SetDescription('Move', `Moved from **${preState.channel}** to **${state.channel}** ${(forceMoveExecutor != PinguEvent.noAuditLog ? `by **${forceMoveExecutor}**` : "")}`))
                .setColor(PinguEvent.Colors.Update);
            else if (state.selfDeaf != preState.selfDeaf) return new MessageEmbed()
                .setDescription(PinguEvent.SetDescription('Deaf', `**${userTag}** ${(state.selfDeaf ? '' : 'un')}deafened themselves`))
                .setColor(PinguEvent.Colors.Update);
            else if (state.selfMute != preState.selfMute) return new MessageEmbed()
                .setDescription(PinguEvent.SetDescription('Mute', `**${userTag}** ${(state.selfMute ? '' : 'un')}muted themselves`))
                .setColor(PinguEvent.Colors.Update);
            else if (state.serverDeaf != preState.serverDeaf) return new MessageEmbed()
                .setDescription(PinguEvent.SetDescription('Deaf', `**${userTag}** was ${(state.serverDeaf ? '' : 'un')}deafened by **${forceDeaf}**`))
                .setColor(state.serverDeaf ? PinguEvent.Colors.Delete : PinguEvent.Colors.Create);
            else if (state.serverMute != preState.serverMute) return new MessageEmbed()
                .setDescription(PinguEvent.SetDescription('Mute', `**${userTag}** was ${(state.serverMute ? '' : 'un')}muted by **${forceMute}**`))
                .setColor(state.serverMute ? PinguEvent.Colors.Delete : PinguEvent.Colors.Create);
            else if (state.streaming != preState.streaming) return new MessageEmbed()
                .setDescription(PinguEvent.SetDescription('Streaming', `**${userTag}** ${(state.streaming ? 'started' : 'stopped')} streaming`))
                .setColor(state.streaming ? PinguEvent.Colors.Create : PinguEvent.Colors.Delete);
            else if (state.selfVideo != preState.selfVideo) return new MessageEmbed()
                .setDescription(PinguEvent.SetDescription('Video', `**${userTag}** ${(state.selfVideo ? 'started' : 'stopped')} being a cam-girl`))
                .setColor(state.selfVideo ? PinguEvent.Colors.Create : PinguEvent.Colors.Delete);
            return new MessageEmbed().setDescription(PinguEvent.UnknownUpdate(preState, state));
        }
    }
);