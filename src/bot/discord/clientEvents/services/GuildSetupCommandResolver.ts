import { Container, Service, Inject } from "typedi";
import { ApplicationCommand, Guild, GuildChannel, Role } from "discord.js";
import Repository from "../../../../repository/Repository";
import CommandHandlerToken from "../../../commands";
import CommandDefinition from "../../../commands/CommandDefinition";
import GuildApplicationCommandCreationService from "./GuildApplicationCommandCreationService";

@Service()
class GuildSetupCommandResolver {
    
    constructor(
        @Inject() private readonly _repo: Repository,
        @Inject() private readonly _commandCreationService: GuildApplicationCommandCreationService
    ){

    }

    public resolveGuildCommandsAsync = async(guild: Guild, roles: Role[], channels: GuildChannel[]) : Promise<void> => {
        const commands = Container.getMany(CommandHandlerToken);

        const rootCommands = commands.filter(c => c.definition.parentCommand === undefined);

        const guildCommands = await guild.commands.fetch();

        // Delete any commands that we no longer have in source code
        const excessRegisteredCommands = guildCommands.filter(gc => rootCommands.find(rc => rc.definition.name == gc.name) === undefined);
        console.log('Deleting commands:', excessRegisteredCommands);
        const deletePromises = excessRegisteredCommands.map(c => guild.commands.delete(c));
        await Promise.all(deletePromises);

        const mappedCommands = rootCommands.map(rc => { 
            return { RootCommand: rc, ApplicationCommand: guildCommands.find(gc => gc.name == rc.definition.name )};
        });

        const existingCommands = mappedCommands.filter(x => x.ApplicationCommand !== undefined);
        const missingCommands = mappedCommands.filter(x => x.ApplicationCommand === undefined);

        const updatePromises = existingCommands.map(x => {
            if (x.ApplicationCommand === undefined) return Promise.resolve();
            return this.updateExistingCommandAsync(guild, roles, channels, x.RootCommand.definition, x.ApplicationCommand);
        });
        await Promise.all(updatePromises);

        const createPromises = missingCommands.map(x => {
            if (x.ApplicationCommand !== undefined) return Promise.resolve();
            return this.createMissingCommandAsync(guild, roles, channels, x.RootCommand.definition);
        })
        await Promise.all(createPromises);
    }

    public updateExistingCommandAsync = async(_guild: Guild, _roles: Role[], _channels: GuildChannel[], _command: CommandDefinition, _appCommand: ApplicationCommand) : Promise<void> => {
        //console.log('Handling existing command:', guild.name, roles.length, channels.length, command, appCommand);
        const optCount = _command.interactions[0].options.length + (_command.childCommands?.length || 0);
        if (_appCommand.options.length === optCount) return;
        
        console.log('Command definition:', _command, 'App command:', _appCommand);
    }

    public createMissingCommandAsync = async(guild: Guild, roles: Role[], channels: GuildChannel[], command: CommandDefinition) : Promise<void> => {
        const createResult = await this._commandCreationService.createApplicationCommandsAsync(guild, command);
        if (createResult === undefined) {
            return;
        }
        // Pass this through the update so any other post-create settings (like permissions) can be saved
        await this.updateExistingCommandAsync(guild, roles, channels, command, createResult);
    }
}

export { GuildSetupCommandResolver };