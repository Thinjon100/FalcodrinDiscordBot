import { Service, Inject } from "typedi";
import { Guild, GuildChannel } from "discord.js";
import GuildModel from "../../../repository/models/GuildModel";
import Repository from "../../../repository/Repository";
import DiscordClient from "../DiscordClient";
import { IClientEventHandler, ClientEventHandlerToken } from "./IClientEventHandler";
import { GuildSetupRoleResolver } from "./services/GuildSetupRoleResolver";
import { GuildSetupCommandResolver } from "./services/GuildSetupCommandResolver";

export const eventName: string = "setupGuild";

@Service({ id: ClientEventHandlerToken, multiple: true })
class GuildSetupClientEventHandler implements IClientEventHandler {

    public eventName: string = eventName;

    constructor(
        @Inject() private readonly _repo: Repository,
        @Inject() private readonly _roleResolver: GuildSetupRoleResolver,
        @Inject() private readonly _commandResolver: GuildSetupCommandResolver
    ){

    }

    public bind = (discordClient: DiscordClient) => {
        discordClient.on(eventName, this.onGuildSetup.bind(this, discordClient));
    }

    public onGuildSetup = async(dc: DiscordClient, guild: Guild) => {
        var newGuild = new GuildModel(guild);
        await this._repo.guilds.insert(newGuild);

        const roles = guild.roles.cache.map(x => x);
        const channels = <GuildChannel[]> guild.channels.cache.filter(x => x instanceof GuildChannel).map(x => x);
        await this._roleResolver.resolveGuildRolesAsync(dc, guild, roles, channels);

        await this._commandResolver.resolveGuildCommandsAsync(guild, roles, channels);
    }
};

export { GuildSetupClientEventHandler };
