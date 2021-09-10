import { Container, Inject, Service } from "typedi";
import { ApplicationCommand, ApplicationCommandData, Guild } from "discord.js";
import CommandHandlerToken from "../../../commands";
import CommandDefinition from "../../../commands/CommandDefinition";
import ApplicationCommandDataFactory from "../factories/ApplicationCommandDataFactory";

@Service()
class GuildApplicationCommandCreationService {

    constructor (@Inject() private readonly _applicationCommandDataFactory: ApplicationCommandDataFactory) {}

    public createApplicationCommandsAsync = async(guild: Guild, command: CommandDefinition) => {        
        const commands = Container.getMany(CommandHandlerToken);

        if (command.interactions.length !== 1) {
            return;
        }

        const childCommands = commands.filter(c => c.definition.parentCommand === command.name).map(c => c.definition);

        const applicationCommandData = this._applicationCommandDataFactory.createApplicationCommandData(command, childCommands);

        if (applicationCommandData === undefined || applicationCommandData.length !== 1) {
            return;
        }

        return await this.createApplicationCommandAsync(guild, applicationCommandData[0]);
    }

    public createApplicationCommandAsync = async(guild: Guild, applicationCommand: ApplicationCommandData) : Promise<ApplicationCommand | undefined> => {
        try {
            return await guild.commands.create(applicationCommand);
        }
        catch (err){
            console.error(err);
        }
        return undefined;
    }
}

export default GuildApplicationCommandCreationService;