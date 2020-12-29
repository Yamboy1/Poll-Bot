import { CommandContext } from "slash-create";
import * as db from "./lib/db";

const bullet = "\u2022";

export async function list(ctx: CommandContext) {
  const polls = await db.getGuildPolls(ctx.guildID);

  return polls.map(({ name, normalizedName }) => `${bullet} ${name} (${normalizedName})`).join("\n")
    || "There are no polls in the server at the moment.";
}
