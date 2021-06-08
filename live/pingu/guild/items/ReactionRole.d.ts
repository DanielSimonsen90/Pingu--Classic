import { Message, Role, MessageReaction, Client, User } from "discord.js";
import { PinguGuild } from "../PinguGuild";
import { PRole, PChannel } from "../../../database/json";
export declare function GetReactionRole(client: Client, reaction: MessageReaction, user: User): Promise<Role>;
export declare function OnReactionAdd(reaction: MessageReaction, user: User): Promise<void>;
export declare function OnReactionRemove(reaction: MessageReaction, user: User): Promise<void>;
export declare function OnReactionRemoveAll(message: Message, client?: Client): Promise<PinguGuild>;
export declare function RemoveReaction(reaction: MessageReaction): Promise<void>;
export declare function RemoveReactionRole(rr: ReactionRole, reactionRoles: ReactionRole[], pGuild: PinguGuild, client: Client): Promise<void>;
export declare function OnMessageDelete(message: Message): Promise<Message>;
export declare class ReactionRole {
    constructor(message: Message, reactionName: string, role: Role);
    channel: PChannel;
    messageID: string;
    emoteName: string;
    pRole: PRole;
    static GetReactionRole(client: Client, reaction: MessageReaction, user: User): Promise<Role>;
    static OnReactionAdd(reaction: MessageReaction, user: User): Promise<void>;
    static OnReactionRemove(reaction: MessageReaction, user: User): Promise<void>;
    static OnReactionRemoveAll(message: Message, client?: Client): Promise<PinguGuild>;
    static RemoveReaction(reaction: MessageReaction): Promise<void>;
    static RemoveReactionRole(rr: ReactionRole, reactionRoles: ReactionRole[], pGuild: PinguGuild, client: Client): Promise<void>;
    static OnMessageDelete(message: Message): Promise<Message>;
}
export default ReactionRole;
