import colors from "colors";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);

    const url = `${connection.connection.host}:${connection.connection.port}`;

    console.log(colors.cyan.bold(`MongoDB conectado en: ${url}`));
  } catch (error) {
    console.log(colors.red.bold(`Error al conectar a MongoDB: ${error}`));

    process.exit(1);
  }
};
