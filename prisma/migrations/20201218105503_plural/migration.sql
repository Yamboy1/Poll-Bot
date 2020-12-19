/*
  Warnings:

  - You are about to drop the `PollOptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateTable
CREATE TABLE "PollOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pollID" INTEGER NOT NULL,

    FOREIGN KEY ("pollID") REFERENCES "GuildPoll"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PollOptions";
PRAGMA foreign_keys=on;
