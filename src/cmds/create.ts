import { CommandContext } from "slash-create";

import * as db from "./lib/db";
import * as discord from "./lib/discord";

interface CreateOptions {
  name: string,
  options: string
}

export async function create(ctx: CommandContext, opts: CreateOptions) {
  const { creator, guildID } = ctx;
  const { name } = opts;
  const options = opts.options.split(",").map(x => x.trim());

  try {
    await db.createGuildPoll(guildID, name, options);
  } catch (e) {
    if (e instanceof TypeError) return e.message;
    throw e;
  }
  await discord.upsertGuildPollCommand(guildID, creator);

  return "Created Poll!";
}
