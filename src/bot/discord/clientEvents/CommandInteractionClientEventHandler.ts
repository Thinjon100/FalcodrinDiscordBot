import { Container, Service } from "typedi";
import { CommandInteraction } from "discord.js";
import DiscordClient from "../DiscordClient";
import { IClientEventHandler, ClientEventHandlerToken } from "./IClientEventHandler";
import { CommandHandlerToken, ICommandHandler } from "../../commands/CommandHandler";

export const eventName: string = "commandInteraction";

@Service({ id: ClientEventHandlerToken, multiple: true })
class CommandInteractionClientEventHandler implements IClientEventHandler {

    public eventName: string = eventName;

    private readonly _commandHandlers: ICommandHandler[];

    constructor() {
        this._commandHandlers = Container.getMany(CommandHandlerToken)
    }

    public bind = (discordClient: DiscordClient) => {
        discordClient.on(eventName, this.onCommandInteraction.bind(this, discordClient));
    }

    public async onCommandInteraction(_: DiscordClient, commandInteraction: CommandInteraction) {
        /*var embed = new MessageEmbed();
        embed.description = "This is a test embed";
        commandInteraction.reply({ embeds: [embed], ephemeral: true});
        console.log('command interaction:', commandInteraction);*/

        const handlers: ICommandHandler[] = [];
        for(const ch of this._commandHandlers) {
            const canHandle = await ch.supportsInteraction(commandInteraction);
            if (canHandle) {
                handlers.push(ch);
            }
        }

        const handlePromises = handlers.map(x => x.handleCommandInteraction(commandInteraction));
        await Promise.all(handlePromises);
    }
}

export { CommandInteractionClientEventHandler };