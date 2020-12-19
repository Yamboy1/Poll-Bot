/*
  Warnings:

  - You are about to drop the column `options` on the `GuildPoll` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PollOptions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pollID" INTEGER NOT NULL,

    FOREIGN KEY ("pollID") REFERENCES "GuildPoll"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GuildPoll" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expiresAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "guildID" TEXT NOT NULL
);
INSERT INTO "new_GuildPoll" ("id", "expiresAt", "name", "guildID") SELECT "id", "expiresAt", "name", "guildID" FROM "GuildPoll";
DROP TABLE "GuildPoll";
ALTER TABLE "new_GuildPoll" RENAME TO "GuildPoll";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
