import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = process.env.PORT || 8080;

export const SERVICES_PATH = path.join(__dirname, "../data/services.json");
export const BOOKINGS_PATH = path.join(__dirname, "../data/bookings.json");