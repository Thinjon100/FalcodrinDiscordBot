import { Inject, Service } from "typedi";
import { CommandInteraction } from "discord.js";
import ICommandParameterResolver from "../ICommandParameterResolver";
import ICommandExecutor from "../ICommandExecutor";
import CommandExecutionContext from "../CommandExecutionContext";
import { CommandHandler, CommandHandlerToken } from "../CommandHandler";
import CommandDefinition from "../CommandDefinition";
import { DefaultTo } from "../ConfigurableSetting";
import { strToMoo } from "../../utils/cowCode";

const messageParamName: string = "message";

export class MooParameters {
    public message: string;
}

@Service()
class MooParameterResolver implements ICommandParameterResolver<MooParameters> {
    public resolveInteraction = async (commandInteraction: CommandInteraction): Promise<MooParameters | undefined> => {
        const message = commandInteraction.options.getString(messageParamName, true);
        if (message === undefined || message === null || message.length === 0){
            return undefined;
        }
        return { message: message };
    }
}

@Service()
class MooExecutor implements ICommandExecutor<MooParameters> {
    public execute = async (parameters: MooParameters, executionContext: CommandExecutionContext): Promise<void> => {
        const mooString = 'M' + strToMoo(parameters.message);

        await executionContext.replyPrivate(mooString);
    }
}

@Service({ id: CommandHandlerToken, multiple: true })
class MooHandler extends CommandHandler<MooParameters> {

    public static readonly CommandName: string = "moo";

    constructor( @Inject() resolver: MooParameterResolver, @Inject() executor: MooExecutor) {
        super(resolver, executor);
    }

    public definition: CommandDefinition = {
        name: MooHandler.CommandName,
        category: "fun",
        description: "Translates text into Moo",
        adminOnly: true,
        logUsage: new DefaultTo<boolean>(false),
        suppressOutput: new DefaultTo<boolean>(true),
        interactions: [
            {
                name: MooHandler.CommandName,
                accessibleByDefault: true,
                options: [
                    {
                        type: "STRING",
                        name: messageParamName,
                        description: "Message content to encode in Cow",
                        required: true
                    }
                ]
            }
        ]
    };

    public supportsInteraction = async (commandInteraction: CommandInteraction) : Promise<boolean> => {
        return commandInteraction.commandName === MooHandler.CommandName;
    }

}

export { MooHandler };