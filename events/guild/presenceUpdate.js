const { Presence, ColorResolvable } = require("discord.js");
const { PinguEvent } = require("PinguPackage");

const event = new PinguEvent('presenceUpdate',
    async function setContent(client, embed, previous, current) {
        const { user } = current;

        if (user == client.clients.get('Live')) client.clients.set('Live', user);
        else if (user == client.clients.get('Beta')) client.clients.set('Beta', user);

        client.developers.update(user);

        function FindActivity() {
            if (!previous || !current) return null;

            const activityTypes = current.activities.map(a => a.type);
            const preActivityTypes = previous.activities.map(a => a.type);

            if (current.activities.length < previous.activities.length) //Stopped activity
                return previous.activities.find(a => a.type == preActivityTypes.find(a => !activityTypes.includes(a)));
            else if (current.activities.length > previous.activities.length) //Started actity
                return current.activities.find(a => a.type == activityTypes.find(a => !preActivityTypes.includes(a)));

            return current.activities.find(a => previous.activities.find(preA => { //Changed activity
                const sameApplication = preA.name && a.name && preA.name == a.name || !preA.name && !a.name;

                const state = preA.state && a.state && preA.state == a.state || !preA.state && !a.state;
                const emoji = preA.emoji && a.emoji && preA.emoji.id == a.emoji.id || !preA.emoji && !a.emoji
                const details = preA.details && a.details && preA.details == a.details || !preA.details && !a.details;

                const dataChanged = !(state && emoji && details);
                return sameApplication && dataChanged;
            })) || current.activities[current.activities.length - 1]; //Default
        }

        const preActivity = FindActivity();
        const preActivityType = preActivity?.type;

        const activity = FindActivity();
        let activityType = !activity ? null : (
            activity.type == 'LISTENING' ? 'listening to' : 
            activity.type == 'COMPETING' ? 'competing in' : 
            activity.type.toLowerCase()
        )
        
        const Danho = client.developers.get('Danho');
        if (user.id == Danho.id && activity?.type == 'STREAMING') {
            client.setActivity();
        }

        try { var description = GetDescription(); }
        catch (err) {
            client.log('error', `Description Error`, null, err, {
                params: { prePresence: previous, presence: current },
                additional: { user, pre: { preActivity, preActivityType }, cur: { activity, activityType } },
                trycatch: { description }
            });
            console.log({ user, preActivity, activity });
        }

        return module.exports.content = description ? 
            embed.setDescription(description)
                .setColor(GetColor(activityType, current, previous)) : 
            null;

        function GetDescription() {
            if (!previous || !activity || current?.status != previous.status)
                return `**${current.user}** is ${(previous?.status == 'offline' ? `online as` : "")} **${current.status}**${(activity && current.status != 'offline' ? `, ${GetActivity(true, false)}` : "")}`; //Just got online || status changed
            else if (current.user.bot) return null; //Bot changed its activity; not status
            else if (current.activities.length < previous.activities.length) return GetActivity(false, true);
            /*else (activity.index > preActivity.index)*/ return GetActivity(true, true);
        }
        /**@param {boolean} started @param {boolean} includeUserMessage*/
        function GetActivity(started, includeUserMessage) {
            /**@returns {string}*/
            function getActivity() {
                const log = {
                    listening: (a) => `**${a.details}** by ${a.state?.includes(';') ? a.state.split(';').join(', ') : a.state}`,
                    custom_status: (a) => `${(a.emoji ? a.emoji : "")} ${a.state ? a.state : ""}`,
                    default: (a) => `**${a.details || (`${a.name}${(a.state ? `, ${a.state}` : "")}`)}** ${(previous?.guild?.id != current.guild?.id ? `in ${current?.guild.name}` : "")}`
                }

                const logData = {
                    type: started ? activityType : preActivityType,
                    activity: started ? activity : preActivity
                }
                return log[logData.type](logData.activity) || log.default(logData.activity);
            }

            const userMessage = started && activityType == 'custom_status' ?
                `**${user}** has ${(previous.activities.find(a => a == activity) ? `gone back to` : `started`)} their custom status: ` :
                started ? `**${user}** started ${activityType} ` : `**${user}** stopped ${preActivityType} `;
            const userActivity = getActivity();
            return includeUserMessage ? userMessage + userActivity : userActivity;
        }
    }
);

/**Returns presence color
 * @param {string} activityType
 * @param {Presence} presence
 * @param {Presence} prePresence
 * @returns {ColorResolvable}*/
function GetColor(activityType, presence, prePresence) {
    const { client } = presence.user;

    if (activityType) {
        if (activityType == 'listening to' && presence.status == prePresence.status) return '#1ED760';
        if (activityType == 'streaming' && presence.status == prePresence.status) return '#593695';
    }

    switch (presence.status) {
        case 'online': return '#43B581';
        case 'idle': return '#FAA61A';
        case 'dnd': return '#F04747';
        case 'offline': return '#727D8A';
        case 'invisible': return '#ffffff';
        default: return client.toPClient(client.pGuilds.get(guild)).embedColor || client.DefaultEmbedColor;
    }
}

module.exports = { ...event, GetColor }