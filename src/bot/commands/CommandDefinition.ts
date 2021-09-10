import { PermissionString } from "discord.js";
import { CommandInteractionDefinition } from "./CommandInteractionDefinition";
import { Configurable } from "./ConfigurableSetting";

export default class CommandDefinition {
    public name: string;
    public category: string;
    public parentCommand?: string;
    public childCommands?: string[];
    public description: string;
    public defaultUserPermissions?: PermissionString[];
    public logUsage: Configurable<boolean>;
    public suppressOutput: Configurable<boolean>;
    public adminOnly?: boolean;
    public interactions: CommandInteractionDefinition[];
}