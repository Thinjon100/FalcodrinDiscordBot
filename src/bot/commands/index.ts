import { Container } from "typedi";
import { CommandHandlerToken } from "./CommandHandler";
import adminCommands from "./admin";
import funCommands from "./fun";
import infoCommands from "./info";
import modCommands from "./mod";

const commandHandlers: Function[] = 
    adminCommands
    .concat(funCommands)
    .concat(infoCommands)
    .concat(modCommands);

Container.import(commandHandlers);

export default CommandHandlerToken;