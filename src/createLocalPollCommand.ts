import { Constants } from "slash-create";
import { CommandOptionType } from "slash-create/lib/constants";
import { GuildPoll } from "./cmds/lib/db";

export function createLocalPollCommand(guildID: string, guildPolls: GuildPoll[]): Constants.PartialApplicationCommand {
  const pollArray: { id: number, name: string }[] = (guildPolls.length ? guildPolls : [{ id: 0, name: "There are no open polls right now"}]);
  const pollChoices = pollArray.map(({ id: value, name }) => ({ name: `${name} (ID: ${value})`, value }));

  return {
    name: "poll",
    description: "Poll Local Commands!",
    options: [
      {
        name: "view",
        description: "View details about a poll",
        type: CommandOptionType.SUB_COMMAND,
        options: [
          {
            name: "poll",
            description: "Poll to view",
            required: true,
            choices: pollChoices,
            type: CommandOptionType.INTEGER,
          }
        ]
      },
      {
        name: "remove",
        description: "Remove a poll",
        type: CommandOptionType.SUB_COMMAND,
        options: [
          {
            name: "poll",
            description: "Poll to remove",
            required: true,
            choices: pollChoices,
            type: CommandOptionType.INTEGER
          }
        ]
      },
      {
        name: "answer",
        description: "Answer a poll",
        type: CommandOptionType.SUB_COMMAND_GROUP,
        options:
          guildPolls.map(({ name, normalizedName, options }) => ({
            name: normalizedName,
            description: `Answer poll "${name}"`,
            type: CommandOptionType.SUB_COMMAND,
            options: [
              {
                name: "answer",
                description: "The answer to submit",
                required: true,
                type: CommandOptionType.INTEGER,
                choices:
                  options.map(({ id, name }) => ({
                  name,
                  value: id
                }))
              }
            ]
          }))
      }
    ]
  }
}
