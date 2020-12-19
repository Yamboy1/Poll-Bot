"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollCommand = void 0;
const slash_create_1 = require("slash-create");
class PollCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "poll",
            description: "Poll subcommand group",
            options: [{
                    name: "create",
                    description: "Create a poll",
                    type: 1
                }]
        });
    }
    async run(ctx) {
        console.log(ctx.commandName);
        return null;
    }
}
exports.PollCommand = PollCommand;
//# sourceMappingURL=poll.js.map