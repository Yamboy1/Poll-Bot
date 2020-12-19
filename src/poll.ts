import { CommandContext, SlashCommand, SlashCreator } from "slash-create";
import { CommandOptionType } from "slash-create/lib/constants";
import { createPollCommand } from "./CustomPoll";
import { commandCache, prisma } from "./storage";

export class PollCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "poll",
      guildID: "413782906780254208",
      description: "Poll subcommand group",
      options: [
        {
          name: "management",
          description: "Manage polls on this server",
          type: CommandOptionType.SUB_COMMAND_GROUP,
          options: [
            {
              name: "create",
              description: "Create a poll (max 10 polls in a guild)",
              type: CommandOptionType.SUB_COMMAND,
              options: [
                {
                  name: "name",
                  description: "Name of the poll",
                  type: CommandOptionType.STRING,
                  required: true
                },
                {
                  name: "time_active",
                  description: "The time that the poll should stay open (in hours)",
                  type: CommandOptionType.INTEGER,
                  required: true,
                }
              ]
            },
            {
              name: "addoption",
              description: "Adds an option to a poll (max 10 options in a poll)",
              type: CommandOptionType.SUB_COMMAND,
              options: [
                {
                  name: "poll_id",
                  description: "ID of the poll to add an option to",
                  required: true,
                  type: CommandOptionType.INTEGER
                },
                {
                  name: "option",
                  description: "The option to add to the poll",
                  required: true,
                  type: CommandOptionType.STRING
                }
              ]
            },
            {
              name: "delete",
              description: "Delete a poll (this is irreversable)",
              type: CommandOptionType.SUB_COMMAND,
              options: [
                {
                  name: "poll_id",
                  description: "The ID of the poll to delete",
                  required: true,
                  type: CommandOptionType.INTEGER
                }
              ]
            }
          ]
        },
      ]
    });
  }

  async create(ctx: CommandContext) {
    const count = await (prisma.guildPoll.findMany({
      where: {
        guildID: ctx.guildID
      }
    }).then(polls => polls.length));

    if (count > 10) return "You may only have 10 polls running at any one time.";

    prisma.guildPoll.create({
      data: {
        name: (ctx.options["management"]["create"]["name"] as string).toLowerCase(),
        expiresAt: new Date(Date.now() + ((ctx.options["management"]["create"]["time_active"] as number) * 60 * 60 * 1000)),
        guildID: ctx.guildID
      }
    }).then(async poll => {
      commandCache.set(poll.name, createPollCommand({ ...poll, options: [] }))
      ctx.creator.registerCommand(commandCache.get(poll.name));
      await ctx.creator.syncCommandsIn(poll.guildID);
      await ctx.editOriginal(`Created poll \`${poll.id}\``);
    });

    return "Creating Poll...";
  }

  async addOption(ctx: CommandContext) {
    const id = ctx.options["management"]["addoption"]["poll_id"] as number;
    const option = ctx.options["management"]["addoption"]["option"] as string;

    const poll = await prisma.guildPoll.findUnique({
      where: { id }
    });

    if (poll === null) return `No poll with id ${id} was found on this server`;

    prisma.guildPoll.update({
      where: { id },
      data: {
        options: {
          create: {
            name: option
          }
        }
      },
      include: { options: true }
    }).then(async updatedPoll => {
      const command = createPollCommand(updatedPoll);
      commandCache.set(updatedPoll.name, command)
      await ctx.creator.api.updateCommand(command)
      await ctx.creator.syncCommandsIn(updatedPoll.guildID);

      await ctx.editOriginal("Updated option!");
    });

    return "Adding option...";

  }

  async run(ctx: CommandContext): Promise<string | null> {
    if (ctx.subcommands.shift() !== "management") return null;
    switch (ctx.subcommands.shift()) {
      case "create":
        return this.create(ctx);

      case "addoption":
        return this.addOption(ctx);
    }
  }

  async onError(err: Error, ctx: CommandContext) {
    console.log(err);
    return false;
  }

}

