import * as mongoose from 'mongoose';
import PinguGuild from '../pingu/guild/PinguGuild';
import { PinguGuildSettings, PItem, PClient, PinguGuildMember } from "./parts";

export const PinguGuildSchema = mongoose.model('PinguGuild', new mongoose.Schema({
    _id: String,
    name: String,
    guildOwner: PItem,
    clients: [PClient],
    members: { type: Map, of: PinguGuildMember },
    settings: PinguGuildSettings,
    joinedAt: Date
})) as mongoose.Model<mongoose.Document<PinguGuild>>

export default PinguGuildSchema