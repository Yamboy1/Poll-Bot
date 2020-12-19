"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const poll_1 = require("./poll");
const slash_create_1 = require("slash-create");
const creator = new slash_create_1.SlashCreator({
    applicationID: "789209041900798003",
    publicKey: "0d43f191a0dca89b2406776f15c916f25db241434bf810ef3d395ba89cdeb411"
});
creator
    .registerCommand(poll_1.PollCommand)
    .syncCommands();
//# sourceMappingURL=index.js.map