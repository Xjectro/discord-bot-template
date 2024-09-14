import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface GuildType extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    guild_id: string;
}

const guildSchema = new Schema<GuildType>(
    {
        guild_id: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

export const Guild = mongoose.model<GuildType>("Guild", guildSchema);
