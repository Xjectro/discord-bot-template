import mongoose, { ConnectOptions } from "mongoose";
import { config, termcolors } from "../constants";

export const connect = async (): Promise<void> => {
    const dbUrl = `mongodb://${config.mongoDB.host}:${config.mongoDB.port}`;

    try {
        await mongoose.connect(dbUrl, {
            dbName: config.mongoDB.dbName,
        } as ConnectOptions);

        console.log(
            termcolors.fgGreen + "Connected to database" + termcolors.reset
        );
    } catch (err:any) {
        console.error(
            termcolors.fgRed +
            `Couldn't connect to database. ${err.message}` +
            termcolors.reset
        );
        process.exit(1);
    }
};

mongoose.set("strictQuery", false);