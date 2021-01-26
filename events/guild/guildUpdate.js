const { Client, Guild, MessageEmbed } = require("discord.js");
const { PinguGuild, PinguLibrary, PinguEvents } = require("../../PinguPackage");

module.exports = {
    name: 'events: guildUpdate',
    /**@param {{preGuild: Guild, guild: Guild}}*/
    async setContent({ preGuild, guild }) {
        return module.exports.content = await GetDifference() ? new MessageEmbed().setDescription(await GetDifference()) : null;

        async function GetDifference() {
            let now = new Date(Date.now());
            now.setSeconds(now.getSeconds() - 1);

            let lastBoostMessage = guild.systemChannel && guild.systemChannel.messages.cache.find(m => [
                'USER_PREMIUM_GUILD_SUBSCRIPTION',
                'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1',
                'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2',
                'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3'
            ].includes(m.type) && m.createdTimestamp > now.getTime());
            if (lastBoostMessage) var lastBooster = lastBoostMessage.author.tag;

            if (!preGuild.region) return null;
            if (guild.afkChannelID != preGuild.afkChannelID)
                return PinguEvents.SetRemove(
                'AFK Channel',
                preGuild.afkChannelID,
                guild.afkChannelID,
                `Set **#${guild.afkChannel.name}** as AFK Channel`,
                `Removed **#${guild.afkChannel.name}** as AFK Channel`,
                PinguEvents.SetDescriptionValues
            );
            else if (guild.afkTimeout != preGuild.afkTimeout) return PinguEvents.SetDescription(`AFK Timeout`, preGuild.afkTimeout, guild.afkTimeout);
            else if (guild.available != preGuild.available) return guild.available ?
                PinguEvents.SetDescription('Available', `**${guild.name}** is now available again`) :
                PinguEvents.SetDescription(`Unavailable`, `**${guild.name}** is now unavailable`);
            else if (guild.bannerURL() != preGuild.bannerURL()) return PinguEvents.SetRemove(
                'Banner',
                preGuild.bannerURL(),
                guild.bannerURL(),
                `Set [banner](${guild.bannerURL()})`,
                `Removed [banner](${preGuild.bannerURL()})`,
                PinguEvents.SetDescriptionValuesLink
            );
            else if (guild.defaultMessageNotifications != preGuild.defaultMessageNotifications)
                return PinguEvents.SetDescriptionValues(`Default Message Notifications`, preGuild.defaultMessageNotifications, guild.defaultMessageNotifications);
            else if (guild.description != preGuild.description) return PinguEvents.SetRemove(
                'Description',
                preGuild.description,
                guild.description,
                `Set description to "${guild.description}"`,
                `Removed description`,
                PinguEvents.SetDescriptionValues
            );
            else if (guild.discoverySplashURL() != preGuild.discoverySplashURL()) return PinguEvents.SetRemove(
                'Discovery Splash',
                preGuild.discoverySplashURL(),
                guild.discoverySplashURL(),
                `Set discovery splash to "${guild.discoverySplashURL()}"`,
                `Removed discovery splash`,
                PinguEvents.SetDescriptionValuesLink
            );
            else if (guild.features.length != preGuild.features.length) return PinguEvents.SetRemove(
                'Features',
                preGuild.features.join(', ').substring(0, preGuild.features.join(', ').length - 2),
                guild.features.join(', ').substring(0, guild.features.join(', ').length - 2),
                `Added features: ${guild.features.join(', ').substring(0, guild.features.join(', ').length - 2)}`,
                `Removed features: ${preGuild.features.join(', ').substring(0, preGuild.features.join(', ').length - 2)}`,
                PinguEvents.SetDescriptionValues
            );
            else if (guild.iconURL() != preGuild.iconURL()) return PinguEvents.SetRemove(
                'Icon',
                preGuild.iconURL(),
                guild.iconURL(),
                `Set [icon](${guild.iconURL()})`,
                `Removed [icon](${preGuild.iconURL()})`,
                PinguEvents.SetDescriptionValuesLink
            )
            else if (guild.mfaLevel != preGuild.mfaLevel) return PinguEvents.SetDescriptionValues('MFA Level', preGuild.mfaLevel, guild.mfaLevel);
            else if (guild.ownerID != preGuild.ownerID) return PinguEvents.SetDescriptionValues('Owner', preGuild.owner.user.tag, guild.owner.user.tag);
            else if (guild.partnered != preGuild.partnered) return PinguEvents.SetRemove(
                'Partner',
                preGuild.partnered,
                guild.partnered,
                `**${guild.name}** is now **__Partnered__**!`,
                `**${guild.name}** is no longer Partnered`,
                PinguEvents.SetDescriptionValues
            );
            else if (guild.preferredLocale != preGuild.preferredLocale) return PinguEvents.SetDescriptionValues('Locale', preGuild.preferredLocale, guild.preferredLocale);
            else if (guild.premiumSubscriptionCount != preGuild.premiumSubscriptionCount) {
                return (
                    guild.premiumSubscriptionCount > preGuild.premiumSubscriptionCount ?
                        PinguEvents.SetDescription('Boost', `${(lastBooster ? `**${lastBooster}** boosted **${guild.name}**` : `**${guild.name}** was boosted`)}`) :
                        PinguEvents.SetDescription('Boost', `**${guild.name}** lost a boost`)
                );
            }
            else if (guild.premiumTier != preGuild.premiumTier) {
                return (
                    guild.premiumTier > preGuild.premiumTier ?
                        PinguEvents.SetDescription('Boost',
                            `${(lastBooster ? `**${lastBooster}** boosted **${guild.name}** to level **${guild.premiumTier}**!` :
                                `**${guild.name}** was boosted to level **${guild.premiumTier}**!`)}`
                        ) :
                        PinguEvents.SetDescription('Boost', `**${guild.name}**'s boost level has dropped to ${guild.premiumTier}.`)
                );
            }
            else if (guild.publicUpdatesChannelID != preGuild.publicUpdatesChannelID) return PinguEvents.SetRemove(
                'Community Updates Channel',
                preGuild.publicUpdatesChannelID,
                guild.publicUpdatesChannelID,
                `Set to ${guild.publicUpdatesChannel}`,
                `Removed Community Upadtes Channel`,
                PinguEvents.SetDescriptionValues
            )
            else if (guild.region != preGuild.region) return PinguEvents.SetDescriptionValues('Region', preGuild.region, guild.region);
            else if (guild.rulesChannelID != preGuild.rulesChannelID) return PinguEvents.SetRemove(
                'Rules Channel',
                preGuild.rulesChannelID,
                guild.rulesChannelID,
                `Set to ${guild.rulesChannel}`,
                `Removed Rules Channel`,
                PinguEvents.SetDescriptionValues
            );
            else if (guild.shardID != preGuild.shardID) return PinguEvents.SetDescriptionValues('Shard', preGuild.shardID, guild.shardID);
            else if (guild.splashURL() != preGuild.splashURL()) return PinguEvents.SetRemove(
                'Splash URL',
                preGuild.splashURL(),
                guild.splashURL(),
                `Set [splash](${guild.splashURL()})`,
                `Removed [splash](${preGuild.splashURL()})`,
                PinguEvents.SetDescriptionValues
            );
            else if (guild.systemChannelID != preGuild.systemChannelID) return PinguEvents.SetRemove(
                'System Channel',
                preGuild.systemChannel.name,
                guild.systemChannel.name,
                `Set to ${guild.systemChannel.name}`,
                `Removed system channel`,
                PinguEvents.SetDescriptionValues
            );
            else if (guild.vanityURLCode != preGuild.vanityURLCode) return PinguEvents.SetRemove(
                'Vanity URL',
                preGuild.vanityURLCode,
                guild.vanityURLCode,
                "Set to `" + guild.vanityURLCode + "`",
                "Removed Vanity URL",
                PinguEvents.SetDescriptionValues
            );
            else if (guild.verificationLevel != preGuild.verificationLevel) PinguEvents.SetRemove(
                'Verification Level',
                preGuild.verificationLevel,
                guild.verificationLevel,
                `Set to \`${guild.verificationLevel}\``,
                `Set to \`None\``,
                PinguEvents.SetDescriptionValues
            );
            else if (guild.verified != preGuild.verified) return PinguEvents.SetRemove(
                'Verified',
                preGuild.verified,
                guild.verified,
                `**${guild.name}** is now **__Verified__**!`,
                `**${guild.name}** is no longer Verified`,
                PinguEvents.SetDescriptionValues
            );
            else if (guild.widgetChannelID != preGuild.widgetChannelID) return PinguEvents.SetRemove(
                'Widget Channel',
                preGuild.widgetChannel.name,
                guild.widgetChannel.name,
                `Set to ${guild.widgetChannel.name}`,
                `Removed widget channel`,
                PinguEvents.SetDescriptionValues
            );
            else if (guild.widgetEnabled != preGuild.widgetEnabled) return PinguEvents.SetDescriptionValues('Widget Enabled', preGuild.widgetEnabled, guild.widgetEnabled);

            return PinguEvents.UnknownUpdate(preGuild, guild);
        }
    },
    /**@param {Client} client
     * @param {{preGuild: Guild, guild: Guild}}*/
    execute(client, { preGuild, guild }) {
        try {
            if (!guild.name) return;
            if (preGuild.name != guild.name) throw { message: 'Cannot find module' };

            let shouldReturn = true;

            let pGuild = PinguGuild.GetPGuild(guild);

            let welcomePChannel = pGuild.welcomeChannel;
            let welcomeChannel = guild.channels.cache.find(c => c.id == welcomePChannel.id)
            if (!welcomeChannel || welcomeChannel.name != welcomePChannel.name) shouldReturn = false;

            let rrPChannels = pGuild.reactionRoles.map(rr => rr.channel.id);
            let rrChannels = guild.channels.cache.filter(c => rrPChannels.includes(c.id));

            rrChannels.array().forEach((c, i) => {
                if (c.name != pGuild.reactionRoles[i].channel.name)
                    shouldReturn = false;
            });

            if (guild.ownerID != pGuild.guildOwner.id) shouldReturn = false;

            if (shouldReturn) return;

            PinguGuild.UpdatePGuildJSON(client, guild, this.name,
                `Successfully updated **${guild.name}**'s ${(preGuild.name != guild.name ? `(${preGuild.name}) ` : "")}Pingu Guild.`,
                `Unable to update **${guild.name}**'s ${(preGuild.name != guild.name ? `(${preGuild.name})` : "")} Pingu Guild.`
            );
        }
        catch (err) {
            if (err.message.includes('Cannot find module')) {
                return PinguGuild.UpdatePGuild(preGuild, guild, _ =>
                    PinguLibrary.pGuildLog(client, this.name,
                        `Renamed **${preGuild.name}**'s Pingu Guild name to **${guild.name}**.`)
                )
            }

            PinguLibrary.errorLog(client, "Unable to update Pingu Guild", null, err);
        }
    }
}