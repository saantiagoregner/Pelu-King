import express from "express";
import servicesRouter from "./routes/services.router.js";
const app = express();
app.use(express.json());
app.use("/api/services", servicesRouter);
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
  });
});

export default app;