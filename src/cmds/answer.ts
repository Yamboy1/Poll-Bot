import { CommandContext } from "slash-create";
import { prisma } from "../storage";

interface AnswerOptions {
  [poll: string]: {
    answer: number
  }
}

export async function answer(ctx: CommandContext, options: AnswerOptions): Promise<string> {
  const { guildID, member: { id: userID }, subcommands } = ctx;

  const normalizedName = subcommands.shift();
  if (normalizedName === undefined) return "Please select a poll";

  const { answer } = options[normalizedName];

  console.log(normalizedName, answer)

  const option = await prisma.pollOption.findUnique({
    where: { id: answer },
    include: { poll: true }
  })

  if (option?.poll.guildID !== guildID || option?.poll.normalizedName !== normalizedName) return "Invalid answer"

  await prisma.pollAnswer.create({
    data: { userID, option: { connect: { id: option.id } } },
  });

  return "Poll answered";
}
