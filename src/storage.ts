import { PrismaClient } from "@prisma/client";
import { SlashCommand } from "slash-create";

export const prisma = new PrismaClient();
export const commandCache = new Map<string, typeof SlashCommand>();
