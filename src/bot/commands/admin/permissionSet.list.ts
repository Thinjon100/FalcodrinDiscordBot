import { Inject, Service } from "typedi";
import { CommandInteraction, MessageEmbed } from "discord.js";
import ICommandParameterResolver from "../ICommandParameterResolver";
import ICommandExecutor from "../ICommandExecutor";
import CommandExecutionContext from "../CommandExecutionContext";
import { CommandHandler, CommandHandlerToken } from "../CommandHandler";
import CommandDefinition from "../CommandDefinition";
import { DefaultTo } from "../ConfigurableSetting";
import { PermissionSetHandler } from "./permissionSet";
import Repository from "../../../repository/Repository";
import PermissionSetModel from "../../../repository/models/PermissionSetModel";
import { ChannelUsagePermission } from "../../../repository/models/PermissionSetChannelModel";
import MentionFormatService from "../../discord/services/MentionFormatService";

@Service()
class PermissionSetListParameterResolver implements ICommandParameterResolver<{}> {
    public resolveInteraction = async (_commandInteraction: CommandInteraction): Promise<{} | undefined> => {
        return {};
    }
}

@Service()
class PermissionSetListExecutor implements ICommandExecutor<{}> {

    constructor( 
        @Inject() private readonly _repo: Repository,
        @Inject() private readonly _formatter: MentionFormatService
    ){}

    public execute = async (_parameters: {}, executionContext: CommandExecutionContext): Promise<void> => {
        const permissionSets = await this._repo.permissionSets.selectAll(executionContext.guild.id);
        if (permissionSets.length === 0) {
            await executionContext.replyPrivate('There are no permission sets.');
            return;
        }

        const embed = new MessageEmbed()
            .setTitle('Permission Sets')
            .setDescription(`${permissionSets.length} permission set(s).`);
        
        for(const pset of permissionSets) {
            const desc = await this.getSetDescription(pset);
            embed.addField(`(${pset.permissionSet_id}) ${pset.name}`, desc);
        }
        
        await executionContext.replyPrivate({embeds: [embed]});
    }

    private getSetDescription = async (permissionSet: PermissionSetModel) : Promise<string> => {
        const descriptions = await Promise.all([
            this.getRolesDescription(permissionSet),
            this.getUsersDescription(permissionSet),
            this.getChannelsDescription(permissionSet)
        ]);
        return descriptions.filter(x => x !== undefined).join('\r\n') || "No permissions setup";
    }

    private getRolesDescription = async (permissionSet: PermissionSetModel) : Promise<string|undefined> => {
        const roles = await this._repo.permissionSets.selectRoles(permissionSet.guild_id, permissionSet.permissionSet_id);
        if (roles.length === 0) return;
        const allowedRoles = roles.filter(x => x.allow).map(x => x.role_id);
        const deniedRoles = roles.filter(x => !x.allow).map(x => x.role_id);
        const descs: string[] = [];
        if (allowedRoles.length > 0){
            const aRoles = allowedRoles.map(this._formatter.formatRole).join(', ');
            descs.push(`Allowed: ${aRoles}`);
        }
        if (deniedRoles.length > 0){
            const dRoles = deniedRoles.map(this._formatter.formatRole).join(', ');
            descs.push(`Denied: ${dRoles}`);
        }
        return descs.join('\r\n');
    }

    private getUsersDescription = async (permissionSet: PermissionSetModel) : Promise<string|undefined> => {
        const users = await this._repo.permissionSets.selectUsers(permissionSet.guild_id, permissionSet.permissionSet_id);
        if (users.length === 0) return;
        const allowedUsers = users.filter(x => x.allow).map(x => x.user_id);
        const deniedUsers = users.filter(x => !x.allow).map(x => x.user_id);
        const descs: string[] = [];
        if (allowedUsers.length > 0){
            const aUsers = allowedUsers.map(this._formatter.formatMember).join(', ');
            descs.push(`Allowed: ${aUsers}`);
        }
        if (deniedUsers.length > 0){
            const dUsers = deniedUsers.map(this._formatter.formatMember).join(', ');
            descs.push(`Denied: ${dUsers}`);
        }
        return descs.join('\r\n');
    }

    private getChannelsDescription = async (permissionSet: PermissionSetModel) : Promise<string|undefined> => {
        const channels = await this._repo.permissionSets.selectChannels(permissionSet.guild_id, permissionSet.permissionSet_id);
        if (channels.length === 0) return;
        const deniedChannels = channels.filter(x => x.allowedUsage === ChannelUsagePermission.Deny).map(x => x.channel_id);
        const privateChannels = channels.filter(x => x.allowedUsage === ChannelUsagePermission.Private).map(x => x.channel_id);
        const publicChannels = channels.filter(x => x.allowedUsage === ChannelUsagePermission.Public).map(x => x.channel_id);
        return `Channels: ${deniedChannels.length} denied, ${privateChannels.length} private, ${publicChannels.length} public`;
    }
}

@Service({ id: CommandHandlerToken, multiple: true })
class PermissionSetListHandler extends CommandHandler<{}> {

    public static readonly CommandName: string = "list";

    constructor( @Inject() resolver: PermissionSetListParameterResolver, @Inject() executor: PermissionSetListExecutor) {
        super(resolver, executor);
    }

    public definition: CommandDefinition = {
        name: PermissionSetHandler.CommandName + "." + PermissionSetListHandler.CommandName,
        category: "admin",
        parentCommand: PermissionSetHandler.CommandName,
        description: "Lists Permission Sets",
        adminOnly: true,
        logUsage: new DefaultTo<boolean>(false),
        suppressOutput: new DefaultTo<boolean>(true),
        interactions: [
            {
                name: PermissionSetListHandler.CommandName,
                accessibleByDefault: true,
                options: []
            }
        ]
    };

    public supportsInteraction = async (commandInteraction: CommandInteraction) : Promise<boolean> => {
        return commandInteraction.commandName === PermissionSetHandler.CommandName && commandInteraction.options.getSubcommand() === PermissionSetListHandler.CommandName;
    }

}

export { PermissionSetListHandler };

