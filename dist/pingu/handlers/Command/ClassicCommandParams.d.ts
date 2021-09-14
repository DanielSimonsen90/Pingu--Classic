import { Message } from "discord.js";
import Arguments from "../../helpers/Arguments";
import PinguClientBase from "../client/PinguClientBase";
export default interface ClassicCommandParams {
    client?: PinguClientBase;
    message?: Message;
    args?: Arguments;
}
