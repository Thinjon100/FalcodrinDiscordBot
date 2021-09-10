import { Service, Inject } from "typedi";
import { Guild, Role } from "discord.js";
import Repository from "../../../../repository/Repository";
import { mutedRoleName } from "./GuildSetupRoleResolver";

@Service()
class GuildMuteRoleLocator {
    
    constructor(
        @Inject()
        private readonly _repo: Repository
    ){

    }

    public getMutedRoleAsync = async(guild: Guild, roles: Role[]) : Promise<Role|undefined> => {
        const guildModel = await this._repo.guilds.select(guild.id);
        const muteRoleId = guildModel?.muteRoleID;
        if (muteRoleId !== null && muteRoleId !== undefined){
            const muteRoleById = roles.find(x => x.id == muteRoleId);
            if (muteRoleById !== undefined) {
                return muteRoleById;
            }
        }
        return roles.find(r => r.name.toLowerCase() === mutedRoleName.toLowerCase());
    }
}

export default GuildMuteRoleLocator;