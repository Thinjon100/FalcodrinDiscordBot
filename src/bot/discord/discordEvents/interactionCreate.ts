import { Service } from "typedi";
import { CommandInteraction, GuildMember, Interaction } from "discord.js";
import DiscordClient from "../DiscordClient";
import { IDiscordEventHandler, DiscordEventHandlerToken } from "./IDiscordEventHandler";
import { eventName } from "../clientEvents/CommandInteractionClientEventHandler";

@Service({ id: DiscordEventHandlerToken, multiple: true })
class InteractionCreateEventHandler implements IDiscordEventHandler {
    public eventName: string = "interactionCreate";

    public handler = async (discordClient: DiscordClient, interaction: Interaction) => {
        if (!interaction.isCommand()) return;
        var commandInteraction : CommandInteraction = interaction;

        if (interaction.guild === null || interaction.member === null || !(interaction.member instanceof GuildMember)) return;

        discordClient.emit(eventName, commandInteraction);
    }
}

export default InteractionCreateEventHandler;