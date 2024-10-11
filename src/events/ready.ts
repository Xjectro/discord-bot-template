import { Events, Client } from "discord.js";
import Event from "../utils/commons/Event";

export default new Event({
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log(
            `Logged in as ${client.user?.username}!`
        );
    },
});
