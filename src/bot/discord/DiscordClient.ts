import { Container, Inject, Service } from "typedi";
import { Client, ClientOptions } from "discord.js";
import { EventEmitter } from "events";
import { DISCORD_TOKEN } from "../../config/config";
import DiscordEventHandlerToken from "./discordEvents";
import { IDiscordEventHandler } from "./discordEvents/IDiscordEventHandler";
import ClientEventHandlerToken from "./clientEvents";

@Service()
class DiscordClient extends EventEmitter {
    private _client: Client;
    private readonly _discordEventHandlers: IDiscordEventHandler[]

    constructor(
        @Inject(DISCORD_TOKEN)
        private readonly _discordToken: string
    ) {
        super();
        this._discordEventHandlers = Container.getMany(DiscordEventHandlerToken);

        const clientEventHandlers = Container.getMany(ClientEventHandlerToken);
        clientEventHandlers.forEach(x => x.bind(this));

        this.init();
    }

    public close = () => {
        if (this._client) this._client.destroy();
    }

    private init = () => {
        const clientOptions: ClientOptions = {
            intents: [
                "GUILDS",
                "GUILD_MEMBERS",
                "GUILD_BANS",
                "GUILD_INTEGRATIONS",
                "GUILD_WEBHOOKS",
                "GUILD_INVITES",
                "GUILD_VOICE_STATES",
                "GUILD_PRESENCES",
                "GUILD_MESSAGES",
                "GUILD_MESSAGE_REACTIONS",
                "GUILD_MESSAGE_TYPING"
            ]
        };
        this._client = new Client(clientOptions);

        this._discordEventHandlers.forEach((eh) => {
            this._client.on(eh.eventName,eh.handler.bind(null,this));
        });
    }

    public async loginAsync(token?: string) {
        return await this._client.login(token || this._discordToken);
    }

    public get Client(){
        return this._client;
    }
}

export default DiscordClient;