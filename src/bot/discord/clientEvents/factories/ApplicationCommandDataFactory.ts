import { Service } from "typedi";
import { ApplicationCommandData, ApplicationCommandOption } from "discord.js";
import CommandDefinition from "../../../commands/CommandDefinition";
import { CommandInteractionOptionDefinition } from "../../../commands/CommandInteractionDefinition";

@Service()
class ApplicationCommandDataFactory {

    public createApplicationCommandData = (command: CommandDefinition, childCommands: CommandDefinition[]) : ApplicationCommandData[] | undefined => {

        if (command.interactions.length === 0) {
            return;
        }

        return command.interactions.map(x => {
            return {
                name: x.name,
                description: command.description,
                defaultPermission: x.accessibleByDefault,
                options: this.buildCommandOptions(x.options, childCommands)
            }
        });
    }

    public buildCommandOptions = (interactionOptions: CommandInteractionOptionDefinition[], childCommands?: CommandDefinition[]) : ApplicationCommandOption[] => {
        const optionsData: ApplicationCommandOption[] = this.buildNonSubCommandOptions(interactionOptions);
        if (childCommands === undefined || childCommands.length === 0) return optionsData;
        childCommands.forEach(cc => {
            const ccOpts = this.buildSubCommandOptions(cc);
            if (ccOpts !== undefined && ccOpts.length > 0) {
                ccOpts.forEach(x => optionsData.push({
                    type: "SUB_COMMAND",
                    name: x.name,
                    description: x.description,
                    options: x.options
                }));
            }
        })
        return optionsData;
    }

    public buildNonSubCommandOptions = (interactionOptions: CommandInteractionOptionDefinition[]) => {
        return interactionOptions.map(x => this.buildNonSubCommandOption(x));
    }

    public buildNonSubCommandOption = (interactionOption: CommandInteractionOptionDefinition) => {
        if (interactionOption.type == "SUB_COMMAND") throw new Error("Cannot build subcommand option");
        if (interactionOption.type == "SUB_COMMAND_GROUP") throw new Error("Cannot build subcommand group option");
        return {
            type: interactionOption.type,
            name: interactionOption.name,
            description: interactionOption.description,
            required: interactionOption.required,
            choices: interactionOption.choices
        };
    }

    public buildSubCommandOptions = (command: CommandDefinition) => {
        if (command.interactions.length === 0) {
            return;
        }
        return command.interactions.map(x => {
            return {
                type: "SUB_COMMAND",
                name: x.name,
                description: command.description,
                options: this.buildNonSubCommandOptions(x.options)
            };
        });
    }

}

export default ApplicationCommandDataFactory;