import { CommandContext } from "slash-create";
import * as db from "./lib/db";

const bullet = "\u2022";

interface ViewOptions {
  poll: number
}

export async function view(ctx: CommandContext, opts: ViewOptions) {
  const { poll: id } = opts;

  if (id === 0) return "There are no open polls right now";

  const poll = await db.getGuildPollById(id)
  if (poll === null) return "Poll not found";

  const options = poll.options.map(({ name, answers  }) => `${bullet} ${name} - ${answers.length} answers`).join("\n")
  return `Name: ${poll.name}\nOptions:\n${options}`

}
