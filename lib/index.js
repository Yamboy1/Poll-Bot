"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slash_create_1 = require("slash-create");
const poll_1 = require("./poll");
const storage_1 = require("./storage");
(async () => {
    const polls = await storage_1.prisma.guildPoll.findMany();
    console.log(polls[0]);
    const creator = new slash_create_1.SlashCreator({
        applicationID: "789209041900798003",
        publicKey: "0d43f191a0dca89b2406776f15c916f25db241434bf810ef3d395ba89cdeb411",
        token: "Nzg5MjA5MDQxOTAwNzk4MDAz.X9uuMg.Q1ylQDCgI4-zlpe2hRMrZigFM_g",
        serverPort: 8080
    });
    creator
        .registerCommand(poll_1.PollCommand)
        .withServer(new slash_create_1.ExpressServer())
        .syncCommands({ deleteCommands: true, syncGuilds: true })
        .startServer()
        .then(() => "Server started")
        .catch(console.error)
        .finally(async () => await storage_1.prisma.$disconnect());
    creator.on("debug", console.log);
    creator.on("warn", console.log);
    creator.on("error", console.log);
})();
process.on("unhandledRejection", e => {
    console.log(e);
});
//# sourceMappingURL=index.js.map