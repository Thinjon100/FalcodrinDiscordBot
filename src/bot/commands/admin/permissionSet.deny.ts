import { Inject, Service } from "typedi";
import { CommandInteraction, User, Role, GuildMember } from "discord.js";
import ICommandParameterResolver from "../ICommandParameterResolver";
import ICommandExecutor from "../ICommandExecutor";
import CommandExecutionContext from "../CommandExecutionContext";
import { CommandHandler, CommandHandlerToken } from "../CommandHandler";
import CommandDefinition from "../CommandDefinition";
import { DefaultTo } from "../ConfigurableSetting";
import { PermissionSetHandler } from "./permissionSet";
import Repository from "../../../repository/Repository";

const permissionSetIdParamName: string = "permissionsetid";
const mentionableParamName: string = "mention";

export class PermissionSetDenyParameters {
    public permissionSet_id: number;
    public user?: User;
    public role?: Role;
}

@Service()
class PermissionSetDenyParameterResolver implements ICommandParameterResolver<PermissionSetDenyParameters> {
    public resolveInteraction = async (commandInteraction: CommandInteraction): Promise<PermissionSetDenyParameters | undefined> => {
        const permissionSet_id = commandInteraction.options.getNumber(permissionSetIdParamName, true);
        if (permissionSet_id === undefined || permissionSet_id === null){
            return undefined;
        }
        const mentionable = commandInteraction.options.getMentionable(mentionableParamName, true);
        const allowParams: PermissionSetDenyParameters = { permissionSet_id: permissionSet_id };

        if (mentionable instanceof GuildMember) allowParams.user = mentionable.user;
        if (mentionable instanceof User) allowParams.user = mentionable;
        if (mentionable instanceof Role) allowParams.role = mentionable;

        return allowParams;
    }
}

@Service()
class PermissionSetDenyExecutor implements ICommandExecutor<PermissionSetDenyParameters> {

    constructor( @Inject() private readonly _repo: Repository ){}

    public execute = async (parameters: PermissionSetDenyParameters, executionContext: CommandExecutionContext): Promise<void> => {
        if (parameters.role === undefined && parameters.user === undefined){
            await executionContext.replyPrivate('Unable to find role or user to deny.');
            return;
        }
        if (parameters.role !== undefined){
            await this._repo.permissionSets.setRoleAccess({
                guild_id : executionContext.guild.id,
                permissionSet_id : parameters.permissionSet_id,
                role_id : parameters.role.id,
                allow : false
            });
            await executionContext.replyPrivate(`Role ${parameters.role} denied.`);
            return;
        }
        if (parameters.user !== undefined){
            await this._repo.permissionSets.setUserAccess({
                guild_id : executionContext.guild.id,
                permissionSet_id : parameters.permissionSet_id,
                user_id : parameters.user.id,
                allow : false
            });
            await executionContext.replyPrivate(`User ${parameters.user} denied.`);
            return;
        }
    }
}

@Service({ id: CommandHandlerToken, multiple: true })
class PermissionSetDenyHandler extends CommandHandler<PermissionSetDenyParameters> {

    public static readonly CommandName: string = "deny";

    constructor( @Inject() resolver: PermissionSetDenyParameterResolver, @Inject() executor: PermissionSetDenyExecutor) {
        super(resolver, executor);
    }

    public definition: CommandDefinition = {
        name: PermissionSetHandler.CommandName + "." + PermissionSetDenyHandler.CommandName,
        category: "admin",
        parentCommand: PermissionSetHandler.CommandName,
        description: "Deny a User or Role in this permission set",
        adminOnly: true,
        logUsage: new DefaultTo<boolean>(true),
        suppressOutput: new DefaultTo<boolean>(true),
        interactions: [
            {
                name: PermissionSetDenyHandler.CommandName,
                accessibleByDefault: true,
                options: [
                    {
                        type: "NUMBER",
                        name: permissionSetIdParamName,
                        description: "ID of the Permission Set to modify",
                        required: true
                    },
                    {
                        type: "MENTIONABLE",
                        name: mentionableParamName,
                        description: "Role or User mention to deny",
                        required: true
                    }
                ]
            }
        ]
    };

    public supportsInteraction = async (commandInteraction: CommandInteraction) : Promise<boolean> => {
        return commandInteraction.commandName === PermissionSetHandler.CommandName && commandInteraction.options.getSubcommand() === PermissionSetDenyHandler.CommandName;
    }

}

export { PermissionSetDenyHandler };

