import { Role } from "discord.js";

export default class RoleModel {
    public guild_id: string;
    public role_id: string;
    public name: string;
    public permissions: string;
    public color: number;
    public hoist: boolean;
    public managed: boolean;
    public mentionable: boolean;
    public deleted: boolean;
    public rawPosition: number;

    constructor(role?: Role){
        if (role === undefined) return;
        this.guild_id = role.guild.id;
        this.role_id = role.id;
        this.name = role.name;
        this.permissions = role.permissions.bitfield.toString();
        this.color = role.color;
        this.hoist = role.hoist;
        this.managed = role.managed;
        this.mentionable = role.mentionable;
        this.deleted = role.deleted;
        this.rawPosition = role.rawPosition;
    }
};