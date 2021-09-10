import PClient from "../../database/json/PClient";
import PinguGuild from "../guild/PinguGuild";
import PinguGuildMember from "../guildMember/PinguGuildMember";
import PinguUser from "../user/PinguUser";
export default interface DBParams {
    pAuthor?: PinguUser;
    pGuildMember?: PinguGuildMember;
    pGuild?: PinguGuild;
    pGuildClient?: PClient;
}
