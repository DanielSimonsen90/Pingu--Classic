import * as mongoose from 'mongoose';
import { PinguGuild } from '../pingu/guild/PinguGuild';
import { PinguGuildSettings, PItem, PClient, PinguGuildMember } from "./parts";

const PinguGuildSchema = mongoose.model('PinguGuild', new mongoose.Schema({
    _id: String,
    name: String,
    guildOwner: PItem,
    clients: [PClient],
    members: {
        type: Map,
        of: PinguGuildMember
    },
    settings: PinguGuildSettings,
})) as mongoose.Model<mongoose.Document<PinguGuild>>

export { PinguGuildSchema };