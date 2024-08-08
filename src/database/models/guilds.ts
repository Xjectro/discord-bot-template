import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface GuildType extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    guildId: string;
    autoRole: {
        isActive: boolean;
        roles: string[];
    };
}

const guildSchema = new Schema<GuildType>(
    {
        guildId: {
            type: String,
            required: true,
        },
        autoRole: {
            type: {
                isActive: {
                    type: Boolean,
                    default: false,
                },
                roles: {
                    type: [String],
                    default: [],
                },
            },
            default: {
                active: false,
                roles: [],
            },
        },
    },
    { timestamps: true }
);

export const Guild = mongoose.model<GuildType>("Guild", guildSchema);
