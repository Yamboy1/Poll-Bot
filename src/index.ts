import { SlashCreator, ExpressServer } from "slash-create";

import { PollCommand } from "./poll";
import { prisma } from "./storage";
import * as config from "../config.json";

(async () => {
  const creator = new SlashCreator(config);

  creator
    .registerCommand(PollCommand)
    .withServer(new ExpressServer())
    .syncCommands({ deleteCommands: true, syncGuilds: true })
    .startServer()
    .then(() => "Server started")
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());

  creator.on("debug", console.log);
  creator.on("warn", console.log);
  creator.on("error", console.log);
})();


process.on("unhandledRejection", e => {
  console.log(e)
});
