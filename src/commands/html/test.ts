import { AttachmentBuilder, PermissionFlagsBits } from "discord.js";
import nodeHtmlToImage from "node-html-to-image";
import { readFile } from "fs/promises";
import path from "path";

export const data = {
    name: "html",
    description: "html test command",
    cooldown: 5,
    permissions: [PermissionFlagsBits.Administrator],
    async execute(interaction: any) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand !== "test") return;

        await interaction.deferReply({ ephemeral: true });

        const html = await readFile(
            path.join(__dirname, "../../../presentation/html/test.html"),
            "utf-8"
        );

        const images = await nodeHtmlToImage({
            html,
            quality: 100,
            type: "jpeg",
            puppeteerArgs: {
                args: ["--no-sandbox"],
            },
            encoding: "binary",
        });

        const attachment = new AttachmentBuilder(
            Buffer.from(images as string, "binary"),
            { name: `${interaction.user.username}.jpeg` }
        );

        interaction.editReply({ files: [attachment] });
    },
};

export const slashData = {
    name: data.name,
    description: data.description,
    options: [
        {
            name: "test",
            description: data.description,
            type: 1,
        },
    ],
};
