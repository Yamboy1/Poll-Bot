"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollCommand = void 0;
const slash_create_1 = require("slash-create");
const constants_1 = require("slash-create/lib/constants");
const CustomPoll_1 = require("./CustomPoll");
const storage_1 = require("./storage");
class PollCommand extends slash_create_1.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: "poll",
            guildID: "413782906780254208",
            description: "Poll subcommand group",
            options: [
                {
                    name: "management",
                    description: "Manage polls on this server",
                    type: constants_1.CommandOptionType.SUB_COMMAND_GROUP,
                    options: [
                        {
                            name: "create",
                            description: "Create a poll (max 10 polls in a guild)",
                            type: constants_1.CommandOptionType.SUB_COMMAND,
                            options: [
                                {
                                    name: "name",
                                    description: "Name of the poll",
                                    type: constants_1.CommandOptionType.STRING,
                                    required: true
                                },
                                {
                                    name: "time_active",
                                    description: "The time that the poll should stay open (in hours)",
                                    type: constants_1.CommandOptionType.INTEGER,
                                    required: true,
                                }
                            ]
                        },
                        {
                            name: "addoption",
                            description: "Adds an option to a poll (max 10 options in a poll)",
                            type: constants_1.CommandOptionType.SUB_COMMAND,
                            options: [
                                {
                                    name: "poll_id",
                                    description: "ID of the poll to add an option to",
                                    required: true,
                                    type: constants_1.CommandOptionType.INTEGER
                                },
                                {
                                    name: "option",
                                    description: "The option to add to the poll",
                                    required: true,
                                    type: constants_1.CommandOptionType.STRING
                                }
                            ]
                        },
                        {
                            name: "delete",
                            description: "Delete a poll (this is irreversable)",
                            type: constants_1.CommandOptionType.SUB_COMMAND,
                            options: [
                                {
                                    name: "poll_id",
                                    description: "The ID of the poll to delete",
                                    required: true,
                                    type: constants_1.CommandOptionType.INTEGER
                                }
                            ]
                        }
                    ]
                },
            ]
        });
    }
    async create(ctx) {
        storage_1.prisma.guildPoll.create({
            data: {
                name: ctx.options["management"]["create"]["name"],
                expiresAt: new Date(Date.now() + (ctx.options["management"]["create"]["time_active"] * 60 * 60 * 1000)),
                guildID: ctx.guildID
            }
        }).then(async (poll) => {
            storage_1.commandCache.set(poll.name, CustomPoll_1.createPollCommand({ ...poll, options: [] }));
            ctx.creator.registerCommand(storage_1.commandCache.get(poll.name));
            await ctx.creator.syncCommandsIn(poll.guildID);
            await ctx.editOriginal(`Created poll \`${poll.id}\``);
        });
        return "Creating Poll...";
    }
    async addOption(ctx) {
        const id = ctx.options["management"]["addoption"]["poll_id"];
        const option = ctx.options["management"]["addoption"]["option"];
        const poll = await storage_1.prisma.guildPoll.findUnique({
            where: { id }
        });
        if (poll === null)
            return `No poll with id ${id} was found on this server`;
        (storage_1.prisma.guildPoll.update({
            where: { id },
            data: {
                options: {
                    create: {
                        name: option
                    }
                }
            },
            include: { options: true }
        })).then(async (updatedPoll) => {
            console.log(storage_1.commandCache.get(poll.name));
            ctx.creator.unregisterCommand(new (storage_1.commandCache.get(poll.name))(ctx.creator));
            storage_1.commandCache.set(updatedPoll.name, CustomPoll_1.createPollCommand(updatedPoll));
            ctx.creator.registerCommand(storage_1.commandCache.get(updatedPoll.name));
            await ctx.creator.syncCommandsIn(updatedPoll.guildID);
            await ctx.editOriginal("Updated option!");
        });
        return "Adding option...";
    }
    async run(ctx) {
        if (ctx.subcommands.shift() !== "management")
            return null;
        switch (ctx.subcommands.shift()) {
            case "create":
                return this.create(ctx);
            case "addoption":
                return this.addOption(ctx);
        }
    }
    async onError(err, ctx) {
        console.log(err);
        return false;
    }
}
exports.PollCommand = PollCommand;
//# sourceMappingURL=poll.js.map