import { ButtonInteraction, Collection, GuildMember, Message, MessageCollector, MessageEmbed, TextChannel } from "discord.js";
import {} from 'discord-api-types';
import { Suggestion, Giveaway, Poll, Theme } from "./items";
import PinguActionRow from "../pingu/collection/PinguActionRow";
import { Component } from "../pingu/components/IComponent";
import { BaseExecuteProps, DecidableItems, DecidablesTypes, IMenuItem } from "./DecidableCommandProps";
import DecidablesData from "./DecidablesData";
import IDecidable from './items/Decidable';
import { TimeString } from "../helpers/TimeSpan";
import PinguArray from '../helpers/Array';
import PGuildMember from "../database/json/PGuildMember";

const StopRequest = 'Stop Request';

export default class DecidableCollection<
    DecidablesType extends DecidablesTypes, 
    ExecuteProps extends BaseExecuteProps<DecidablesType>,
    Decidable extends DecidableItems[DecidablesType]
>  {
    constructor(private _data: DecidablesData<DecidablesType, ExecuteProps>, private _collection: PinguArray<Decidable>) {
        const menuItems = new Collection<string, IMenuItem>([
            ['back', { id: 'back', style: 'PRIMARY', emoji: '⬅️', label: 'Go Back' }],
            ['thumbs-up', { id: 'thumbsUp', style: 'SUCCESS', emoji: '👍', label: 'Approve' }],
            ['thumbs-down', { id: 'thumbsDown', style: 'DANGER', emoji: '👎', label: 'Deny' }],
            ['bin', { id: 'bin', style: 'DANGER', emoji: '🗑️', label: 'Delete' }],
            ['forward', { id: 'forward', style: 'PRIMARY', emoji: '➡️', label: 'Go Forward' }],
            ['stop', { id: 'stop', style: 'DANGER', emoji: '🛑', label: 'Stop' }]
        ]);

        this.row = new PinguActionRow('list', ...menuItems.valueArr().map(({ emoji, id, label, style }) => Component('Button', {
            customId: id, emoji, label, style,
            onclick: (interaction) => this._onMenuItemClicked(interaction, id, emoji)
        })));
        this.row.getAll('Button').forEach(btn => btn.listenTo(this._data.commandProps.channel, {
            filter: i => i.user.id == this._data.commandProps.executor.id,
            time: TimeString('20s')
        }));
        this.row.getAll('Button')[0].onstop = async (interactions, reason) => {
            if (reason != StopRequest) {
                await this._sent.delete();
                this._data.commandProps.channel.send(`Stopped showing ${this._type.toLowerCase()}s.`)
                    .then(s => s.doIn(s => s.delete(), '5s'));
            }
        }

        this._embeds = this._createEmbeds(false);
        this._embedIndex = 0;
    }

    public row: PinguActionRow;
    private _collector: MessageCollector;
    private _sent: Message;

    public async list() {
        if (!this._collection.length || !this._embeds.length) return this._data.replyReturn(`There are no ${this._data.lowerType}s saved!`);

        this._sent = await this._data.commandProps.channel.send({
            embeds: [this._embeds[this._embedIndex]],
            components: [this.row]
        });
        return this._sent;
    }
    
    private get _client() { return this._data.client; }
    private get _type() { return this._data.type; }
    
    private _embeds: PinguArray<MessageEmbed>;
    private _embedIndex: number;
    public get embed() { return this._embeds[this._embedIndex]; }
    private _createEmbeds(autoCalled: boolean): PinguArray<MessageEmbed> {
        if (!this._collection.length) return null;

        let embeds = new PinguArray<MessageEmbed>();
        let toRemove = new PinguArray<Decidable>();

        const createGiveawayEmbed = (i: Giveaway | Theme) => new MessageEmbed({
            description: [
                `**__Winner${i.winners.length > 1 ? 's' : ''}__**`, 
                i.winners.map(pg => `<@${pg._id}>`).join(', '), "",
                `**Hosted by <@${i.author._id}>**`, "",
                `**Id:** \`${i._id}\``
            ].join('\n')
        });
        const createPollEmbed = (p: Poll) => new MessageEmbed({
            description: [
                `**Verdict:** ${p.approved == 'Approved' ? '👍' : p.approved == 'Denied' ? '👎' : '🤷‍♂️'}\n`,
                `**Hosted by <@${p.author._id}>**\n`,
                `**Id:** \`${p._id}\``
            ].join('\n')
        });
        const createSuggestionEmbed = (s: Suggestion) => new MessageEmbed({
            description: [
                `**Verdict:** ${s.approved == 'Approved' ? '👍' : s.approved == 'Denied' ? '👎' : '🤷‍♂️'}\n`,
                `**Suggested by <@${s.author._id}>**\n`,
                s.approved != 'Undecided' ? `**Decided by <@${s.decidedBy._id}>**` : "",
                `Id: ${s._id}`
            ].join('\n')
        });
        const createDecidableEmbed = new Map<DecidablesTypes, (d: IDecidable) => MessageEmbed>([
            ['Giveaway', createGiveawayEmbed],
            ['Poll', createPollEmbed],
            ['Suggestion', createSuggestionEmbed],
            ['Theme', createGiveawayEmbed]
        ]);

        this._collection.forEach((item, i) => {
            try {
                embeds.push(createDecidableEmbed.get(this._data.type)(item)
                    .setColor(this._data.pGuildClient.embedColor)
                    .setFooter(`Now viewing: ${i + 1}/${this._collection.length}`)
                );
            } catch (err) {
                this._client.log('error', `Error while adding ${this._data.type.toLowerCase()} to embeds`);
                toRemove.push(item);
            }
        });

        this._removeDecidables(toRemove);
        if (!embeds && !autoCalled) return null;
        return embeds;
    }
    private async _removeDecidables(decidables: PinguArray<Decidable>) {
        if (!decidables || !decidables.length || !decidables[0]) return this._collection;

        const logs = new PinguArray<string>();
        decidables.forEach(d => {
            this._collection.remove(d);
            logs.push(`The ${this._type}, ${d.value} (${d._id}) was removed.`);
        });

        if (logs.length) this._client.log('console', logs.join('\n'));

        await this._updatePGuildCollection('_removeDecidables', 
            `Removed ${logs.length} ${this._type.toLowerCase()}s from **${this._data.pGuild.name}**'s ${this._type} list.`
        );

        return this._collection;
    }

    private _getEmbedDecdiable(embed: MessageEmbed) {
        return this._collection.find(d => {
            const sentences = embed.description.split('\n');
            const idSentence = sentences[sentences.length - 1];
            const id = idSentence.split(' ')[1];
            return d._id == id;
        })
    }

    private async _onMenuItemClicked(interaction: ButtonInteraction, id: string, emoji: string) {
        this.row.getAll('Button').forEach(btn => btn.resetTimer());

        const embedToSend: MessageEmbed = this[`_on${id.toPascalCase()}`](interaction);

        if (!this._collection.length || !embedToSend) {
            this._data.replyReturn(`No more ${this._type.toLowerCase()}s saved!`);
            return this.row.get('Button', 'Stop').onclick(interaction);
        }

        this._sent.editEmbeds(embedToSend);

    }
    private _onLeft(interaction: ButtonInteraction) {
        return this._direction(-1);
    }
    private _onThumbsUp(interaction: ButtonInteraction) {
        return this._onVerdict(true, interaction.member as GuildMember);
    }
    private _onThumbsDown(interaction: ButtonInteraction) {
        return this._onVerdict(false, interaction.member as GuildMember);
    }
    private _onBin(interaction: ButtonInteraction) {
        return this._direction(0);
    }
    private _onRight(interaction: ButtonInteraction) {
        return this._direction(1);
    }
    private _onStop(interaction: ButtonInteraction) {
        return this._collector.stop(StopRequest);
    }
    private async _onVerdict(approved: boolean, by: GuildMember) {
        if (!this._data.is('Suggestion')) return this.embed;

        this._collection = await this._decide(approved, this._getEmbedDecdiable(this.embed) as Suggestion, by);
        this._embeds = this._createEmbeds(true);
        return this._direction(1);
    }

    private async _direction(direction: number): Promise<MessageEmbed> {
        if (!this._embeds) return null;

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

    private async _deleteDecidable(embed: MessageEmbed) {
        const decidable = this._getEmbedDecdiable(embed);
        this._collection = await this._removeDecidables(new PinguArray(decidable));
        this._embeds = this._createEmbeds(true);
        
        const { _sent, _direction } = this;
        return showSuccess(!this._collection.includes(decidable))

        async function showSuccess(succeeded: boolean) {
            const reaction = await _sent.react(succeeded ?  '✅' : '❌');
            await new Promise((resolve, reject) => (
                _sent.doIn(s => s.reactions.cache.get(reaction.emoji.id).remove(), 1500)
                    .then(r => resolve(r))
                    .catch(err => reject(err))
            ));
            return _direction(-1);
        }
    }

    private _decide(approved: boolean, suggestion: Suggestion, decidedBy: GuildMember) {
        suggestion = Suggestion.Decide(suggestion, approved, new PGuildMember(decidedBy));

        (async function updateSuggestionEmbed() {
            const channel = decidedBy.guild.channels.cache.get(suggestion.channel._id) as TextChannel;
            const message = await channel.messages.fetch(suggestion._id);
            return message.embeds[0].setFooter(`Suggestion was ${approved ? 'approved' : 'denied'} by ${decidedBy.user.username}`)
        })();

        return this._saveVerdictToPGuilds(suggestion as Decidable);
    }
    private async _saveVerdictToPGuilds(decidable: Decidable) {
        const itemIndex = this._collection.findIndex(d => d._id == decidable._id);
        this._collection[itemIndex] = decidable;
        await this._updatePGuildCollection('_saveverdictToPGuilds', `Decidable updated`);
        return this._collection;
    }

    private _updatePGuildCollection(script: string, reason: string) {
        const { _data: { pGuild, client }, _type, _collection } = this;
        pGuild.settings.config.decidables[`${_type.toLowerCase()}Config`][`${_type}s`] = _collection;
        return client.pGuilds.update(pGuild, `DecidableCollection: ${script}`, reason);
    }
}