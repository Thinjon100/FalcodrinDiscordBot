export enum ChannelUsagePermission {
    Deny = 0,
    Public = 1,
    Private = 2
}

export class PermissionSetChannelModel {
    public guild_id: string;
    public permissionSet_id: number;
    public channel_id: string;
    public allowedUsage: ChannelUsagePermission;
    public redirectChannelId: string|null;
}