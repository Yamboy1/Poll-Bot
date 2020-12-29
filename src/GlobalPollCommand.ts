import { CommandContext, SlashCommand, SlashCreator } from "slash-create";
import { CommandOptionType } from "slash-create/lib/constants";
import * as util from "util";

export class GlobalPollCommand extends SlashCommand {
  private subcommands: Map<string, (ctx: CommandContext, options: any) => Promise<string>> | null = null;
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "poll",
      description: "PollBot Commands!",
      options: [
        {
          name: "create",
          description: "Create a poll in this guild",
          type: CommandOptionType.SUB_COMMAND,
          options: [
            {
              name: "name",
              description: "Name of the poll to create",
              required: true,
              type: CommandOptionType.STRING
            },
            {
              name: "options",
              description: "The poll options, seperated by a comma",
              required: true,
              type: CommandOptionType.STRING
            }
          ]
        },
        {
          name: "list",
          description: "List all polls in this guild",
          type: CommandOptionType.SUB_COMMAND
        }
      ]
    });

    import("./cmds/index").then(module => {
      this.subcommands = new Map(Object.entries(module));
    })
  }

  async run(ctx: CommandContext): Promise<string | void> {
    if (this.subcommands === null) return "Initializing commands... Please try again in a few minutes";
    if (ctx.subcommands.length < 1) return;

    const name = ctx.subcommands.shift()!;
    if (!this.subcommands.has(name)) return;

    const timeout = setTimeout(() => {
      ctx.acknowledge();
    }, 2000);
    console.log(util.inspect(ctx.options, { depth: 1000 }));
    const value = await this.subcommands.get(name)!(ctx, ctx.options[name]);
    clearTimeout(timeout);

    return value;
  }

}
