export { PAchievement, PChannel, PClient, PGuild, PGuildMember, PItem, PMarry, PQueue, PRole, PUser } from './json';

import { Client } from 'discord.js'
import { errorLog } from "../pingu/library/PinguLibrary";
import { ToPinguClient } from "../pingu/client/PinguClient";

export async function DBExecute(client: Client, callback: (mongoose: typeof import('mongoose')) => void) {
    const mongoose = require('mongoose');
    try {
        await mongoose.connect(`mongodb+srv://Pingu:${ToPinguClient(client).config.mongoPass}@pingudb.kh2uq.mongodb.net/PinguDB?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await callback(mongoose);
    } catch (err) { errorLog(client, 'Mongo error', null, new Error(err)); }
    //finally { mongoose.connection.close(); }
}