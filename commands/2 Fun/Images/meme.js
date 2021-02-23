const request = require('request'),
    { Message, MessageEmbed } = require('discord.js');
const { PinguCommand, PinguGuild, DiscordPermissions, PClient, PinguLibrary } = require('PinguPackage');

module.exports = new PinguCommand('meme', 'Fun', 'Searches google for Club Penguin/Pingu memes', {
    permissions: ['EMBED_LINKS']
}, async ({ message, pGuildClient }) => PinguLibrary.RequestImage(message, pGuildClient, this.name, ["Pingu", "Club Penguin"]));