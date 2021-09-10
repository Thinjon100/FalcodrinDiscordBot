import { Inject, Service } from "typedi";
import DiscordClient from "./bot/discord/DiscordClient";
import Repository from "./repository/Repository";

@Service()
class Server {
  constructor(
    @Inject()
    private readonly discordClient: DiscordClient,
    @Inject()
    private readonly repository: Repository
  ){
    discordClient.on("ready", async () => {
      console.log("Discord client ready");
    });

    process.on("exit", this.exitHandler.bind(null, { cleanup: true }));
    process.on("SIGINT", this.exitHandler.bind(null, { exit: true }));
    process.on("SIGUSR1", this.exitHandler.bind(null, { exit: true }));
    process.on("SIGUSR2", this.exitHandler.bind(null, { exit: true }));
    process.on("uncaughtException", this.exitHandler.bind(null, { exit: true }));
  }

  public startAsync = async() => {
    await this.repository.ready();
    await this.discordClient.loginAsync();
  }

  private exitHandler = async (options: any, exitCode: any) => {
    if (options.cleanup) {
      if (this.discordClient) this.discordClient.close();
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
  }
}

export default Server;