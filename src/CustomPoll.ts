import { CommandContext, SlashCommand, SlashCreator } from "slash-create";
import { Prisma } from "@prisma/client";
import { ApplicationCommandOptionChoice, CommandOptionType } from "slash-create/lib/constants";

type PollWithOptions = Prisma.GuildPollGetPayload<{ include: { options: true }}>

export function createPollCommand(data: PollWithOptions): typeof SlashCommand {
  const choices: ApplicationCommandOptionChoice[] = data.options.map((option,i) => ({ name: option.name, value: `${i+1}` }))
  console.log(choices);
  return class extends SlashCommand {
    data: PollWithOptions
    constructor(creator: SlashCreator) {
      super(creator, {
        name: `poll_${data.name}`,
        description: `A custom poll about ${data.name}, created by PollBot (name tbd)`,
        guildID: data.guildID,
        options: [
          {
            name: "submit",
            description: "Submit an answer to this poll",
            type: CommandOptionType.SUB_COMMAND,
            options: [
              {
                name: "option",
                description: "Your answer to the poll",
                required: true,
                type: CommandOptionType.STRING,
                choices
              }
            ]
          },
          {
            name: "info",
            description: "View the different options available in this poll",
            type: CommandOptionType.SUB_COMMAND
          }
        ]
      });
      this.data = data;
    }

    async run(ctx: CommandContext): Promise<string> {
      const subcommand = ctx.subcommands.shift();

      switch (subcommand) {
        case "submit":
          console.log(ctx.options["submit"]["option"]);
          return "All done! Thank you ^^";

        case "info":
          console.log(choices);
          return choices.reduce((acc,choice) => acc + `${choice.value}. ${choice.name}\n`, "");
      }
    }
  }
}
