import "dotenv/config";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { promises as fs } from "fs";
import path from "path";
import { termcolors, config } from "./constants";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

const loadCommands = async (commandsDir: string): Promise<RESTPostAPIApplicationCommandsJSONBody[]> => {
    let commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

    try {
        const categories = await fs.readdir(commandsDir);
        console.log(termcolors.fgGreen + `Found ${categories.length} categories.` + termcolors.reset);

        for (const category of categories) {
            const categoryPath = path.join(commandsDir, category);
            const commandFiles = (await fs.readdir(categoryPath)).filter(file => file.endsWith(".ts"));

            console.log(termcolors.fgYellow + `Loading ${commandFiles.length} commands from category: ${category}` + termcolors.reset);

            for (const file of commandFiles) {
                const filePath = path.join(categoryPath, file);
                try {
                    const command = await import(filePath);
                    if (command?.data?.name) {
                        commands.push(command.slashData);
                        console.log(termcolors.fgGreen + `Loaded command: ${command.data.name}` + termcolors.reset);
                    } else {
                        console.warn(termcolors.fgRed + `Command file ${file} does not export a valid command.` + termcolors.reset);
                    }
                } catch (err) {
                    console.error(termcolors.fgRed + `Error loading command ${file}:` + termcolors.reset, err);
                }
            }
        }
    } catch (err) {
        console.error(termcolors.fgRed + "Error reading commands directory:" + termcolors.reset, err);
    }

    return commands;
};

const refreshCommands = async (commands: RESTPostAPIApplicationCommandsJSONBody[]) => {
    const rest = new REST({ version: "10" }).setToken(config.token);

    try {
        console.log(termcolors.fgYellow + "Started refreshing application (/) commands." + termcolors.reset);

        await rest.put(Routes.applicationCommands(config.client.id), { body: [] }); // Clear existing commands
        await rest.put(Routes.applicationCommands(config.client.id), { body: commands });

        console.log(termcolors.fgGreen + "Successfully reloaded application (/) commands." + termcolors.reset);
    } catch (error) {
        console.error(termcolors.fgRed + "Error reloading application (/) commands:" + termcolors.reset, error);
    }
};

(async () => {
    const commandsDir = path.resolve(__dirname, "./commands");
    const commands = await loadCommands(commandsDir);
    await refreshCommands(commands);

    console.log(termcolors.fgCyan + "Process completed. Closing the console..." + termcolors.reset);
    process.exit(0);
})();
