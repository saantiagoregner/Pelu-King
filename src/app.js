import express from "express";
import { PORT, SERVICES_PATH, BOOKINGS_PATH } from "./config/env.config.js";
import ServiceManager from "./managers/ServiceManager.js";
import BookingManager from "./managers/BookingManager.js";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
const app = express();
const serviceManager = new ServiceManager(SERVICES_PATH);
const bookingManager = new BookingManager(BOOKINGS_PATH, serviceManager);
app.use(express.json());
app.use("/api/services", servicesRouter(serviceManager));
app.use("/api/bookings", bookingsRouter(bookingManager));
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.status ? err.message : "Error interno del servidor";
  if (!err.status) console.error(err);
  res.status(status).json({ status: "error", message });
});
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});