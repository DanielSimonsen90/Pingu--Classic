const { MessageEmbed } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

module.exports = new PinguEvent('voiceStateUpdate', 
    async function setContent(client, embed, previous, current) {
        const { SetDescription, Colors } = PinguEvent;
        const { Create, Update, Delete } = Colors;
        let embed = await GetEmbed();
        module.exports.content = embed.description ? embed : null;

        async function GetEmbed() {
            const { guild, member } = current;
            const user = current.member?.user;
            if (!user) return;
            
            const [forceDisconnectExecutor, forceMoveExecutor, forceDeaf, forceMute] = await Promise.all([
                PinguEvent.GetAuditLogs(guild, 'MEMBER_DISCONNECT'),
                PinguEvent.GetAuditLogs(guild, 'MEMBER_MOVE'),
                PinguEvent.GetAuditLogs(guild, 'MEMBER_UPDATE', 'deaf', user),
                PinguEvent.GetAuditLogs(guild, 'MEMBER_UPDATE', 'mute', user)
            ]);

            if (current.channel && !previous.channel) return defineEmbed("Connected", `${user} connected to **${current.channel}**`, Create );
            else if (!current.channel && previous.channel) return defineEmbed('Disconnected', `${user} disconnected from ${previous.channel} ${
                    (forceDisconnectExecutor != PinguEvent.noAuditLog ? `by ${forceDisconnectExecutor}` : "")
                }`, Delete
            );
            else if (current.channel != previous.channel) return defineEmbed('Move', `Moved from **${previous.channel}** to **${current.channel}** ${
                    (forceMoveExecutor != PinguEvent.noAuditLog ? `by **${forceMoveExecutor}**` : "")
                }`, Update
            );
            else if (current.selfDeaf != previous.selfDeaf) return defineEmbed('Deaf', `${user} ${(current.selfDeaf ? '' : 'un')}deafened themselves`, Update);
            else if (current.selfMute != previous.selfMute) return defineEmbed('Mute', `${user} ${(current.selfMute ? '' : 'un')}muted themselves`, Update);
            else if (current.serverDeaf != previous.serverDeaf) return defineEmbed('Deaf', `${user} was ${(current.serverDeaf ? '' : 'un')}deafened by **${forceDeaf}**`, 
                current.serverDeaf ? Delete : Create
            );
            else if (current.serverMute != previous.serverMute) return defineEmbed('Mute', `${user} was ${(current.serverMute ? '' : 'un')}muted by **${forceMute}**`, 
                current.serverMute ? Delete : Create
            );
            else if (current.streaming != previous.streaming) return defineEmbed('Streaming', `${user} ${(current.streaming ? 'started' : 'stopped')} streaming`,
                current.streaming ? Create : Delete
            );
            else if (current.selfVideo != previous.selfVideo) return defineEmbed('Video', `${user} ${(current.selfVideo ? 'started' : 'stopped')} being a cam-girl`,
                current.selfVideo ? Create : Delete
            );
            return embed.setDescription(PinguEvent.UnknownUpdate(previous, current));

            /**@param {string} type
             * @param {string} description
             * @param {'Create' | 'Update' | 'Delete'} color*/
            function defineEmbed(type, description, color) {
                client.AchievementCheck({ user, guildMember: member, guild }, 'VOICE', type, [current]);
                return embed.setDescription(SetDescription(type, description), color);
            }
        }
    }
);