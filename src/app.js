import express from "express";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import { sendError } from "./utils/httpError.js";
const app = express();
app.use(express.json());
app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});
app.use((err, req, res, next) => {
  sendError(res, err);
});
export default app;