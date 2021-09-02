export { PAchievement, PChannel, PClient, PGuild, PGuildMember, PItem, PMarry, PQueue, PRole, PUser } from './json';

import BasePinguClient from "../pingu/client/BasePinguClient";

export async function DBExecute<T>(client: BasePinguClient, callback: (mongoose: typeof import('mongoose')) => Promise<T>) {
    const mongoose = require('mongoose');
    try {
        await mongoose.connect(`mongodb+srv://Pingu:${client.config.mongoPass}@pingudb.kh2uq.mongodb.net/PinguDB?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        var returnValue = await callback(mongoose);
    } catch (err) { client.log('error', 'Mongo error', null, new Error(err)); }
    //finally { mongoose.connection.close(); }
    return returnValue;
}