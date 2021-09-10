import CommandDefinition from "../../bot/commands/CommandDefinition";

export default class CommandModel {

    public guild_id: string;
    public name: string;
    public enabled: boolean;
    public logUsage: boolean;
    public suppressOutput: boolean;
    public permissionSet_id: number|null;
    public outputChannelId: string|null;

    constructor(guild_id: string, commandDefinition: CommandDefinition) {
        this.guild_id = guild_id;
        this.name = commandDefinition.name;
        this.enabled = true;
        this.logUsage = commandDefinition.logUsage.defaultValue;
        this.suppressOutput = commandDefinition.suppressOutput.defaultValue;
        this.permissionSet_id = null;
        this.outputChannelId = null;
    }

}