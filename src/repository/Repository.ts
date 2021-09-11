import { Inject, Service } from "typedi";
import CommandRepository from "./tables/CommandRepository";
import GuildRepository from "./tables/GuildRepository";
import PermissionSetRepository from "./tables/PermissionSetRepository";
import RoleRepository from "./tables/RoleRepository";

@Service()
class Repository {
    constructor(
        @Inject() public guilds: GuildRepository,
        @Inject() public roles: RoleRepository,
        @Inject() public commands: CommandRepository,
        @Inject() public permissionSets: PermissionSetRepository
    ){}

    public ready = async():Promise<unknown> => {
        return await Promise.all([
            this.guilds.Ready, 
            this.roles.Ready,
            this.commands.Ready,
            this.permissionSets.Ready
        ]);
    }
}

export default Repository;