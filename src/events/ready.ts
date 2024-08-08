import { Events, Client } from "discord.js";
import Event from "../utils/commons/Event";
import { termcolors } from "../constants";

export default new Event({
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log(
            termcolors.fgMagenta +
            `Logged in as ${client.user?.username}!` +
            termcolors.reset
        );
    },
});
