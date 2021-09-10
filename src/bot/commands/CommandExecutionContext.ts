import { Guild, GuildMember, MessageOptions, TextChannel } from "discord.js";

export default class CommandExecutionContext {
    public guildMember: GuildMember;
    public guild: Guild;
    public channel: TextChannel;
    public replyPrivate: (messageOptions: string | MessageOptions) => Promise<unknown>;
    public replyPublic: (messageOptions: string | MessageOptions) => Promise<unknown>;
}