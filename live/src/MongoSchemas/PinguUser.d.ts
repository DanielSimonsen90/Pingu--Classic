import * as mongoose from 'mongoose';
import { PinguUser } from '../pingu/user/PinguUser';
declare const PinguUserSchema: mongoose.Model<mongoose.Document<PinguUser, any>, {}, {}>;
export { PinguUserSchema };
