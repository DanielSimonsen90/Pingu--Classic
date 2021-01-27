const { Client, Presence, MessageEmbed, Activity } = require("discord.js");
const { PinguLibrary } = require("../../PinguPackage");

module.exports = {
    name: 'events: presenceUpdate',
    /**@param {{prePresence: Presence, presence: Presence}}*/
    setContent({ prePresence, presence }) {
        let user = presence.user.tag;
        //let typical = ['STREAMING', 'PLAYING', 'LISTENING', 'CUSTOM_STATUS'];

        function FindActivity() {
            if (!prePresence || !presence) return null;

            let activies = presence.activities.map(a => a.type);
            let preActivies = prePresence.activities.map(a => a.type);

            if (presence.activities.length < prePresence.activities.length) //Stopped activity
                return prePresence.activities.find(a => a.type == preActivies.find(a => !activies.includes(a)));
            else if (presence.activities.length > prePresence.activities.length) //Started actity
                return presence.activities.find(a => a.type == activies.find(a => !preActivies.includes(a)));

            return presence.activities.find(a => FindChanged(prePresence.activities, a)) || //Changed activity
                presence.activities[presence.activities.length - 1]; //Default
        }
        /**@param {Activity[]} arr
         * @param {{name, state, details}} item
         * @param {boolean} sameApp*/
        function FindChanged(arr, item) {
            return arr.find(a => { //array contains item
                let sameApplication = a.name && item.name && a.name == item.name || !a.name && !item.name;
                let details = (a.state && item.state && a.state == item.state || !a.state && !item.state) &&
                              (a.details && item.details && a.details == item.details || !a.details && !item.details) &&
                              (a.emoji && item.emoji && a.emoji.id == item.emoji.id || !a.emoji && !item.emoji);
                return sameApplication && !details;
            })
        }

        let preActivity = FindActivity();
        let preActivityType = preActivity && preActivity.type.toLowerCase();

        let activity = FindActivity();
        let activityType = activity && activity.type.toLowerCase();
        activityType = activityType == 'listening' ? 'listening to' : activityType == 'competing' ? 'competing in' : activityType;
        try { var description = GetDescription(); }
        catch (err) {
            PinguLibrary.errorLog(presence.user.client, `Description Error`, null, err);
            console.log({
                user,
                preActivity,
                activity
            });
        }

        return description ? module.exports.content = new MessageEmbed().setDescription(description).setColor(GetColor()) : module.exports.content = null;

        function GetDescription() {
            if (!prePresence || !activity || presence && presence.status != prePresence.status)
                return `**${presence.user.tag}** is ${(prePresence && prePresence.status == 'offline' ? `online as` : "")} **${presence.status}**${(activity && presence.status != 'offline' ? `, ${GetActivity(true, false)}` : "")}`; //Just got online || status changed
            else if (presence.user.bot) return null; //Bot changed its activity; not status
            else if (presence.activities.length < prePresence.activities.length) 
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
                        case 'listening to': return `**${activity.details}** by ${activity.state && activity.state.includes(';') ? activity.state.split(';').join(', ') : activity.state}`;
                        case 'competing in': return `**${activity.details}**`;
                        case 'custom_status': return `${(preActivity.emoji ? preActivity.emoji : "")} ${activity.state ? `${activity.state}` : ""}`;
                        default: return `**${activity.details || (`${activity.name}${(activity.state ? `, ${activity.state}` : "")}`)}** ${(prePresence && prePresence.guild && presence.guild && prePresence.guild.id != presence.guild.id ? `in ${presence.guild.name}` : "")}`;
                    }
                else switch (preActivityType) {
                    case 'listening to': `**${activity.details}** by ${activity.state && activity.state.includes(';') ? activity.state.split(';').join(', ') : activity.state}`;
                    case 'custom_status': return `${(preActivity.emoji ? preActivity.emoji : "")} ${activity.state ? `**${activity.state}**` : ""}`;
                    default: return `**${preActivity.details || (`${preActivity.name}${(preActivity.state ? `, ${preActivity.state}` : "")}`)}**`;
                }
            }

            let userMessage = started && activityType == 'custom_status' ?
                `**${user}** has ${(prePresence.activities.find(a => a == activity) ? `gone back to` : `started`)} their custom status: ` :
                started ? `**${user}** started ${activityType} ` : `**${user}** stopped ${preActivityType} `;
            let userActivity = getActivity();
            return includeUserMessage ? userMessage + userActivity : userActivity;
        }
        function GetColor() {
            if (activityType == 'listening to' && presence.status == prePresence.status) return '#1ED760';
            if (activityType == 'streaming' && presence.status == prePresence.status) return '#593695';

            switch (presence.status) {
                case 'online': return '#43B581';
                case 'idle': return '#FAA61A';
                case 'dnd': return '#F04747';
                case 'offline': return '#727D8A';
                case 'invisible': return '#ffffff';
            }
        }
    },
    /**@param {Client} client
     @param {{prePresence: Presence, presence: Presence}}*/
    execute(client, { prePresence, presence }) {

    }
}