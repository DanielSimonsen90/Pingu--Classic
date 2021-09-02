export { PAchievement, PChannel, PClient, PGuild, PGuildMember, PItem, PMarry, PQueue, PRole, PUser } from './json';

import PinguClientBase from "../pingu/client/PinguClientBase";

export async function DBExecute<T>(client: PinguClientBase, callback: (mongoose: typeof import('mongoose')) => Promise<T>) {
    return new Promise<T>(async (resolve, reject) => {
        const mongoose = require('mongoose');

        try {
            await mongoose.connect(`mongodb+srv://Pingu:${client.config.mongoPass}@pingudb.kh2uq.mongodb.net/PinguDB?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            resolve(callback(mongoose));
        } catch (err) { 
            client.log('error', 'Mongo error', null, new Error(err)); 
            reject(err);
        }
        //finally { mongoose.connection.close(); }
    })
}