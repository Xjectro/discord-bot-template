import mongoose, { ConnectOptions } from "mongoose";

export const connect = async (): Promise<void> => {

    try {
        await mongoose.connect(process.env.MONGOOSE_URI as string, {
        } as ConnectOptions);

        console.log(
            "Connected to database"
        );
    } catch (err: any) {
        console.error(
            `Couldn't connect to database. ${err.message}` +
        );
        process.exit(1);
    }
};

mongoose.set("strictQuery", false);