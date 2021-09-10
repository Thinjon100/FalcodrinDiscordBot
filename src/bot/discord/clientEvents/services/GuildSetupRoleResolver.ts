import { Service, Inject } from "typedi";
import { Guild, GuildChannel, Role } from "discord.js";
import RoleModel from "../../../../repository/models/RoleModel";
import Repository from "../../../../repository/Repository";
import DiscordClient from "../../DiscordClient";
import { eventName as muteRoleInChannelEvent } from "../MuteRoleInChannelEventHandler";
import GuildMuteRoleLocator from "./GuildMuteRoleLocator";

export const mutedRoleName: string = "Muted";

@Service()
class GuildSetupRoleResolver {
    
    constructor(
        @Inject()
        private readonly _repo: Repository,
        @Inject()
        private readonly _muteRoleLocator: GuildMuteRoleLocator
    ){

    }

    public resolveGuildRolesAsync = async(dc: DiscordClient, guild: Guild, roles: Role[], channels: GuildChannel[]) : Promise<void> => {
        const roleModels = await this._repo.roles.selectAll(guild.id);

        const excessRoles = roleModels.filter((rm) => roles.find((r) => r.id == rm.role_id) === undefined);
        const deletePromises = excessRoles.map(async (r) => {
            await this._repo.roles.delete(guild.id, r.role_id);
        });
        await Promise.all(deletePromises);

        const upsertPromises = roles.map(async (role: Role) => {
            var newRole = new RoleModel(role);
            await this._repo.roles.insert(newRole);
        });
        await Promise.all(upsertPromises);
        
        await this.setupMutedRoleAsync(dc, guild, roles, channels);
    }

    public setupMutedRoleAsync = async(dc: DiscordClient, guild: Guild, roles: Role[], channels: GuildChannel[]) : Promise<void> => {
        const mutedRole = await this._muteRoleLocator.getMutedRoleAsync(guild, roles);
        if (mutedRole !== undefined) {
            return;
        }
        try {
            const newRole =  await guild.roles.create({
                name: mutedRoleName,
                permissions: [],
                color: 4211787
              });
            await this._repo.guilds.updateMuteRole(guild.id, newRole.id);
            channels.forEach(c => dc.emit(muteRoleInChannelEvent, newRole, c, guild.me));
        } catch(err) {
            console.error(err);
        }
    }
}

export { GuildSetupRoleResolver };