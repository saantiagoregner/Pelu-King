import http from "http";
import app from "./app.js";
import { PORT } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import { initSocket } from "./config/socket.config.js";
const startServer = async () => {
try {
    await connectDB();
    const httpServer = http.createServer(app);
    const io = initSocket(httpServer);
    app.set("io", io);
    httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
}
};

startServer();