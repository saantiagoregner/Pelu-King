import express from "express";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";
import { handlebarsEngine, VIEWS_PATH, PUBLIC_PATH } from "./config/handlebars.config.js";
import { sendError } from "./utils/httpError.js";
const app = express();
app.engine("handlebars", handlebarsEngine);
app.set("view engine", "handlebars");
app.set("views", VIEWS_PATH);
app.use(express.json());
app.use(express.static(PUBLIC_PATH));
app.get("/", (req, res) => res.redirect("/views/services"));
app.use("/views", viewsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});
app.use((err, req, res, next) => {
  sendError(res, err);
});
export default app;