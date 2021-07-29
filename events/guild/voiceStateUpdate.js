const { MessageEmbed } = require("discord.js");
const { PinguEvent, PinguLibrary } = require("PinguPackage");

module.exports = new PinguEvent('voiceStateUpdate', 
    async function setContent(preState, state) {
        const { SetDescription, Colors } = PinguEvent;
        const { Create, Update, Delete } = Colors;
        let embed = await GetEmbed();
        module.exports.content = embed.description ? embed : null;

        async function GetEmbed() {
            let userTag = state.member?.user.tag;
            if (!userTag) return;

            const { guild, member, client } = state;

            const [forceDisconnectExecutor, forceMoveExecutor, forceDeaf, forceMute] = await Promise.all([
                PinguEvent.GetAuditLogs(guild, 'MEMBER_DISCONNECT'),
                PinguEvent.GetAuditLogs(guild, 'MEMBER_MOVE'),
                PinguEvent.GetAuditLogs(guild, 'MEMBER_UPDATE', 'deaf', member.user),
                PinguEvent.GetAuditLogs(guild, 'MEMBER_UPDATE', 'mute', member.user)
            ]);

            if (state.channel && !preState.channel) return defineEmbed("Connected", `**${userTag}** connected to ${state.channel}`, Create );
            else if (!state.channel && preState.channel) return defineEmbed('Disconnected', `**${userTag}** disconnected from ${preState.channel} ${
                    (forceDisconnectExecutor != PinguEvent.noAuditLog ? `by ${forceDisconnectExecutor}` : "")
                }`, Delete
            );
            else if (state.channel != preState.channel) return defineEmbed('Move', `Moved from **${preState.channel}** to **${state.channel}** ${
                    (forceMoveExecutor != PinguEvent.noAuditLog ? `by **${forceMoveExecutor}**` : "")
                }`, Update
            );
            else if (state.selfDeaf != preState.selfDeaf) return defineEmbed('Deaf', `**${userTag}** ${(state.selfDeaf ? '' : 'un')}deafened themselves`, Update);
            else if (state.selfMute != preState.selfMute) return defineEmbed('Mute', `**${userTag}** ${(state.selfMute ? '' : 'un')}muted themselves`, Update);
            else if (state.serverDeaf != preState.serverDeaf) return defineEmbed('Deaf', `**${userTag}** was ${(state.serverDeaf ? '' : 'un')}deafened by **${forceDeaf}**`, 
                state.serverDeaf ? Delete : Create
            );
            else if (state.serverMute != preState.serverMute) return defineEmbed('Mute', `**${userTag}** was ${(state.serverMute ? '' : 'un')}muted by **${forceMute}**`, 
                state.serverMute ? Delete : Create
            );
            else if (state.streaming != preState.streaming) return defineEmbed('Streaming', `**${userTag}** ${(state.streaming ? 'started' : 'stopped')} streaming`,
                state.streaming ? Create : Delete
            );
            else if (state.selfVideo != preState.selfVideo) return defineEmbed('Video', `**${userTag}** ${(state.selfVideo ? 'started' : 'stopped')} being a cam-girl`,
                state.selfVideo ? Create : Delete
            );
            return new MessageEmbed({ description: PinguEvent.UnknownUpdate(preState, state) });

            /**@param {string} type
             * @param {string} description
             * @param {'Create' | 'Update' | 'Delete'} color*/
            function defineEmbed(type, description, color) {
                PinguLibrary.AchievementCheck(client, {
                    user: member.user,
                    guildMember: member,
                    guild
                }, 'VOICE', type, [state]);

                return new MessageEmbed({
                    description: SetDescription(type, description),
                    color
                });
            }
        }
    }
);