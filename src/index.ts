import { SlashCreator, ExpressServer } from "slash-create";

import { GlobalPollCommand } from "./GlobalPollCommand";
import { prisma } from "./storage";
import * as config from "../config.json";

const creator = new SlashCreator(config);

creator
  .registerCommand(GlobalPollCommand)
  .withServer(new ExpressServer())
  .syncCommands()
  .startServer()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());

creator.on("debug", console.log);
creator.on("warn", console.log);
creator.on("error", console.log);
creator.on("commandError", console.log);
