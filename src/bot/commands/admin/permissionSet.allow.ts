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

export class PermissionSetAllowParameters {
    public permissionSet_id: number;
    public user?: User;
    public role?: Role;
}

@Service()
class PermissionSetAllowParameterResolver implements ICommandParameterResolver<PermissionSetAllowParameters> {
    public resolveInteraction = async (commandInteraction: CommandInteraction): Promise<PermissionSetAllowParameters | undefined> => {
        const permissionSet_id = commandInteraction.options.getNumber(permissionSetIdParamName, true);
        if (permissionSet_id === undefined || permissionSet_id === null){
            return undefined;
        }
        const mentionable = commandInteraction.options.getMentionable(mentionableParamName, true);
        const allowParams: PermissionSetAllowParameters = { permissionSet_id: permissionSet_id };

        if (mentionable instanceof GuildMember) allowParams.user = mentionable.user;
        if (mentionable instanceof User) allowParams.user = mentionable;
        if (mentionable instanceof Role) allowParams.role = mentionable;

        return allowParams;
    }
}

@Service()
class PermissionSetAllowExecutor implements ICommandExecutor<PermissionSetAllowParameters> {

    constructor( @Inject() private readonly _repo: Repository ){}

    public execute = async (parameters: PermissionSetAllowParameters, executionContext: CommandExecutionContext): Promise<void> => {
        if (parameters.role === undefined && parameters.user === undefined){
            await executionContext.replyPrivate('Unable to find role or user to allow.');
            return;
        }
        if (parameters.role !== undefined){
            await this._repo.permissionSets.setRoleAccess({
                guild_id : executionContext.guild.id,
                permissionSet_id : parameters.permissionSet_id,
                role_id : parameters.role.id,
                allow : true
            });
            await executionContext.replyPrivate(`Role ${parameters.role} allowed.`);
            return;
        }
        if (parameters.user !== undefined){
            await this._repo.permissionSets.setUserAccess({
                guild_id : executionContext.guild.id,
                permissionSet_id : parameters.permissionSet_id,
                user_id : parameters.user.id,
                allow : true
            });
            await executionContext.replyPrivate(`User ${parameters.user} allowed.`);
            return;
        }
    }
}

@Service({ id: CommandHandlerToken, multiple: true })
class PermissionSetAllowHandler extends CommandHandler<PermissionSetAllowParameters> {

    public static readonly CommandName: string = "allow";

    constructor( @Inject() resolver: PermissionSetAllowParameterResolver, @Inject() executor: PermissionSetAllowExecutor) {
        super(resolver, executor);
    }

    public definition: CommandDefinition = {
        name: PermissionSetHandler.CommandName + "." + PermissionSetAllowHandler.CommandName,
        category: "admin",
        parentCommand: PermissionSetHandler.CommandName,
        description: "Allow a User or Role in this permission set",
        adminOnly: true,
        logUsage: new DefaultTo<boolean>(true),
        suppressOutput: new DefaultTo<boolean>(true),
        interactions: [
            {
                name: PermissionSetAllowHandler.CommandName,
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
                        description: "Role or User mention to allow",
                        required: true
                    }
                ]
            }
        ]
    };

    public supportsInteraction = async (commandInteraction: CommandInteraction) : Promise<boolean> => {
        return commandInteraction.commandName === PermissionSetHandler.CommandName && commandInteraction.options.getSubcommand() === PermissionSetAllowHandler.CommandName;
    }

}

export { PermissionSetAllowHandler };

