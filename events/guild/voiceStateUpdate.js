const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('voiceStateUpdate', 
    async function setContent(preState, state) {
        const { SetDescription, Colors } = PinguEvent;
        const { Create, Update, Delete } = Colors;
        let embed = await GetEmbed();
        module.exports.content = embed.description ? embed : null;

        async function GetEmbed() {
            const { guild, member, client } = state;
            const user = state.member?.user;
            if (!user) return;
            
            const [forceDisconnectExecutor, forceMoveExecutor, forceDeaf, forceMute] = await Promise.all([
                PinguEvent.GetAuditLogs(guild, 'MEMBER_DISCONNECT'),
                PinguEvent.GetAuditLogs(guild, 'MEMBER_MOVE'),
                PinguEvent.GetAuditLogs(guild, 'MEMBER_UPDATE', 'deaf', user),
                PinguEvent.GetAuditLogs(guild, 'MEMBER_UPDATE', 'mute', user)
            ]);

            if (state.channel && !preState.channel) return defineEmbed("Connected", `${user} connected to **${state.channel}**`, Create );
            else if (!state.channel && preState.channel) return defineEmbed('Disconnected', `${user} disconnected from ${preState.channel} ${
                    (forceDisconnectExecutor != PinguEvent.noAuditLog ? `by ${forceDisconnectExecutor}` : "")
                }`, Delete
            );
            else if (state.channel != preState.channel) return defineEmbed('Move', `Moved from **${preState.channel}** to **${state.channel}** ${
                    (forceMoveExecutor != PinguEvent.noAuditLog ? `by **${forceMoveExecutor}**` : "")
                }`, Update
            );
            else if (state.selfDeaf != preState.selfDeaf) return defineEmbed('Deaf', `${user} ${(state.selfDeaf ? '' : 'un')}deafened themselves`, Update);
            else if (state.selfMute != preState.selfMute) return defineEmbed('Mute', `${user} ${(state.selfMute ? '' : 'un')}muted themselves`, Update);
            else if (state.serverDeaf != preState.serverDeaf) return defineEmbed('Deaf', `${user} was ${(state.serverDeaf ? '' : 'un')}deafened by **${forceDeaf}**`, 
                state.serverDeaf ? Delete : Create
            );
            else if (state.serverMute != preState.serverMute) return defineEmbed('Mute', `${user} was ${(state.serverMute ? '' : 'un')}muted by **${forceMute}**`, 
                state.serverMute ? Delete : Create
            );
            else if (state.streaming != preState.streaming) return defineEmbed('Streaming', `${user} ${(state.streaming ? 'started' : 'stopped')} streaming`,
                state.streaming ? Create : Delete
            );
            else if (state.selfVideo != preState.selfVideo) return defineEmbed('Video', `${user} ${(state.selfVideo ? 'started' : 'stopped')} being a cam-girl`,
                state.selfVideo ? Create : Delete
            );
            return new MessageEmbed({ description: PinguEvent.UnknownUpdate(preState, state) });

            /**@param {string} type
             * @param {string} description
             * @param {'Create' | 'Update' | 'Delete'} color*/
            function defineEmbed(type, description, color) {
                client.AchievementCheck({ user, guildMember: member, guild }, 'VOICE', type, [state]);

                return new MessageEmbed({
                    description: SetDescription(type, description),
                    color
                });
            }
        }
    }
);