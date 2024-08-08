import { promises as fs } from "fs";
import path from "path";
import { termcolors } from "../constants";
import { Client } from "discord.js";

export default async function commandHandler(client: Client): Promise<void> {
    const commandsDir = path.resolve(__dirname, "../commands");

    try {
        const categories = await fs.readdir(commandsDir);

        await Promise.all(
            categories.map(async (category) => {
                const categoryPath = path.join(commandsDir, category);

                try {
                    const commandFiles = (await fs.readdir(categoryPath)).filter((file) =>
                        file.endsWith(".ts")
                    );

                    await Promise.all(
                        commandFiles.map(async (file) => {
                            const filePath = path.join(categoryPath, file);

                            try {
                                const { data } = await import(filePath);

                                if (data && data.name) {
                                    client.commands.set(data.name, data);
                                } else {
                                    console.warn(
                                        termcolors.fgRed +
                                        `Command file ${file} does not export a valid command.` +
                                        termcolors.reset
                                    );
                                }
                            } catch (err) {
                                console.error(
                                    termcolors.fgRed +
                                    `Error loading command ${file} from category ${category}:` +
                                    termcolors.reset,
                                    err
                                );
                            }
                        })
                    );
                } catch (err) {
                    console.error(
                        termcolors.fgRed +
                        `Error reading commands from category ${category}:` +
                        termcolors.reset,
                        err
                    );
                }
            })
        );
    } catch (err) {
        console.error(
            termcolors.fgRed + "Error reading commands directory:" + termcolors.reset,
            err
        );
    }
}
