import { Inject, Service } from "typedi";
import { CommandInteraction } from "discord.js";
import ICommandParameterResolver from "../ICommandParameterResolver";
import ICommandExecutor from "../ICommandExecutor";
import CommandExecutionContext from "../CommandExecutionContext";
import { CommandHandler, CommandHandlerToken } from "../CommandHandler";
import CommandDefinition from "../CommandDefinition";
import { DefaultTo } from "../ConfigurableSetting";
import { mooToStr } from "../../utils/cowCode";

const mooParamName: string = "moo";

class UnmooParameters {
    public moo: string;
}

@Service()
class UnmooParameterResolver implements ICommandParameterResolver<UnmooParameters> {
    public resolveInteraction = async (commandInteraction: CommandInteraction): Promise<UnmooParameters | undefined> => {
        const moo = commandInteraction.options.getString(mooParamName, true);
        if (moo === undefined || moo === null || moo.length === 0){
            return undefined;
        }
        return { moo: moo };
    }
}

@Service()
class UnmooExecutor implements ICommandExecutor<UnmooParameters> {
    public execute = async (parameters: UnmooParameters, executionContext: CommandExecutionContext): Promise<void> => {
        const mooString = parameters.moo;

        if (mooString.length === 0 || mooString[0].toLowerCase() !== "m")
        {
            await executionContext.replyPrivate("Imposter Cow detected.  Invalid moo code.");
            return;
        }

        const mooCode = mooString.slice(1);
        try {
            const translatedMessage = mooToStr(mooCode);
            await executionContext.replyPrivate(translatedMessage);
        } catch {
            await executionContext.replyPrivate("Imposter Cow detected.  Invalid moo code.");
        }
    }
}

@Service({ id: CommandHandlerToken, multiple: true })
class UnmooHandler extends CommandHandler<UnmooParameters> {

    public static readonly CommandName: string = "unmoo";

    constructor( @Inject() resolver: UnmooParameterResolver, @Inject() executor: UnmooExecutor) {
        super(resolver, executor);
    }

    public definition: CommandDefinition = {
        name: UnmooHandler.CommandName,
        category: "fun",
        description: "Translates Moo into human",
        adminOnly: true,
        logUsage: new DefaultTo<boolean>(false),
        suppressOutput: new DefaultTo<boolean>(true),
        interactions: [
            {
                name: UnmooHandler.CommandName,
                accessibleByDefault: true,
                options: [
                    {
                        type: "STRING",
                        name: mooParamName,
                        description: "Mᴏ𐐬Ⲟ𐓂Ⲟ𐓂оoᴏ𐐬ⲞⲟꓳОꓳОⲞOⲞꓳⲞⲟ",
                        required: true
                    }
                ]
            }
        ]
    };

    public supportsInteraction = async (commandInteraction: CommandInteraction) : Promise<boolean> => {
        return commandInteraction.commandName === UnmooHandler.CommandName;
    }
}

export { UnmooHandler };