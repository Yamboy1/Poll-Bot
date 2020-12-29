import { Prisma } from "@prisma/client";
import { prisma } from "../../storage";

export type GuildPoll = Prisma.GuildPollGetPayload<{ include: { options: { include: { answers: true } } } }>;

/**
 * Get an array of all polls in the guild specified by guildID
 * @param guildID - The guild id
 * @return - The array of polls
 */
export async function getGuildPolls(guildID: string): Promise<GuildPoll[]> {
  return await prisma.guildPoll.findMany({
    where: { guildID },
    include: { options: { include: { answers: true } } }
  });
}

/**
 * Get poll based off its id
 * @param id - The id of the poll
 * @return - The poll, or null if no poll with that id was found
 */
export async function getGuildPollById(id: number): Promise<GuildPoll | null> {
  return await prisma.guildPoll.findUnique({
    where: { id },
    include: { options: { include: { answers: true } } }
  });
}

export async function createGuildPoll(guildID: string, name: string, options: string[]): Promise<GuildPoll> {
  const normalizedName = name.replaceAll(/\s+/g, "-").replaceAll(/[\W-]+/g, "").toLowerCase()
  if (normalizedName.length < 3) throw new TypeError("Poll name needs to be at least 3 characters and at most 33 characters long");

  if (await prisma.guildPoll.findUnique({ where: { normalizedName }}) === undefined) {
    throw new TypeError(`A poll with normalized name "${normalizedName}" already exists!`);
  }

  return await prisma.guildPoll.create({
    data: { guildID, name, normalizedName, options: { create: options.map(name => ({ name, answers: { create: [] } })) } },
    include: { options: { include: { answers: true } } }
  });
}

export async function deleteGuildPoll(id: number): Promise<boolean> {
  await prisma.pollAnswer.deleteMany({
    where: { option: { pollID : id } }
  });

  await prisma.pollOption.deleteMany({
    where: { pollID: id }
  });

  const { count } = await prisma.guildPoll.deleteMany({
    where: { id }
  });

  return count === 1;
}
