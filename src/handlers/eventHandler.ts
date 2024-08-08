import { Client } from "discord.js";
import { readdir } from "fs/promises";
import path from "path";
import Event from "../utils/commons/Event";
import { termcolors } from "../constants";

export default async function loadEvents(client: Client): Promise<void> {
    const eventsDir = path.resolve(__dirname, "../events");

    try {
        const eventFiles = (await readdir(eventsDir)).filter((file) =>
            file.endsWith(".ts")
        );

        await Promise.all(
            eventFiles.map(async (file) => {
                try {
                    const eventPath = path.join(eventsDir, file);
                    const { default: event } = (await import(eventPath)) as {
                        default: Event;
                    };

                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args));
                    }
                } catch (error) {
                    console.error(
                        termcolors.fgRed +
                        `Error loading event file ${file}:` +
                        termcolors.reset,
                        error
                    );
                }
            })
        );
    } catch (error) {
        console.error(
            termcolors.fgRed + "Error reading events directory:" + termcolors.reset,
            error
        );
    }
}
