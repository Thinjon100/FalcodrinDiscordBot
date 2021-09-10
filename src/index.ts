import "reflect-metadata";
import Container from "typedi";
import Server from "./server";

const main = async () => {
    const server = Container.get(Server);

    await server.startAsync();
};

main().catch(err => {
    console.error(err);
});
  