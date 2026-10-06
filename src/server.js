import app from "./app.js";
import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
const startServer = async () => {
try {
    await connectDB();
    app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
}
};
startServer();