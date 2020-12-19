/*
  Warnings:

  - Added the required column `name` to the `PollOptions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PollOptions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pollID" INTEGER NOT NULL,

    FOREIGN KEY ("pollID") REFERENCES "GuildPoll"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PollOptions" ("id", "pollID") SELECT "id", "pollID" FROM "PollOptions";
DROP TABLE "PollOptions";
ALTER TABLE "new_PollOptions" RENAME TO "PollOptions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
