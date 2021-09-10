import { Token } from "typedi";
import DiscordClient from "../DiscordClient";

export const ClientEventHandlerToken = new Token<IClientEventHandler>("clientEventHandlers");

export interface IClientEventHandler {
    eventName: string;

    bind: (discordClient: DiscordClient) => void;
}