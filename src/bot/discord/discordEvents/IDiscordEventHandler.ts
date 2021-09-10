import { Token } from "typedi";
import DiscordClient from "../DiscordClient";

export const DiscordEventHandlerToken = new Token<IDiscordEventHandler>("discordEventHandlers");

export interface IDiscordEventHandler {
    readonly eventName: string;
    handler: (client: DiscordClient, ...args: any[]) => void|Promise<void>;
}