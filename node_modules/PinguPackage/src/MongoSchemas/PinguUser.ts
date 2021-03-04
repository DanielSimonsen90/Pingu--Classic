import * as mongoose from 'mongoose';
import {PinguUser} from '../pingu/user/PinguUser';
import { PItem, Marry, Daily, Playlist, AchievementsConfig } from "./parts";

const PinguUserSchema = mongoose.model('PinguUser', new mongoose.Schema({
    _id: String,
    tag: String,
    sharedServers: [PItem],
    marry: Marry,
    replyPerson: PItem,
    daily: Daily,
    avatar: String,
    playlists: [Playlist],
    achievementConfig: AchievementsConfig
})) as mongoose.Model<mongoose.Document<PinguUser>>
 
export {PinguUserSchema};