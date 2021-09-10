import { ApplicationCommandOptionChoice, ApplicationCommandOptionType } from "discord.js";

export class CommandInteractionDefinition {
    public name: string;
    public accessibleByDefault: boolean;
    public options: CommandInteractionOptionDefinition[];
}

export class CommandInteractionOptionDefinition {
    public type: ApplicationCommandOptionType;
    public name: string;
    public description: string;
    public required?: boolean;
    public choices?: ApplicationCommandOptionChoice[];
    public options?: CommandInteractionOptionDefinition[];
}