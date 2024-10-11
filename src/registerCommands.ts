import "dotenv/config";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { promises as fs } from "fs";
import path from "path";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

const loadCommands = async (
    commandsDir: string
): Promise<RESTPostAPIApplicationCommandsJSONBody[]> => {
    let commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

    try {
        const categories = await fs.readdir(commandsDir);
        console.log(`Found ${categories.length} categories.`);

        for (const category of categories) {
            const categoryPath = path.join(commandsDir, category);
            const commandFiles = (await fs.readdir(categoryPath)).filter((file) =>
                file.endsWith(".ts")
            );

            console.log(
                `Loading ${commandFiles.length} commands from category: ${category}`
            );

            for (const file of commandFiles) {
                const filePath = path.join(categoryPath, file);
                try {
                    const command = await import(filePath);
                    if (command?.data?.name) {
                        commands.push(command.slashData);
                        console.log(`Loaded command: ${command.data.name}`);
                    } else {
                        console.warn(
                            `Command file ${file} does not export a valid command.`
                        );
                    }
                } catch (err) {
                    console.error(`Error loading command ${file}:`, err);
                }
            }
        }
    } catch (err) {
        console.error("Error reading commands directory:", err);
    }

    return commands;
};

const refreshCommands = async (
    commands: RESTPostAPIApplicationCommandsJSONBody[]
) => {
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: [],
        });
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error("Error reloading application (/) commands:", error);
    }
};

(async () => {
    const commandsDir = path.resolve(__dirname, "./commands");
    const commands = await loadCommands(commandsDir);
    await refreshCommands(commands);

    console.log("Process completed. Closing the console...");
    process.exit(0);
})();
