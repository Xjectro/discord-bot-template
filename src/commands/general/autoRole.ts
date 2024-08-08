import { Guild } from "../../database/models/guilds";
import { PermissionFlagsBits } from "discord.js";

export const data = {
    name: "auto",
    description: "Manage role assignments for the guild.",
    cooldown: 5,
    permissions: [PermissionFlagsBits.Administrator],
    async execute(interaction: any): Promise<void> {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand !== "role") return;

        await interaction.deferReply({ ephemeral: true });

        const roleString = interaction.options.getString("roles") || "";
        const roleIds = roleString
            .split(",")
            .map((role: string) => role.trim().replace(/<@&|>/g, ""));

        const validRoles: string[] = [];
        const invalidRoles: string[] = [];

        roleIds.forEach((roleId: string) => {
            const role = interaction.guild?.roles.cache.get(roleId);
            if (role) {
                validRoles.push(roleId);
            } else {
                invalidRoles.push(roleId);
            }
        });

        const updateData = {
            autoRole: {
                isActive: validRoles.length > 0,
                roles: validRoles,
            },
        };

        await Guild.updateOne(
            { guildId: interaction.guild?.id },
            { $set: updateData },
            { upsert: true }
        );

        const replyMessage = [
            "The role configuration has been updated successfully.",
            invalidRoles.length > 0
                ? `The following roles could not be found and were not added: ${invalidRoles.join(
                    ", "
                )}`
                : "",
        ].join("\n\n");

        await interaction.editReply({ content: replyMessage });
    },
};

export const slashData = {
    name: data.name,
    description: data.description,
    options: [
        {
            name: "role",
            description: data.description,
            type: 1,
            options: [
                {
                    name: "roles",
                    description:
                        "Enter role IDs separated by commas (e.g., 123456789012345678, 234567890123456789).",
                    type: 3,
                    required: true,
                },
            ],
        },
    ],
};
