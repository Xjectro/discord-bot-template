import { GuildMember } from "discord.js";
import { Guild } from "../database/models/guilds";

export default async function handleMemberRoles(
    member: GuildMember
): Promise<void> {
    try {
        const guild = await Guild.findOne({ guildId: member.guild.id }).exec();

        if (!guild || !guild.autoRole.isActive) return;

        await member.roles.set(guild.autoRole.roles).catch((error) => { });
    } catch (error) {
        console.error(
            `Error handling roles for member ${member.id} in guild ${member.guild.id}:`,
            error
        );
    }
}
