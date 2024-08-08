import { BaseInteraction, Events } from "discord.js";
import Event from "../utils/commons/Event";
import slashCommandHandler from "../utils/event-handlers/slashCommandHandler";

export default new Event({
    name: Events.InteractionCreate,
    async execute(interaction: BaseInteraction): Promise<void> {
        if (interaction.isChatInputCommand()) slashCommandHandler(interaction);
    },
});
