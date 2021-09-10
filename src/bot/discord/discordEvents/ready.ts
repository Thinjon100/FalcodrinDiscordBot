import { Service } from "typedi";
import { Guild } from "discord.js";
import DiscordClient from "../DiscordClient";
import { IDiscordEventHandler, DiscordEventHandlerToken } from "./IDiscordEventHandler";
import { eventName as guildSetupEventName } from "../clientEvents/GuildSetupClientEventHandler";

@Service({ id: DiscordEventHandlerToken, multiple: true })
class ReadyEventHandler implements IDiscordEventHandler {
    public eventName: string = "ready";

    public handler = async (discordClient: DiscordClient) => {
        const client = discordClient.Client;
        
        console.log(`I am ready! Logged in as ${client.user?.tag}!`);
	    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`); 
        
        const inviteLink = client.generateInvite({
            permissions: [
                "ADD_REACTIONS",
                "ATTACH_FILES",
                "BAN_MEMBERS",
                "CHANGE_NICKNAME",
                "CONNECT",
                "CREATE_INSTANT_INVITE",
                "DEAFEN_MEMBERS",
                "EMBED_LINKS",
                "KICK_MEMBERS",
                "MANAGE_CHANNELS",
                "MANAGE_GUILD",
                "MANAGE_MESSAGES",
                "MANAGE_NICKNAMES",
                "MANAGE_ROLES",
                "MANAGE_WEBHOOKS",
                "MENTION_EVERYONE",
                "MOVE_MEMBERS",
                "MUTE_MEMBERS",
                "PRIORITY_SPEAKER",
                "READ_MESSAGE_HISTORY",
                "SEND_MESSAGES",
                "SEND_TTS_MESSAGES",
                "SPEAK",
                "STREAM",
                "USE_EXTERNAL_EMOJIS",
                "VIEW_AUDIT_LOG",
                "VIEW_CHANNEL",
                "VIEW_GUILD_INSIGHTS"
            ],
            scopes: [
                "bot",
                "applications.commands"
            ]
        });
        
        console.log(`Generated bot invite link: ${inviteLink}`);

        client.guilds.cache.forEach((guild: Guild) => {
            discordClient.emit(guildSetupEventName, guild);
        });

        // Setup other static listeners

        discordClient.emit("ready");
    }
}

export default ReadyEventHandler;