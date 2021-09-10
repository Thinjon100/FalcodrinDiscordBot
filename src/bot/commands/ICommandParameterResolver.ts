import { CommandInteraction } from "discord.js";

export default interface ICommandParameterResolver<T> {
    resolveInteraction: (commandInteraction: CommandInteraction) => Promise<T|undefined>;
}