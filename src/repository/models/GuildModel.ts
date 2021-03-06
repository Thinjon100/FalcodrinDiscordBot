import { Guild } from "discord.js";

export default class GuildModel {
    public guild_id: string;
    public name: string;
    public ownerID: string;
    public staffLogChannelID: string|null;
    public muteRoleID: string|null;

    constructor(guild?: Guild){
        if (guild === undefined) return;
        this.guild_id = guild.id;
        this.name = guild.name;
        this.ownerID = guild.ownerId;
        this.staffLogChannelID = null;
        this.muteRoleID = null;
    }
}