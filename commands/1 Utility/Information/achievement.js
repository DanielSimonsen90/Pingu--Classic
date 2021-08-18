const { Message, MessageEmbed } = require('discord.js');
const {
    PinguCommand, EmbedField, Arguments,
    UserAchievement, GuildMemberAchievement, GuildAchievement
} = require('PinguPackage');

const achievementCommands = ["missing", "achieved", "info"];
const achievementTypes = ["user", "member", "guild"];
/**@param {string[]} arr*/
const toUsage = (arr) => arr.join(' | ');

module.exports = new PinguCommand('achievement', 'Utility', `All the information about achievements`, {
    usage: `<${toUsage(achievementCommands)}> <${toUsage(achievementTypes)}> [achievement id] [@User]`,
    examples: ["missing", "missing user 2", "missing member 5 @Danho", "info guild", "achieved guild 756383096646926376"]
}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    const { granted, command, type, id, achievementId } = PermissionCheck();
    if (granted != client.permissions.PermissionGranted) return message.channel.send(granted);

    switch (type) {
        case 'user': return UserType();
        case 'member': return MemberType();
        case 'guild': return GuildType();
    }

    function PermissionCheck() {
        const [command, type, achievementId, id] = args.lowercase();
        const result = {
            granted: client.permissions.PermissionGranted,
            command, type, achievementId, id
        };
    
        //Arguments length are met & command & type are both valid arguments
        if (!command || !type ||
            !achievementCommands.includes(command) || !achievementTypes.includes(type)) {
            result.granted = `You didn't provide me with the achievement ${!command ? "command" : "type"}! Use the following:\n` +
                (!command ? achievementCommands : achievementTypes)
                    .map(cmd => `- ${cmd}`)
                    .join('\n');
            return result;
        }
    
        //achievementID exists and is a valid id for chosen achievement type
        if (achievementId) {
            const achievements = (function getAchievements() {
                switch (type) {
                    case 'user': return UserAchievement.Achievements;
                    case 'member': return GuildMemberAchievement.Achievements;
                    case 'guild': return GuildAchievement.Achievements;
                    default: return null;
                }
            })();
    
        if (isNaN(achievementId) || parseInt(achievementId) <= 0 || parseInt(achievementId) > achievements.length)
            if (!message.client.guilds.cache.has(achievementId) && !message.client.users.cache.has(achievementId))
                result.granted = `The achievement id provided is not a valid id! Pick a number between 1 - ${achievements.length}`;
            else {
                result.id = achievementId;
                result.achievementId = null;
            }
        }
    
        return result;
    }
    /**@param {{_id: string, name: string}[]} achievements*/
    function FormatAchievements(achievements) {
        return achievements
            .map(a => `[${a._id}]: ${a.name}`)
            .join('\n') || "None found!";
    }

    async function UserType() {
        const user = id ? client.users.cache.get(id) : message.author;
        const pUser = id ? client.pUsers.get(user) : pAuthor;
        const pUserAchievement = pUser.achievementConfig.achievements;
        const pUserAchievementIDs = pUserAchievement.map(a => a._id);

        switch (command) {
            case 'missing':
                let missing = pUserAchievement.find(a => a._id == achievementId) == null;
                return message.channel.send(
                    achievementId ?
                        `${(missing ? "Yes, " : "No, ")}` +
                        `${(id ? `${user.username} is ` : "you are ")}` +
                        `${(missing ? "" : "not ")}` +
                        `missing the **${UserAchievement.Achievements.find(a => a._id == achievementId).name}** achievement.`
                        :
                        `${(id ? `${user.username} is ` : `You are`)} missing the following:\n` +
                        FormatAchievements(UserAchievement.Achievements.filter(a => !pUserAchievementIDs.includes(a._id)))
                );
            case 'achieved':
                let achieved = pUserAchievement.find(a => a._id == achievementId) != null;
                return message.channel.send(
                    achievementId ?
                        `${(achieved ? "Yes, " : "No, ")}` +
                        `${(id ? `${user.username} has ` : "you are ")}` +
                        `${(achieved ? "" : "not ")}` +
                        `achieved the **${UserAchievement.Achievements.find(a => a._id == achievementId).name}** achievement.`
                        :
                        `${(id ? `${user.username} has ` : `You have`)} achieved the following:\n` +
                        FormatAchievements(UserAchievement.Achievements.filter(a => pUserAchievementIDs.includes(a._id)))
                );
            case 'info':
                let achievement = UserAchievement.Achievements.find(a => a._id == achievementId);
                let embed = new MessageEmbed({
                    title: `Achievement Info ${(achievement ? `- ${achievement.name}` : ``)}`,
                    color: message.guild ? pGuildClient.embedColor : client.DefaultEmbedColor
                });
                return message.channel.send(
                    achievement ?
                        embed.setDescription(achievement.description)
                            .addFields([
                                new EmbedField("Key", achievement.key, true),
                                new EmbedField("Type", achievement.type, true),
                            ])
                            .setFooter(
                                `${(id ? `${user.username} has ` : `You have `)} ` +
                                `${(pUser.achievementConfig.achievements.find(a => a._id == achievement._id) ? "already" : "not")} achieved this`
                            )
                        :
                        embed.setDescription(
                            "**As a Pingu User, you can earn different achievements as long as you share a server with Pingu and use Pingu's features.**\n" +
                            "These are the achievements you have not yet unlocked:\n" +
                            FormatAchievements(UserAchievement.Achievements.filter(a => !pUserAchievementIDs.includes(a._id)))
                        )
                );
        }
    }
    async function MemberType() {
        const member = id ? message.guild.member(client.users.cache.get(id)) : message.member;
        if (!member) return message.channel.send(`<@${id}> is not a member of this guild!`);

        const pMember = id ? client.pGuildMembers.get(member.guild).get(id) : pGuildMember;
        const pMemberAchievement = pMember.achievementConfig.achievements;
        const pMemberAchievementIDs = pMemberAchievement.map(a => a._id);

        switch (command) {
            case 'missing':
                let missing = pMember.achievementConfig.achievements.find(a => a._id == achievementId) == null;
                return message.channel.send(
                    achievementId ?
                        `${(missing ? "Yes, " : "No, ")}` +
                        `${(id ? `${member.user.username} is ` : "you are ")}` +
                        `${(missing ? "" : "not ")}` +
                        `missing the **${GuildMemberAchievement.Achievements.find(a => a._id == achievementId).name}** achievement.`
                        :
                        `${(id ? `${member.user.username} is ` : `You are`)} missing the following:\n` +
                        FormatAchievements(GuildMemberAchievement.Achievements.filter(a => !pMemberAchievementIDs.includes(a._id))));
            case 'achieved':
                let achieved = pMemberAchievement.find(a => a._id == achievementId) != null;
                return message.channel.send(
                    achievementId ?
                        `${(achieved ? "Yes, " : "No, ")}` +
                        `${(id ? `${member.user.username} has ` : "you are ")}` +
                        `${(achieved ? "" : "not ")}` +
                        `achieved the **${GuildMemberAchievement.Achievements.find(a => a._id == achievementId).name}** achievement.`
                        :
                        `${(id ? `${member.user.username} has ` : `You have`)} achieved the following:\n` +
                        FormatAchievements(GuildMemberAchievement.Achievements.filter(a => pMemberAchievementIDs.includes(a._id)))
                );
            case 'info':
                let achievement = GuildMemberAchievement.Achievements.find(a => a._id == achievementId);
                let embed = new MessageEmbed({
                    title: `Achievement Info ${(achievement ? `- ${achievement.name}` : ``)}`,
                    color: message.guild ? pGuildClient.embedColor : client.DefaultEmbedColor
                });
                return message.channel.sendEmbeds(
                    achievement ?
                        embed.setDescription(achievement.description)
                            .addFields([
                                new EmbedField("Key", achievement.key, true),
                                new EmbedField("Type", achievement.type, true),
                            ])
                            .setFooter(
                                `${(id ? `${member.user.username} has ` : `You have `)} ` +
                                `${(pMember.achievementConfig.achievements.find(a => a._id == achievement._id) ? "already" : "not")} achieved this`
                            )
                        :
                        embed.setDescription(
                            "**As a Pingu GuildMember, you can earn different achievements as long as you share a server with Pingu and use Pingu's features.**\n" +
                            "These are the achievements you have not yet unlocked:\n" +
                            FormatAchievements(GuildMemberAchievement.Achievements.filter(a => !pMemberAchievementIDs.includes(a._id)))
                        )
                );
        }
    }
    async function GuildType() {
        const guild = id ? client.guilds.cache.get(id) : message.guild;
        if (!guild) return message.channel.send("I'm not a part of that guild!");

        const pg = client.pGuilds.get(guild);
        const pgAchievements = pg.settings.config.achievements.achievements;
        const pGuildAchievementIDs = pgAchievements.map(a => a._id);

        switch (command) {
            case 'missing':
                let missing = pgAchievements.find(a => a._id == achievementId) == null;
                return message.channel.send(
                    achievementId ?
                        `${(missing ? "Yes, " : "No, ")}` +
                        `${guild.name} is ${(missing ? "" : "not ")}` +
                        `missing the **${GuildAchievement.Achievements.find(a => a._id == achievementId).name}** achievement.`
                        :
                        `${guild.name} is missing the following:\n` +
                        FormatAchievements(GuildAchievement.Achievements.filter(a => !pGuildAchievementIDs.includes(a._id)))                );
            case 'achieved':
                let achieved = pgAchievements.find(a => a._id == achievementId) != null;
                return message.channel.send(
                    achievementId ?
                        `${(achieved ? "Yes, " : "No, ")}` +
                        `${guild.name} has ${(achieved ? "" : "not ")}` +
                        `achieved the **${GuildAchievement.Achievements.find(a => a._id == achievementId).name}** achievement.`
                        :
                        `${guild.name} has achieved the following:\n` +
                        FormatAchievements(GuildAchievement.Achievements.filter(a => pGuildAchievementIDs.includes(a._id)))
                );
            case 'info':
                let achievement = GuildAchievement.Achievements.find(a => a._id == achievementId);
                let embed = new MessageEmbed({
                    title: `Achievement Info ${(achievement ? `- ${achievement.name}` : ``)}`,
                    color: pGuildClient.embedColor || client.DefaultEmbedColor
                });
                return message.channel.sendEmbeds(
                    achievement ?
                        embed.setDescription(achievement.description)
                            .addFields([
                                new EmbedField("Key", achievement.key, true),
                                new EmbedField("Type", achievement.type, true),
                            ])
                            .setFooter(`${guild.name} has ${(pgAchievements.find(a => a._id == achievement._id) ? "already" : "not")} achieved this`)
                        :
                        embed.setDescription(
                            "**As a Pingu Guild, you can earn different achievements as long as you share a server with Pingu and use Pingu's features.**\n" +
                            "These are the achievements you have not yet unlocked:\n" +
                            FormatAchievements(GuildAchievement.Achievements.filter(a => !pGuildAchievementIDs.includes(a._id)))
                        )
                );
        }
    }


});