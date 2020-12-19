-- CreateTable
CREATE TABLE "GuildPoll" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expiresAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "guildID" TEXT NOT NULL,
    "options" TEXT NOT NULL
);
