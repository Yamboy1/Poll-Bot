import { Constants, SlashCreator } from "slash-create";
import { createLocalPollCommand } from "../../createLocalPollCommand";
import { getGuildPolls } from "./db";

/**
 * Create/Update the poll command for a specific guild directly through the api
 * @param guildID - The guild id
 * @param creator - The slash creator to use the api from.
 * @returns The newly created/updated command
 */
export async function upsertGuildPollCommand(guildID: string, creator: SlashCreator): Promise<Constants.ApplicationCommand> {
  const command = createLocalPollCommand(guildID, await getGuildPolls(guildID));
  return await creator.api.createCommand(command, guildID);
}

