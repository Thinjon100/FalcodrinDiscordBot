import { Inject, Service } from "typedi";
import { CommandInteraction } from "discord.js";
import ICommandParameterResolver from "../ICommandParameterResolver";
import ICommandExecutor from "../ICommandExecutor";
import CommandExecutionContext from "../CommandExecutionContext";
import { CommandHandler, CommandHandlerToken } from "../CommandHandler";
import CommandDefinition from "../CommandDefinition";
import { DefaultTo } from "../ConfigurableSetting";
import { PermissionSetCreateHandler } from "./permissionSet.create";
import { PermissionSetListHandler } from "./permissionSet.list";
import { PermissionSetAllowHandler } from "./permissionSet.allow";

@Service()
class PermissionSetParameterResolver implements ICommandParameterResolver<void> {
    public resolveInteraction = async (_commandInteraction: CommandInteraction): Promise<void | undefined> => {}
}

@Service()
class PermissionSetExecutor implements ICommandExecutor<void> {
    public execute = async (_parameters: void, _executionContext: CommandExecutionContext): Promise<void> => {}
}


@Service({ id: CommandHandlerToken, multiple: true })
class PermissionSetHandler extends CommandHandler<void> {

    public static readonly CommandName: string = "pset";

    constructor( @Inject() resolver: PermissionSetParameterResolver, @Inject() executor: PermissionSetExecutor) {
        super(resolver, executor);
    }

    public definition: CommandDefinition = {
        name: PermissionSetHandler.CommandName,
        category: "admin",
        description: "Permission Set",
        childCommands: [
            PermissionSetHandler.CommandName + "." + PermissionSetCreateHandler.CommandName,
            PermissionSetHandler.CommandName + "." + PermissionSetListHandler.CommandName,
            PermissionSetHandler.CommandName + "." + PermissionSetAllowHandler.CommandName,
        ],
        adminOnly: true,
        logUsage: new DefaultTo<boolean>(true),
        suppressOutput: new DefaultTo<boolean>(true),
        interactions: [
            {
                name: PermissionSetHandler.CommandName,
                accessibleByDefault: true,
                options: []
            }
        ]
    };

    public supportsInteraction = async (_: CommandInteraction) : Promise<boolean> => {
        // This command doesn't do anything, all its subcommands do the work
        return false;
    }

}

export { PermissionSetHandler };

