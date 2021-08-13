const { PinguEvent, PChannel, PGuild } = require("PinguPackage");

module.exports = new PinguEvent('guildUpdate',
    async function setContent(client, embed, previous, current) {
        let description = await GetDifference();
        return module.exports.content = description ? embed.setDescription(description) : null;

        async function GetDifference() {
            let now = new Date();
            now.setSeconds(now.getSeconds() - 1);

            let lastBoostMessage = current.systemChannel && current.systemChannel.messages.cache.find(m => [
                'USER_PREMIUM_GUILD_SUBSCRIPTION',
                'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1',
                'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2',
                'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3'
            ].includes(m.type) && m.createdTimestamp < now.getTime());
            if (lastBoostMessage) var lastBooster = lastBoostMessage.author.tag;

            if (!previous.region) return null;
            if (current.afkChannelId != previous.afkChannelId)
                return PinguEvent.SetRemove(
                    'AFK Channel',
                    previous.afkChannelId,
                    current.afkChannelId,
                    `Set **#${current.afkChannel.name}** as AFK Channel`,
                    `Removed **#${current.afkChannel.name}** as AFK Channel`,
                    PinguEvent.SetDescriptionValues
                );
            else if (current.afkTimeout != previous.afkTimeout) return PinguEvent.SetDescription(`AFK Timeout`, previous.afkTimeout, current.afkTimeout);
            else if (current.available != previous.available) return current.available ?
                PinguEvent.SetDescription('Available', `**${current.name}** is now available again`) :
                PinguEvent.SetDescription(`Unavailable`, `**${current.name}** is now unavailable`);
            else if (current.bannerURL() != previous.bannerURL()) return PinguEvent.SetRemove(
                'Banner',
                previous.bannerURL(),
                current.bannerURL(),
                `Set [banner](${current.bannerURL()})`,
                `Removed [banner](${previous.bannerURL()})`,
                PinguEvent.SetDescriptionValuesLink
            );
            else if (current.defaultMessageNotifications != previous.defaultMessageNotifications)
                return PinguEvent.SetDescriptionValues(`Default Message Notifications`, previous.defaultMessageNotifications, current.defaultMessageNotifications);
            else if (current.description != previous.description) return PinguEvent.SetRemove(
                'Description',
                previous.description,
                current.description,
                `Set description to "${current.description}"`,
                `Removed description`,
                PinguEvent.SetDescriptionValues
            );
            else if (current.discoverySplashURL() != previous.discoverySplashURL()) return PinguEvent.SetRemove(
                'Discovery Splash',
                previous.discoverySplashURL(),
                current.discoverySplashURL(),
                `Set discovery splash to "${current.discoverySplashURL()}"`,
                `Removed discovery splash`,
                PinguEvent.SetDescriptionValuesLink
            );
            else if (current.features.length != previous.features.length) return PinguEvent.SetRemove(
                'Features',
                previous.features.join(', ').substring(0, previous.features.join(', ').length - 2),
                current.features.join(', ').substring(0, current.features.join(', ').length - 2),
                `Added features: ${current.features.join(', ').substring(0, current.features.join(', ').length - 2)}`,
                `Removed features: ${previous.features.join(', ').substring(0, previous.features.join(', ').length - 2)}`,
                PinguEvent.SetDescriptionValues
            );
            else if (current.iconURL() != previous.iconURL()) return PinguEvent.SetRemove(
                'Icon',
                previous.iconURL(),
                current.iconURL(),
                `Set [icon](${current.iconURL()})`,
                `Removed [icon](${previous.iconURL()})`,
                PinguEvent.SetDescriptionValuesLink
            )
            else if (current.mfaLevel != previous.mfaLevel) return PinguEvent.SetDescriptionValues('MFA Level', previous.mfaLevel, current.mfaLevel);
            else if (current.ownerId != previous.ownerId) return PinguEvent.SetDescriptionValues('Owner', previous.owner.user.tag, current.owner.user.tag);
            else if (current.partnered != previous.partnered) return PinguEvent.SetRemove(
                'Partner',
                previous.partnered,
                current.partnered,
                `**${current.name}** is now **__Partnered__**!`,
                `**${current.name}** is no longer Partnered`,
                PinguEvent.SetDescriptionValues
            );
            else if (current.preferredLocale != previous.preferredLocale) return PinguEvent.SetDescriptionValues('Locale', previous.preferredLocale, current.preferredLocale);
            else if (current.premiumSubscriptionCount != previous.premiumSubscriptionCount) {
                return (
                    current.premiumSubscriptionCount > previous.premiumSubscriptionCount ?
                        PinguEvent.SetDescription('Boost', `${(lastBooster ? `**${lastBooster}** boosted **${current.name}**` : `**${current.name}** was boosted`)}`) :
                        PinguEvent.SetDescription('Boost', `**${current.name}** lost a boost`)
                );
            }
            else if (current.premiumTier != previous.premiumTier) {
                return (
                    current.premiumTier > previous.premiumTier ?
                        PinguEvent.SetDescription('Boost',
                            `${(lastBooster ? `**${lastBooster}** boosted **${current.name}** to level **${current.premiumTier}**!` :
                                `**${current.name}** was boosted to level **${current.premiumTier}**!`)}`
                        ) :
                        PinguEvent.SetDescription('Boost', `**${current.name}**'s boost level has dropped to ${current.premiumTier}.`)
                );
            }
            else if (current.publicUpdatesChannelId != previous.publicUpdatesChannelId) return PinguEvent.SetRemove(
                'Community Updates Channel',
                previous.publicUpdatesChannelId,
                current.publicUpdatesChannelId,
                `Set to ${current.publicUpdatesChannel}`,
                `Removed Community Upadtes Channel`,
                PinguEvent.SetDescriptionValues
            )
            else if (current.region != previous.region) return PinguEvent.SetDescriptionValues('Region', previous.region, current.region);
            else if (current.rulesChannelId != previous.rulesChannelId) return PinguEvent.SetRemove(
                'Rules Channel',
                previous.rulesChannelId,
                current.rulesChannelId,
                `Set to ${current.rulesChannel}`,
                `Removed Rules Channel`,
                PinguEvent.SetDescriptionValues
            );
            else if (current.shardId != previous.shardId) return PinguEvent.SetDescriptionValues('Shard', previous.shardId, current.shardId);
            else if (current.splashURL() != previous.splashURL()) return PinguEvent.SetRemove(
                'Splash URL',
                previous.splashURL(),
                current.splashURL(),
                `Set [splash](${current.splashURL()})`,
                `Removed [splash](${previous.splashURL()})`,
                PinguEvent.SetDescriptionValues
            );
            else if (current.systemChannelId != previous.systemChannelId) return PinguEvent.SetRemove(
                'System Channel',
                previous.systemChannel.name,
                current.systemChannel.name,
                `Set to ${current.systemChannel.name}`,
                `Removed system channel`,
                PinguEvent.SetDescriptionValues
            );
            else if (current.vanityURLCode != previous.vanityURLCode) return PinguEvent.SetRemove(
                'Vanity URL',
                previous.vanityURLCode,
                current.vanityURLCode,
                "Set to `" + current.vanityURLCode + "`",
                "Removed Vanity URL",
                PinguEvent.SetDescriptionValues
            );
            else if (current.verificationLevel != previous.verificationLevel) PinguEvent.SetRemove(
                'Verification Level',
                previous.verificationLevel,
                current.verificationLevel,
                `Set to \`${current.verificationLevel}\``,
                `Set to \`None\``,
                PinguEvent.SetDescriptionValues
            );
            else if (current.verified != previous.verified) return PinguEvent.SetRemove(
                'Verified',
                previous.verified,
                current.verified,
                `**${current.name}** is now **__Verified__**!`,
                `**${current.name}** is no longer Verified`,
                PinguEvent.SetDescriptionValues
            );
            else if (current.widgetChannelId != previous.widgetChannelId) return PinguEvent.SetRemove(
                'Widget Channel',
                previous.widgetChannel.name,
                current.widgetChannel.name,
                `Set to ${current.widgetChannel.name}`,
                `Removed widget channel`,
                PinguEvent.SetDescriptionValues
            );
            else if (current.widgetEnabled != previous.widgetEnabled) return PinguEvent.SetDescriptionValues('Widget Enabled', previous.widgetEnabled, current.widgetEnabled);

            return PinguEvent.UnknownUpdate(previous, current);
        }
    },
    async function execute(client, previous, current) {
        const savedGuild = client.savedServers.find(g => g.id == current);
        if (savedGuild) {
            const savedServerName = client.savedServers.findKey(g => g == savedGuild);
            client.savedServers.set(savedServerName, current);
        }

        const relevant = {
            name: current.name,
            guildOwner: {
                _id: current.ownerId,
                name: current.owner.user.tag
            }
        }
        const pGuild = client.pGuilds.get(current);

        const updated = Object.keys(relevant).reduce((updated, prop) => {
            if (typeof relevant[prop] != 'object' && pGuild[prop] != relevant[prop])
                updated.push(prop);
            else if (typeof relevant[prop] == 'object') {
                const propUpdated = Object.keys(relevant[prop]).reduce((propUpdated, _prop) => {
                    if (relevant[prop][_prop] != pGuild[prop][_prop])
                        propUpdated.push(_prop);
                    return propUpdated
                }, [])
                if (propUpdated.length) updated.push(prop);
            }
            return updated;
        }, [])

        if (updated.length) updated.forEach(prop => pGuild[prop] = updated[prop]);

        if (updated.includes('name')) {
            (async function UpdateSharedServers() {
                const pUsers = client.pUsers.array()
                const pUsersWithPGuild = pUsers.filter(pu => pu.sharedServers.filter(pg => pg._id == current.id));
                pUsersWithPGuild.forEach(pUser => {
                    let { sharedServers } = pUser;
                    let pg = sharedServers.find(pg => pg._id == current.id);
                    let indexOfPG = sharedServers.indexOf(pg);
                    pUser.sharedServers[indexOfPG] = new PGuild(current);
                    client.pUsers.update(pUser, module.exports.name, "SharedServers updated with new Guild name");
                });
            })();
        }

        const welcomePChannel = pGuild.settings.welcomeChannel;
        const welcomeChannel = welcomePChannel && current.channels.cache.get(welcomePChannel._id);

        if (welcomeChannel?.name != welcomePChannel.name) {
            pGuild.settings.welcomeChannel = new PChannel(welcomeChannel);
            updated.push('settings');
        }

        if (pGuild.settings.reactionRoles.length) {
            let rrPChannels = pGuild.settings.reactionRoles.map(rr => rr.channel._id);
            let rrChannels = rrPChannels.map(id => current.channels.cache.get(id));
            let newReactionRoles = pGuild.settings.reactionRoles;

            if (pGuild.reactionRoles[0]) {
                rrChannels.forEach((c, i) => {
                    if (c.name != pGuild.reactionRoles[i].channel.name)
                    pGuild.settings.reactionRoles[i].channel.name = c.name;
                });
            }

            if (pGuild.settings.reactionRoles.find((rr, i) =>
                rr.channel.name != newReactionRoles[i].channel.name)) {
                pGuild.reactionRoles = newReactionRoles;
                updated.push('reactionRoles');
            }
        }

        //Event didn't update something that should be saved to MongolDB
        if (updated.length) await client.pGuilds.update(pGuild, module.exports.name, updated.join(', '));
    }
);