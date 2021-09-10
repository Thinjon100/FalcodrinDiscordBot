import { Service } from "typedi";
import { GuildChannel, GuildMember, PermissionOverwriteOptions, PermissionString, Role } from "discord.js";
import DiscordClient from "../DiscordClient";
import { IClientEventHandler, ClientEventHandlerToken } from "./IClientEventHandler";

export const eventName: string = "muteRoleInChannel";

@Service({ id: ClientEventHandlerToken, multiple: true })
class MuteRoleInChannelEventHandler implements IClientEventHandler {

    public eventName: string = eventName;

    public bind = (discordClient: DiscordClient) => {
        discordClient.on(eventName, this.onMuteRole.bind(this, discordClient));
    }
    
    public onMuteRole = async(_: DiscordClient, muteRole: Role | undefined, channel: GuildChannel, me: GuildMember | null) => {
        if (muteRole === undefined || me === null) {
            return;
        }
        if (!channel.viewable || !channel.permissionsFor(me)?.has("MANAGE_ROLES")) {
            return;
        }
        var mutedPermissions = this.getMutedPermissionsForChannel(channel);
        if (!this.channelNeedsOverridePermissions(channel, muteRole, mutedPermissions)){
            return;
        }
        const permissionOptions = this.getPermissionOverwriteOptions(mutedPermissions);
        try {
            channel.permissionOverwrites.edit(muteRole, permissionOptions);
        } catch (err) {
            console.error(err);
        }
    }

    public getMutedPermissionsForChannel(channel: GuildChannel): PermissionString[] {
        switch(channel.type){
            case "GUILD_TEXT":
            case "GUILD_PRIVATE_THREAD":
            case "GUILD_PUBLIC_THREAD":
                return ["ADD_REACTIONS", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "USE_APPLICATION_COMMANDS", "USE_PUBLIC_THREADS", "USE_PRIVATE_THREADS"];
            case "GUILD_VOICE":
            case "GUILD_STAGE_VOICE":
                return ["STREAM", "SPEAK", "REQUEST_TO_SPEAK"];
            case "GUILD_CATEGORY":
                return ["ADD_REACTIONS", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "USE_APPLICATION_COMMANDS", "USE_PUBLIC_THREADS", "USE_PRIVATE_THREADS", "STREAM", "SPEAK", "REQUEST_TO_SPEAK"];
            default:
                return [];
        }
    }

    public getPermissionOverwriteOptions(permissions: PermissionString[]): PermissionOverwriteOptions {
        var options: PermissionOverwriteOptions = {};
        for(let i = 0; i < permissions.length; i++){
            const p = permissions[i];
            options[p] = false;
        }
        return options;
    }

    public channelNeedsOverridePermissions(channel: GuildChannel, muteRole: Role, permissions: PermissionString[]){
        if (permissions.length == 0) {
            return false;
        }
        if (channel.type == "GUILD_CATEGORY"){
            return true;
        }
        var mutedRolePermissions = channel.permissionsFor(muteRole);
        for(let i = 0; i < permissions.length; i++){
            const p = permissions[i];
            if (mutedRolePermissions.has(p)) {
                return true;
            }
        }
        return false;
    }
}

export { MuteRoleInChannelEventHandler }