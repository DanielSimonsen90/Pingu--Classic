const { Presence, Activity } = require("discord.js");
const { PinguEvent, PinguClient } = require("PinguPackage");

module.exports = { ...new PinguEvent('presenceUpdate',
    async function setContent(client, embed, previous, current) {
        const { user } = current;

        if (user == client.clients.get('Live')) client.clients.set('Live', user);
        else if (user == client.clients.get('Beta')) client.clients.set('Beta', user);

        client.developers.update(user);

        function FindActivity() {
            if (!previous || !current) return null;

            let activies = current.activities.map(a => a.type);
            let preActivies = previous.activities.map(a => a.type);

            if (current.activities.length < previous.activities.length) //Stopped activity
                return previous.activities.find(a => a.type == preActivies.find(a => !activies.includes(a)));
            else if (current.activities.length > previous.activities.length) //Started actity
                return current.activities.find(a => a.type == activies.find(a => !preActivies.includes(a)));

            return current.activities.find(a => FindChanged(previous.activities, a)) || //Changed activity
                current.activities[current.activities.length - 1]; //Default
        }
        /**@param {Activity[]} arr
         * @param {{name, state, details}} item
         * @param {boolean} sameApp*/
        function FindChanged(arr, item) {
            return arr.find(a => { //array contains item
                const sameApplication = a.name && item.name && a.name == item.name || !a.name && !item.name;

                const details = (a.state && item.state && a.state == item.state || !a.state && !item.state) &&
                    (a.details && item.details && a.details == item.details || !a.details && !item.details) &&
                    (a.emoji && item.emoji && a.emoji.id == item.emoji.id || !a.emoji && !item.emoji);
                return sameApplication && !details;
            })
        }

        let preActivity = FindActivity();
        let preActivityType = preActivity?.type.toLowerCase();

        let activity = FindActivity();
        let activityType = activity?.type.toLowerCase();
        const Danho = client.developers.get('Danho');

        if (current.userID == Danho.id && activityType == 'streaming') {
            client.setActivity();
        }

        activityType = activityType == 'listening' ? 'listening to' : activityType == 'competing' ? 'competing in' : activityType;
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
                .setColor(module.exports.GetColor(activityType, current, previous)) : 
            null;

        function GetDescription() {
            if (!previous || !activity || current?.status != previous.status)
                return `**${current.user.tag}** is ${(previous?.status == 'offline' ? `online as` : "")} **${current.status}**${(activity && current.status != 'offline' ? `, ${GetActivity(true, false)}` : "")}`; //Just got online || status changed
            else if (current.user.bot) return null; //Bot changed its activity; not status
            else if (current.activities.length < previous.activities.length)
                GetActivity(false, true);
            /*else (activity.index > preActivity.index)*/
            return GetActivity(true, true);
        }
        /**@param {boolean} started
         * @param {boolean} includeUserMessage*/
        function GetActivity(started, includeUserMessage) {
            function getActivity() {
                if (started)
                    switch (activityType) {
                        case 'listening to': return `**${activity.details}** by ${activity.state?.includes(';') ? activity.state.split(';').join(', ') : activity.state}`;
                        case 'competing in': return `**${activity.details}**`;
                        case 'custom_status': return `${(preActivity.emoji ? preActivity.emoji : "")} ${activity.state ? activity.state : ""}`;
                        default: return `**${activity.details || (`${activity.name}${(activity.state ? `, ${activity.state}` : "")}`)}** ${(previous.guild?.id != current.guild?.id ? `in ${current.guild.name}` : "")}`;
                    }
                else switch (preActivityType) {
                    case 'listening to': `**${activity.details}** by ${activity.state?.includes(';') ? activity.state.split(';').join(', ') : activity.state}`;
                    case 'custom_status': return `${(preActivity.emoji ? preActivity.emoji : "")} ${activity.state ? `**${activity.state}**` : ""}`;
                    default: return `**${preActivity.details || (`${preActivity.name}${(preActivity.state ? `, ${preActivity.state}` : "")}`)}**`;
                }
            }

            let userMessage = started && activityType == 'custom_status' ?
                `**${user}** has ${(previous.activities.find(a => a == activity) ? `gone back to` : `started`)} their custom status: ` :
                started ? `**${user}** started ${activityType} ` : `**${user}** stopped ${preActivityType} `;
            let userActivity = getActivity();
            return includeUserMessage ? userMessage + userActivity : userActivity;
        }
    }
), ...{
    /**@param {string} activityType
     * @param {Presence} presence
     * @param {Presence} prePresence*/
    GetColor(activityType, presence, prePresence) {
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
}};