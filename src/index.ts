import "dotenv/config";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import eventHandler from "./handlers/eventHandler";
import commandHandler from "./handlers/commandHandler";
import { DiscordClient } from "./types/discord";
import { connect as dbConnection } from "./database/dbConnection";

const client = new Client({
    intents: [Object.values(GatewayIntentBits) as GatewayIntentBits[]],
}) as DiscordClient;

client.commands = new Collection<string, any>();

dbConnection();
eventHandler(client);
commandHandler(client);

client.login(process.env.TOKEN);
