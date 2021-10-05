"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const items_1 = require("./items");
const PinguActionRow_1 = require("../pingu/collection/PinguActionRow");
const IComponent_1 = require("../pingu/components/IComponent");
const TimeSpan_1 = require("../helpers/TimeSpan");
const Array_1 = require("../helpers/Array");
const PGuildMember_1 = require("../database/json/PGuildMember");
const StopRequest = 'Stop Request';
class DecidableCollection {
    _data;
    _collection;
    constructor(_data, _collection) {
        this._data = _data;
        this._collection = _collection;
        const menuItems = new discord_js_1.Collection([
            ['back', { id: 'back', style: 'PRIMARY', emoji: '⬅️', label: 'Go Back' }],
            ['thumbs-up', { id: 'thumbsUp', style: 'SUCCESS', emoji: '👍', label: 'Approve' }],
            ['thumbs-down', { id: 'thumbsDown', style: 'DANGER', emoji: '👎', label: 'Deny' }],
            ['bin', { id: 'bin', style: 'DANGER', emoji: '🗑️', label: 'Delete' }],
            ['forward', { id: 'forward', style: 'PRIMARY', emoji: '➡️', label: 'Go Forward' }],
            ['stop', { id: 'stop', style: 'DANGER', emoji: '🛑', label: 'Stop' }]
        ]);
        this.row = new PinguActionRow_1.default('list', ...menuItems.valueArr().map(({ emoji, id, label, style }) => (0, IComponent_1.Component)('Button', {
            customId: id, emoji, label, style,
            onclick: (interaction) => this._onMenuItemClicked(interaction, id, emoji)
        })));
        this.row.getAll('Button').forEach(btn => btn.listenTo(this._data.commandProps.channel, {
            filter: i => i.user.id == this._data.commandProps.executor.id,
            time: (0, TimeSpan_1.TimeString)('20s')
        }));
        this.row.getAll('Button')[0].onstop = async (interactions, reason) => {
            if (reason != StopRequest) {
                await this._sent.delete();
                this._data.commandProps.channel.send(`Stopped showing ${this._type.toLowerCase()}s.`)
                    .then(s => s.doIn(s => s.delete(), '5s'));
            }
        };
        this._embeds = this._createEmbeds(false);
        this._embedIndex = 0;
    }
    row;
    _collector;
    _sent;
    async list() {
        if (!this._collection.length || !this._embeds.length)
            return this._data.replyReturn(`There are no ${this._data.lowerType}s saved!`);
        this._sent = await this._data.commandProps.channel.send({
            embeds: [this._embeds[this._embedIndex]],
            components: [this.row]
        });
        return this._sent;
    }
    get _client() { return this._data.client; }
    get _type() { return this._data.type; }
    _embeds;
    _embedIndex;
    get embed() { return this._embeds[this._embedIndex]; }
    _createEmbeds(autoCalled) {
        if (!this._collection.length)
            return null;
        let embeds = new Array_1.default();
        let toRemove = new Array_1.default();
        const createGiveawayEmbed = (i) => new discord_js_1.MessageEmbed({
            description: [
                `**__Winner${i.winners.length > 1 ? 's' : ''}__**`,
                i.winners.map(pg => `<@${pg._id}>`).join(', '), "",
                `**Hosted by <@${i.author._id}>**`, "",
                `**Id:** \`${i._id}\``
            ].join('\n')
        });
        const createPollEmbed = (p) => new discord_js_1.MessageEmbed({
            description: [
                `**Verdict:** ${p.approved == 'Approved' ? '👍' : p.approved == 'Denied' ? '👎' : '🤷‍♂️'}\n`,
                `**Hosted by <@${p.author._id}>**\n`,
                `**Id:** \`${p._id}\``
            ].join('\n')
        });
        const createSuggestionEmbed = (s) => new discord_js_1.MessageEmbed({
            description: [
                `**Verdict:** ${s.approved == 'Approved' ? '👍' : s.approved == 'Denied' ? '👎' : '🤷‍♂️'}\n`,
                `**Suggested by <@${s.author._id}>**\n`,
                s.approved != 'Undecided' ? `**Decided by <@${s.decidedBy._id}>**` : "",
                `Id: ${s._id}`
            ].join('\n')
        });
        const createDecidableEmbed = new Map([
            ['Giveaway', createGiveawayEmbed],
            ['Poll', createPollEmbed],
            ['Suggestion', createSuggestionEmbed],
            ['Theme', createGiveawayEmbed]
        ]);
        this._collection.forEach((item, i) => {
            try {
                embeds.push(createDecidableEmbed.get(this._data.type)(item)
                    .setColor(this._data.pGuildClient.embedColor)
                    .setFooter(`Now viewing: ${i + 1}/${this._collection.length}`));
            }
            catch (err) {
                this._client.log('error', `Error while adding ${this._data.type.toLowerCase()} to embeds`);
                toRemove.push(item);
            }
        });
        this._removeDecidables(toRemove);
        if (!embeds && !autoCalled)
            return null;
        return embeds;
    }
    async _removeDecidables(decidables) {
        if (!decidables || !decidables.length || !decidables[0])
            return this._collection;
        const logs = new Array_1.default();
        decidables.forEach(d => {
            this._collection.remove(d);
            logs.push(`The ${this._type}, ${d.value} (${d._id}) was removed.`);
        });
        if (logs.length)
            this._client.log('console', logs.join('\n'));
        await this._updatePGuildCollection('_removeDecidables', `Removed ${logs.length} ${this._type.toLowerCase()}s from **${this._data.pGuild.name}**'s ${this._type} list.`);
        return this._collection;
    }
    _getEmbedDecdiable(embed) {
        return this._collection.find(d => {
            const sentences = embed.description.split('\n');
            const idSentence = sentences[sentences.length - 1];
            const id = idSentence.split(' ')[1];
            return d._id == id;
        });
    }
    async _onMenuItemClicked(interaction, id, emoji) {
        this.row.getAll('Button').forEach(btn => btn.resetTimer());
        const embedToSend = this[`_on${id.toPascalCase()}`](interaction);
        if (!this._collection.length || !embedToSend) {
            this._data.replyReturn(`No more ${this._type.toLowerCase()}s saved!`);
            return this.row.get('Button', 'Stop').onclick(interaction);
        }
        this._sent.editEmbeds(embedToSend);
    }
    _onLeft(interaction) {
        return this._direction(-1);
    }
    _onThumbsUp(interaction) {
        return this._onVerdict(true, interaction.member);
    }
    _onThumbsDown(interaction) {
        return this._onVerdict(false, interaction.member);
    }
    _onBin(interaction) {
        return this._direction(0);
    }
    _onRight(interaction) {
        return this._direction(1);
    }
    _onStop(interaction) {
        return this._collector.stop(StopRequest);
    }
    async _onVerdict(approved, by) {
        if (!this._data.is('Suggestion'))
            return this.embed;
        this._collection = await this._decide(approved, this._getEmbedDecdiable(this.embed), by);
        this._embeds = this._createEmbeds(true);
        return this._direction(1);
    }
    async _direction(direction) {
        if (!this._embeds)
            return null;
        this._embedIndex += direction;
        if (this._embedIndex <= 1) {
            this._embedIndex = this._embeds.length - 1;
            direction = -1;
        }
        else if (this._embedIndex >= this._embeds.length) {
            this._embedIndex = 0;
            direction = 1;
        }
        return direction == 0 ? this._deleteDecidable(this.embed) : this.embed;
    }
    async _deleteDecidable(embed) {
        const decidable = this._getEmbedDecdiable(embed);
        this._collection = await this._removeDecidables(new Array_1.default(decidable));
        this._embeds = this._createEmbeds(true);
        const { _sent, _direction } = this;
        return showSuccess(!this._collection.includes(decidable));
        async function showSuccess(succeeded) {
            const reaction = await _sent.react(succeeded ? '✅' : '❌');
            await new Promise((resolve, reject) => (_sent.doIn(s => s.reactions.cache.get(reaction.emoji.id).remove(), 1500)
                .then(r => resolve(r))
                .catch(err => reject(err))));
            return _direction(-1);
        }
    }
    _decide(approved, suggestion, decidedBy) {
        suggestion = items_1.Suggestion.Decide(suggestion, approved, new PGuildMember_1.default(decidedBy));
        (async function updateSuggestionEmbed() {
            const channel = decidedBy.guild.channels.cache.get(suggestion.channel._id);
            const message = await channel.messages.fetch(suggestion._id);
            return message.embeds[0].setFooter(`Suggestion was ${approved ? 'approved' : 'denied'} by ${decidedBy.user.username}`);
        })();
        return this._saveVerdictToPGuilds(suggestion);
    }
    async _saveVerdictToPGuilds(decidable) {
        const itemIndex = this._collection.findIndex(d => d._id == decidable._id);
        this._collection[itemIndex] = decidable;
        await this._updatePGuildCollection('_saveverdictToPGuilds', `Decidable updated`);
        return this._collection;
    }
    _updatePGuildCollection(script, reason) {
        const { _data: { pGuild, client }, _type, _collection } = this;
        pGuild.settings.config.decidables[`${_type.toLowerCase()}Config`][`${_type}s`] = _collection;
        return client.pGuilds.update(pGuild, `DecidableCollection: ${script}`, reason);
    }
}
exports.default = DecidableCollection;
