import { Inject, Service } from "typedi";
import { CommandInteraction } from "discord.js";
import ICommandParameterResolver from "../ICommandParameterResolver";
import ICommandExecutor from "../ICommandExecutor";
import CommandExecutionContext from "../CommandExecutionContext";
import { CommandHandler, CommandHandlerToken } from "../CommandHandler";
import CommandDefinition from "../CommandDefinition";
import { DefaultTo } from "../ConfigurableSetting";
import { PermissionSetHandler } from "./permissionSet";
import Repository from "../../../repository/Repository";

const nameParamName: string = "name";

export class PermissionSetCreateParameters {
    public name: string;
}

@Service()
class PermissionSetCreateParameterResolver implements ICommandParameterResolver<PermissionSetCreateParameters> {
    public resolveInteraction = async (commandInteraction: CommandInteraction): Promise<PermissionSetCreateParameters | undefined> => {
        const name = commandInteraction.options.getString(nameParamName, true);
        if (name === undefined || name === null || name.length === 0){
            return undefined;
        }
        return { name: name };
    }
}

@Service()
class PermissionSetCreateExecutor implements ICommandExecutor<PermissionSetCreateParameters> {

    constructor( @Inject() private readonly _repo: Repository ){}

    public execute = async (parameters: PermissionSetCreateParameters, executionContext: CommandExecutionContext): Promise<void> => {
        const permissionSet_id = await this._repo.permissionSets.insert(executionContext.guild.id, parameters.name);
        if (permissionSet_id === undefined){
            await executionContext.replyPrivate('There was an error while attempting to create permission set.');
        }
        await executionContext.replyPrivate(`Permission set ${permissionSet_id} created.`);
    }
}

@Service({ id: CommandHandlerToken, multiple: true })
class PermissionSetCreateHandler extends CommandHandler<PermissionSetCreateParameters> {

    public static readonly CommandName: string = "create";

    constructor( @Inject() resolver: PermissionSetCreateParameterResolver, @Inject() executor: PermissionSetCreateExecutor) {
        super(resolver, executor);
    }

    public definition: CommandDefinition = {
        name: PermissionSetHandler.CommandName + "." + PermissionSetCreateHandler.CommandName,
        category: "admin",
        parentCommand: PermissionSetHandler.CommandName,
        description: "Permission Set Create",
        adminOnly: true,
        logUsage: new DefaultTo<boolean>(true),
        suppressOutput: new DefaultTo<boolean>(true),
        interactions: [
            {
                name: PermissionSetCreateHandler.CommandName,
                accessibleByDefault: true,
                options: [
                    {
                        type: "STRING",
                        name: nameParamName,
                        description: "Name of the permission set to create",
                        required: true
                    }
                ]
            }
        ]
    };

    public supportsInteraction = async (commandInteraction: CommandInteraction) : Promise<boolean> => {
        return commandInteraction.commandName === PermissionSetHandler.CommandName && commandInteraction.options.getSubcommand() === PermissionSetCreateHandler.CommandName;
    }

}

export { PermissionSetCreateHandler };

