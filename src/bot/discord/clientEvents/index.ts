import { Container } from "typedi";
import { CommandInteractionClientEventHandler } from "./CommandInteractionClientEventHandler";
import { GuildSetupClientEventHandler } from "./GuildSetupClientEventHandler";
import { MuteRoleInChannelEventHandler } from "./MuteRoleInChannelEventHandler";
import { ClientEventHandlerToken } from "./IClientEventHandler";

const eventHandlers: Function[] = [
    CommandInteractionClientEventHandler,
    GuildSetupClientEventHandler,
    MuteRoleInChannelEventHandler
];

Container.import(eventHandlers);

export default ClientEventHandlerToken;