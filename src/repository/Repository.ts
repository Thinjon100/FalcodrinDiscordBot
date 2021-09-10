import { Inject, Service } from "typedi";
import CommandRepository from "./tables/CommandRepository";
import GuildRepository from "./tables/GuildRepository";
import RoleRepository from "./tables/RoleRepository";

@Service()
class Repository {
    constructor(
        @Inject() public guilds: GuildRepository,
        @Inject() public roles: RoleRepository,
        @Inject() public commands: CommandRepository
    ){}

    public ready = async():Promise<unknown> => {
        return await Promise.all([
            this.guilds.Ready, 
            this.roles.Ready,
            this.commands.Ready
        ]);
    }
}

export default Repository;