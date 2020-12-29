import { CommandContext } from "slash-create";
import { deleteGuildPoll } from "./lib/db";
import { upsertGuildPollCommand } from "./lib/discord";

interface RemoveOptions {
  poll: number
}

export async function remove(ctx: CommandContext, opts: RemoveOptions) {
  const { creator, guildID } = ctx;
  const { poll: id } = opts;

  if (id === 0) return "There are no open polls right now"

  if (!await deleteGuildPoll(id)) return "Poll not found"
  await upsertGuildPollCommand(guildID, creator);
  return "Poll removed"

}
