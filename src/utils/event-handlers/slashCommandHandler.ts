import { CommandInteraction } from "discord.js";
import { checkCooldown } from "../cooldown";

export default async (interaction: CommandInteraction) => {
    const { client, commandName, user } = interaction;

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (!command) {
        console.error(`Failed to find execution handler for ${commandName}`);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
        return;
    }

    const cooldown = checkCooldown(command, user.id);
    if (cooldown) {
        await interaction.reply({
            content: `You've reached timeout. Please wait \`${cooldown}\` more seconds.`
        });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
};
