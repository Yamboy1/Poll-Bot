-- CreateTable
CREATE TABLE "GuildPoll" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "guildID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PollOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pollID" INTEGER NOT NULL,

    FOREIGN KEY ("pollID") REFERENCES "GuildPoll"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PollAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" TEXT NOT NULL,
    "optionID" INTEGER NOT NULL,

    FOREIGN KEY ("optionID") REFERENCES "PollOption"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildPoll.normalizedName_unique" ON "GuildPoll"("normalizedName");

-- CreateIndex
CREATE UNIQUE INDEX "GuildPoll.guildID_normalizedName_unique" ON "GuildPoll"("guildID", "normalizedName");

-- CreateIndex
CREATE UNIQUE INDEX "PollAnswer.userID_unique" ON "PollAnswer"("userID");
