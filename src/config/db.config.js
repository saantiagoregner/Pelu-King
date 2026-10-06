import mongoose from "mongoose";
import { MONGO_URI } from "./env.config.js";
export const connectDB = async () => {
if (!MONGO_URI) {
    throw new Error("Falta la variable de entorno MONGO_URI (revisá tu archivo .env)");
}
await mongoose.connect(MONGO_URI);
console.log("Conectado a MongoDB");
};