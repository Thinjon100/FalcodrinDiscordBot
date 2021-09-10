import { Container } from "typedi";
import { DiscordEventHandlerToken } from "./IDiscordEventHandler";
import interactionCreate from "./interactionCreate";
import ready from "./ready";

const eventHandlers: Function[] = [
    interactionCreate,
    ready
];

Container.import(eventHandlers);

export default DiscordEventHandlerToken;