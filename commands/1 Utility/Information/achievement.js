const { Message, MessageEmbed } = require('discord.js');
const {
    PinguCommand, PinguLibrary, EmbedField,
    PinguUser, PinguGuildMember, PinguGuild,
    UserAchievement, GuildMemberAchievement, GuildAchievement
} = require('PinguPackage');

const achievementCommands = ["missing", "achieved", "info"];
const achievementTypes = ["user", "member", "guild"];
const toUsage = (arr) => arr.join('| ').substring(2);

module.exports = new PinguCommand('achievement', 'Utility', `All the information about achievements`, {
    usage: `<${toUsage(achievementCommands)}> <${toUsage(achievementTypes)}> [achievement id] [@User]`,
}, async ({ client, message, args, pAuthor, pGuildMember, pGuild, pGuildClient }) => {
    const { granted, command, type, id, achievementID } = PermissionCheck(message, args);
    if (granted != PinguLibrary.PermissionGranted) return message.channel.send(granted);

    switch (type) {
        case 'user': return UserType();
        case 'member': return MemberType();
        case 'guild': return GuildType();
    }

    function UserType() {
        const user = id ? client.users.cache.get(id) : message.author;
        const pUser = id ? await PinguUser.GetPUser(user) : pAuthor;
        const pUserAchievementIDs = pUser.achievementConfig.achievements.map(a => a._id);

        switch (command) {
            case 'missing':
                let missing = pUser.achievementConfig.achievements.find(a => a._id == achievementID) == null;
                return message.channel.send(
                    achievementID ?
                        `${(missing ? "Yes, " : "No, ")}` +
                        `${(id ? `${user.username} is ` : "you are ")}` +
                        `${(missing ? "" : "not ")}` +
                        `missing the **${UserAchievement.Achievements.find(a => a._id == achievementID).name}** achievement.`
                        :
                        FormatAchievements(UserAchievement.Achievements.filter(a => !pUserAchievementIDs.includes(a._id)))
                );
            case 'achieved':
                let achieved = pUser.achievementConfig.achievements.find(a => a._id == achievementID) != null;
                return message.channel.send(
                    achievementID ?
                        `${(achieved ? "Yes, " : "No, ")}` +
                        `${(id ? `${user.username} has ` : "you are ")}` +
                        `${(achieved ? "" : "not ")}` +
                        `achieved the **${UserAchievement.Achievements.find(a => a._id == achievementID).name}** achievement.`
                        :
                        FormatAchievements(UserAchievement.Achievements.filter(a => !pUserAchievementIDs.includes(a._id)))
                );
            case 'info':
                let achievement = UserAchievement.Achievements.find(a => a._id == achievementID);
                let embed = new MessageEmbed()
                    .setTitle(`Achievement Info ${(achievement ? `- ${achievement.name}` : ``)}`)
                    .setColor(message.guild ? pGuildClient.embedColor : client.DefaultEmbedColor);
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
    function MemberType() {
        const member = id ? message.guild.member(client.users.cache.get(id)) : message.member;
        const pMember = id ? await PinguGuildMember.GetPGuildMember(member) : pGuildMember;
        const pMemberAchievementIDs = pMember.achievementConfig.achievements.map(a => a._id);

        switch (command) {
            case 'missing':
                let missing = pMember.achievementConfig.achievements.find(a => a._id == achievementID) == null;
                return message.channel.send(
                    achievementID ?
                        `${(missing ? "Yes, " : "No, ")}` +
                        `${(id ? `${member.user.username} is ` : "you are ")}` +
                        `${(missing ? "" : "not ")}` +
                        `missing the **${GuildMemberAchievement.Achievements.find(a => a._id == achievementID).name}** achievement.`
                        :
                        FormatAchievements(GuildMemberAchievement.Achievements.filter(a => !pMemberAchievementIDs.includes(a._id)))
                );
            case 'achieved':
                let achieved = pMember.achievementConfig.achievements.find(a => a._id == achievementID) != null;
                return message.channel.send(
                    achievementID ?
                        `${(achieved ? "Yes, " : "No, ")}` +
                        `${(id ? `${member.user.username} has ` : "you are ")}` +
                        `${(achieved ? "" : "not ")}` +
                        `achieved the **${GuildMemberAchievement.Achievements.find(a => a._id == achievementID).name}** achievement.`
                        :
                        FormatAchievements(GuildMemberAchievement.Achievements.filter(a => !pMemberAchievementIDs.includes(a._id)))
                );
            case 'info':
                let achievement = GuildMemberAchievement.Achievements.find(a => a._id == achievementID);
                let embed = new MessageEmbed()
                    .setTitle(`Achievement Info ${(achievement ? `- ${achievement.name}` : ``)}`)
                    .setColor(message.guild ? pGuildClient.embedColor : client.DefaultEmbedColor);
                return message.channel.send(
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
    function GuildType() {
        const guild = id ? client.guilds.cache.get(id) : message.guild;
        if (!guild) return message.channel.send("I'm not a part of that guild!");

        const pg = id ? await PinguGuild.GetPGuild(guild) : pGuild;
        const pgAchievements = pg.settings.config.achievements.achievements;
        const pGuildAchievementIDs = pgAchievements.map(a => a._id);

        switch (command) {
            case 'missing':
                let missing = pgAchievements.find(a => a._id == achievementID) == null;
                return message.channel.send(
                    achievementID ?
                        `${(missing ? "Yes, " : "No, ")}` +
                        `${guild.name} is ${(missing ? "" : "not ")}` +
                        `missing the **${GuildAchievement.Achievements.find(a => a._id == achievementID).name}** achievement.`
                        :
                        FormatAchievements(GuildAchievement.Achievements.filter(a => !pGuildAchievementIDs.includes(a._id)))
                );
            case 'achieved':
                let achieved = pgAchievements.find(a => a._id == achievementID) != null;
                return message.channel.send(
                    achievementID ?
                        `${(achieved ? "Yes, " : "No, ")}` +
                        `${guild.name} has ${(achieved ? "" : "not ")}` +
                        `achieved the **${GuildAchievement.Achievements.find(a => a._id == achievementID).name}** achievement.`
                        :
                        FormatAchievements(GuildAchievement.Achievements.filter(a => !pGuildAchievementIDs.includes(a._id)))
                );
            case 'info':
                let achievement = GuildAchievement.Achievements.find(a => a._id == achievementID);
                let embed = new MessageEmbed()
                    .setTitle(`Achievement Info ${(achievement ? `- ${achievement.name}` : ``)}`)
                    .setColor(pGuildClient.embedColor || client.DefaultEmbedColor);
                return message.channel.send(
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

/**@param {Message} message
 * @param {string[]} args
 * @returns {{
 *  granted: string,
 *  command: "missing" | "achieved" | "info",
 *  type: "user" | "member" | "guild",
 *  achievementID: string,
 *  id: string
 * }}*/
function PermissionCheck(message, args) {
    args = args.map(v => v.toLowerCase());
    const result = {
        granted: PinguLibrary.PermissionGranted,
        command: args[0],
        type: args[1],
        achievementID: args[2],
        id: args[3]
    };

    //Arguments length are met & command & type are both valid arguments
    const { command, type, achievementID } = result;
    if (!command || !type || !achievementID ||
        !achievementCommands.includes(command) || !achievementTypes.includes(type)) {
        result.granted = `You didn't provide me with the achievement ${!command ? "command" : "type"}! Use the following:\n` +
            (!command ? achievementCommands : achievementTypes)
                .map(cmd => `- ${cmd}`)
                .join('\n');
        return result;
    }

    //achievementID exists and is a valid id for chosen achievement type
    if (achievementID) {
        const achievements = (function getAchievements() {
            switch (type) {
                case 'user': return UserAchievement.Achievements;
                case 'member': return GuildMemberAchievement.Achievements;
                case 'guild': return GuildAchievement.Achievements;
                default: return null;
            }
        })();
        if (isNaN(achievementID) || parseInt(achievementID) <= 0 || parseInt(achievementID) >= achievements.length)
            result.granted = `The achievement id provided is not a valid id! Pick a number between 1 - ${achievements.length - 1}`;
    }

    return result;
}
/**@param {{_id: string, name: string}[]} achievements*/
function FormatAchievements(achievements) {
    return achievements
        .map(a => `[${a._id}]: ${a.name}`)
        .join('\n');
}