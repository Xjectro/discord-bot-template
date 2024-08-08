import { Client, Collection } from "discord.js"

export interface DiscordClient extends Client {
    commands: Collection<string, any>
}

declare module 'discord.js' {
    interface Client {
        commands:DiscordClient["commands"]
    }
}
