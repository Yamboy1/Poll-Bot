"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPollCommand = void 0;
const slash_create_1 = require("slash-create");
const constants_1 = require("slash-create/lib/constants");
function createPollCommand(data) {
    const choices = data.options.map((option, i) => ({ name: option.name, value: `${i + 1}` }));
    console.log(choices);
    return class extends slash_create_1.SlashCommand {
        constructor(creator) {
            super(creator, {
                name: `poll_${data.name}`,
                description: `A custom poll about ${data.name}, created by PollBot (name tbd)`,
                guildID: data.guildID,
                options: [
                    {
                        name: "submit",
                        description: "Submit an answer to this poll",
                        type: constants_1.CommandOptionType.SUB_COMMAND,
                        options: [
                            {
                                name: "option",
                                description: "Your answer to the poll",
                                required: true,
                                type: constants_1.CommandOptionType.STRING,
                                choices
                            }
                        ]
                    },
                    {
                        name: "info",
                        description: "View the different options available in this poll",
                        type: constants_1.CommandOptionType.SUB_COMMAND
                    }
                ]
            });
            this.data = data;
        }
        async run(ctx) {
            const subcommand = ctx.subcommands.shift();
            switch (subcommand) {
                case "submit":
                    console.log(ctx.options["submit"]["option"]);
                    return "All done! Thank you ^^";
                case "info":
                    console.log(choices);
                    return choices.reduce((acc, choice) => acc + `${choice.value}. ${choice.name}\n`, "");
            }
        }
    };
}
exports.createPollCommand = createPollCommand;
//# sourceMappingURL=CustomPoll.js.map