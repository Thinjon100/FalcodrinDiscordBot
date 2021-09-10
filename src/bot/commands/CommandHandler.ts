import { Token } from "typedi";
import { CommandInteraction, GuildMember, MessageOptions, TextChannel } from "discord.js";
import CommandExecutionContext from "./CommandExecutionContext";
import ICommandExecutor from "./ICommandExecutor";
import ICommandParameterResolver from "./ICommandParameterResolver";
import CommandDefinition from "./CommandDefinition";

function commandInteractionReply(this: CommandInteraction, ephemeral: boolean, messageOptions: string | MessageOptions) {
    if (typeof messageOptions === "string"){
        return this.reply({ content: messageOptions, ephemeral: ephemeral });
    }
    const mOpts = { ...messageOptions, ...{ ephemeral: ephemeral } };
    return this.reply(mOpts);
}

export interface ICommandHandler {
    definition: CommandDefinition;

    handleCommandInteraction: (commandInteraction: CommandInteraction) => Promise<void>;

    supportsInteraction: (commandInteraction: CommandInteraction) => Promise<boolean>;
}

export const CommandHandlerToken = new Token<ICommandHandler>("commandHandlers");

export abstract class CommandHandler<T> implements ICommandHandler {

    constructor(
        private readonly resolver: ICommandParameterResolver<T>,
        private readonly executor: ICommandExecutor<T>
    ) { }

    abstract definition: CommandDefinition;

    public handleCommandInteraction = async(commandInteraction: CommandInteraction) : Promise<void> =>{
        const commandParams = await this.resolver.resolveInteraction(commandInteraction);
        if (commandParams === undefined) {
            // Possibly put some logging here
            return;
        }
        const executionContext = await this.getExecutionContext(commandInteraction);
        if (executionContext === undefined){
            // Possibly put some logging here
            return;
        }
        await this.executor.execute(commandParams, executionContext);
    }

    abstract supportsInteraction: (commandInteraction: CommandInteraction) => Promise<boolean>;

    private getExecutionContext = async(commandInteraction: CommandInteraction) : Promise<CommandExecutionContext|undefined> => {
        if (commandInteraction.guild === null) return;
        if (!(commandInteraction.member instanceof GuildMember)) return;
        if (!(commandInteraction.channel instanceof TextChannel)) return;
        return {
            guildMember : commandInteraction.member,
            guild : commandInteraction.guild,
            channel : commandInteraction.channel,
            replyPrivate : commandInteractionReply.bind(commandInteraction, true),
            replyPublic : commandInteractionReply.bind(commandInteraction, false)
        };
    }
}