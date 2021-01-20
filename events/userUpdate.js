const { Client, User } = require("discord.js");
const { PinguLibrary, PinguUser } = require("../PinguPackage");

module.exports = {
    name: 'events: userUpdate',
    /**@param {Client} client
     @param {{preUser: User, user: User}}*/
    execute(client, { preUser, user }) {
        if (user.bot) return;

        return PinguUser.UpdatePUser(preUser, user, _ =>
            PinguLibrary.pUserLog(client, this.name,
                `Updated **${(preUser.tag != user.tag ? user.tag : `(${preUser.tag})`)}**'s json file`)
        );
    }
}