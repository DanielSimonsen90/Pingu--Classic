const { MessageEmbed } = require("discord.js");
const { PinguGuild, PinguEvent, PChannel } = require("PinguPackage");

module.exports = new PinguEvent('guildUpdate',
    async function setContent(preGuild, guild) {
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
                return PinguEvent.SetRemove(
                    'AFK Channel',
                    preGuild.afkChannelID,
                    guild.afkChannelID,
                    `Set **#${guild.afkChannel.name}** as AFK Channel`,
                    `Removed **#${guild.afkChannel.name}** as AFK Channel`,
                    PinguEvent.SetDescriptionValues
                );
            else if (guild.afkTimeout != preGuild.afkTimeout) return PinguEvent.SetDescription(`AFK Timeout`, preGuild.afkTimeout, guild.afkTimeout);
            else if (guild.available != preGuild.available) return guild.available ?
                PinguEvent.SetDescription('Available', `**${guild.name}** is now available again`) :
                PinguEvent.SetDescription(`Unavailable`, `**${guild.name}** is now unavailable`);
            else if (guild.bannerURL() != preGuild.bannerURL()) return PinguEvent.SetRemove(
                'Banner',
                preGuild.bannerURL(),
                guild.bannerURL(),
                `Set [banner](${guild.bannerURL()})`,
                `Removed [banner](${preGuild.bannerURL()})`,
                PinguEvent.SetDescriptionValuesLink
            );
            else if (guild.defaultMessageNotifications != preGuild.defaultMessageNotifications)
                return PinguEvent.SetDescriptionValues(`Default Message Notifications`, preGuild.defaultMessageNotifications, guild.defaultMessageNotifications);
            else if (guild.description != preGuild.description) return PinguEvent.SetRemove(
                'Description',
                preGuild.description,
                guild.description,
                `Set description to "${guild.description}"`,
                `Removed description`,
                PinguEvent.SetDescriptionValues
            );
            else if (guild.discoverySplashURL() != preGuild.discoverySplashURL()) return PinguEvent.SetRemove(
                'Discovery Splash',
                preGuild.discoverySplashURL(),
                guild.discoverySplashURL(),
                `Set discovery splash to "${guild.discoverySplashURL()}"`,
                `Removed discovery splash`,
                PinguEvent.SetDescriptionValuesLink
            );
            else if (guild.features.length != preGuild.features.length) return PinguEvent.SetRemove(
                'Features',
                preGuild.features.join(', ').substring(0, preGuild.features.join(', ').length - 2),
                guild.features.join(', ').substring(0, guild.features.join(', ').length - 2),
                `Added features: ${guild.features.join(', ').substring(0, guild.features.join(', ').length - 2)}`,
                `Removed features: ${preGuild.features.join(', ').substring(0, preGuild.features.join(', ').length - 2)}`,
                PinguEvent.SetDescriptionValues
            );
            else if (guild.iconURL() != preGuild.iconURL()) return PinguEvent.SetRemove(
                'Icon',
                preGuild.iconURL(),
                guild.iconURL(),
                `Set [icon](${guild.iconURL()})`,
                `Removed [icon](${preGuild.iconURL()})`,
                PinguEvent.SetDescriptionValuesLink
            )
            else if (guild.mfaLevel != preGuild.mfaLevel) return PinguEvent.SetDescriptionValues('MFA Level', preGuild.mfaLevel, guild.mfaLevel);
            else if (guild.ownerID != preGuild.ownerID) return PinguEvent.SetDescriptionValues('Owner', preGuild.owner.user.tag, guild.owner.user.tag);
            else if (guild.partnered != preGuild.partnered) return PinguEvent.SetRemove(
                'Partner',
                preGuild.partnered,
                guild.partnered,
                `**${guild.name}** is now **__Partnered__**!`,
                `**${guild.name}** is no longer Partnered`,
                PinguEvent.SetDescriptionValues
            );
            else if (guild.preferredLocale != preGuild.preferredLocale) return PinguEvent.SetDescriptionValues('Locale', preGuild.preferredLocale, guild.preferredLocale);
            else if (guild.premiumSubscriptionCount != preGuild.premiumSubscriptionCount) {
                return (
                    guild.premiumSubscriptionCount > preGuild.premiumSubscriptionCount ?
                        PinguEvent.SetDescription('Boost', `${(lastBooster ? `**${lastBooster}** boosted **${guild.name}**` : `**${guild.name}** was boosted`)}`) :
                        PinguEvent.SetDescription('Boost', `**${guild.name}** lost a boost`)
                );
            }
            else if (guild.premiumTier != preGuild.premiumTier) {
                return (
                    guild.premiumTier > preGuild.premiumTier ?
                        PinguEvent.SetDescription('Boost',
                            `${(lastBooster ? `**${lastBooster}** boosted **${guild.name}** to level **${guild.premiumTier}**!` :
                                `**${guild.name}** was boosted to level **${guild.premiumTier}**!`)}`
                        ) :
                        PinguEvent.SetDescription('Boost', `**${guild.name}**'s boost level has dropped to ${guild.premiumTier}.`)
                );
            }
            else if (guild.publicUpdatesChannelID != preGuild.publicUpdatesChannelID) return PinguEvent.SetRemove(
                'Community Updates Channel',
                preGuild.publicUpdatesChannelID,
                guild.publicUpdatesChannelID,
                `Set to ${guild.publicUpdatesChannel}`,
                `Removed Community Upadtes Channel`,
                PinguEvent.SetDescriptionValues
            )
            else if (guild.region != preGuild.region) return PinguEvent.SetDescriptionValues('Region', preGuild.region, guild.region);
            else if (guild.rulesChannelID != preGuild.rulesChannelID) return PinguEvent.SetRemove(
                'Rules Channel',
                preGuild.rulesChannelID,
                guild.rulesChannelID,
                `Set to ${guild.rulesChannel}`,
                `Removed Rules Channel`,
                PinguEvent.SetDescriptionValues
            );
            else if (guild.shardID != preGuild.shardID) return PinguEvent.SetDescriptionValues('Shard', preGuild.shardID, guild.shardID);
            else if (guild.splashURL() != preGuild.splashURL()) return PinguEvent.SetRemove(
                'Splash URL',
                preGuild.splashURL(),
                guild.splashURL(),
                `Set [splash](${guild.splashURL()})`,
                `Removed [splash](${preGuild.splashURL()})`,
                PinguEvent.SetDescriptionValues
            );
            else if (guild.systemChannelID != preGuild.systemChannelID) return PinguEvent.SetRemove(
                'System Channel',
                preGuild.systemChannel.name,
                guild.systemChannel.name,
                `Set to ${guild.systemChannel.name}`,
                `Removed system channel`,
                PinguEvent.SetDescriptionValues
            );
            else if (guild.vanityURLCode != preGuild.vanityURLCode) return PinguEvent.SetRemove(
                'Vanity URL',
                preGuild.vanityURLCode,
                guild.vanityURLCode,
                "Set to `" + guild.vanityURLCode + "`",
                "Removed Vanity URL",
                PinguEvent.SetDescriptionValues
            );
            else if (guild.verificationLevel != preGuild.verificationLevel) PinguEvent.SetRemove(
                'Verification Level',
                preGuild.verificationLevel,
                guild.verificationLevel,
                `Set to \`${guild.verificationLevel}\``,
                `Set to \`None\``,
                PinguEvent.SetDescriptionValues
            );
            else if (guild.verified != preGuild.verified) return PinguEvent.SetRemove(
                'Verified',
                preGuild.verified,
                guild.verified,
                `**${guild.name}** is now **__Verified__**!`,
                `**${guild.name}** is no longer Verified`,
                PinguEvent.SetDescriptionValues
            );
            else if (guild.widgetChannelID != preGuild.widgetChannelID) return PinguEvent.SetRemove(
                'Widget Channel',
                preGuild.widgetChannel.name,
                guild.widgetChannel.name,
                `Set to ${guild.widgetChannel.name}`,
                `Removed widget channel`,
                PinguEvent.SetDescriptionValues
            );
            else if (guild.widgetEnabled != preGuild.widgetEnabled) return PinguEvent.SetDescriptionValues('Widget Enabled', preGuild.widgetEnabled, guild.widgetEnabled);

            return PinguEvent.UnknownUpdate(preGuild, guild);
        }
    },
    async function execute(client, preGuild, guild) {
        let pGuild = await PinguGuild.GetPGuild(guild);
        let updated = {};

        if (preGuild.name != guild.name) updated.name = guild.name;

        let welcomePChannel = pGuild.welcomeChannel;
        let welcomeChannel = welcomePChannel && guild.channels.cache.find(c => c.id == welcomePChannel._id)
        if (welcomeChannel && welcomeChannel.name != welcomePChannel.name) updated.welcomeChannel = new PChannel(welcomeChannel);

        if (pGuild.reactionRoles.length) {
            let rrPChannels = pGuild.reactionRoles.map(rr => rr.channel._id);
            let rrChannels = guild.channels.cache.filter(c => rrPChannels.includes(c.id));
            let newReactionRoles = pGuild.reactionRoles;

            rrChannels.array().forEach((c, i) => {
                if (c.name != pGuild.reactionRoles[i].channel.name)
                    pGuild.reactionRoles[i].channel.name = c.name;
            });

            if (pGuild.reactionRoles.find((rr, i) =>
                rr.channel.name != newReactionRoles[i].channel.name))
                updated.reactionRoles = newReactionRoles;
        }

        if (guild.ownerID != pGuild.guildOwner._id) updated.guildOwner = { id: guild.ownerID, name: guild.owner.user.tag };

        //Event didn't update something that should be saved to MongolDB
        if (!Object.keys(updated)[0]) return;

        await PinguGuild.UpdatePGuild(client, updated, pGuild, this.name,
            `Successfully updated **${guild.name}**'s ${(preGuild.name != guild.name ? `(${preGuild.name}) ` : "")}Pingu Guild.`,
            `Unable to update **${guild.name}**'s ${(preGuild.name != guild.name ? `(${preGuild.name})` : "")} Pingu Guild.`
        );
    }
);