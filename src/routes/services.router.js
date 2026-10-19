import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/services.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { serviceBodySchema, servicesQuerySchema } from "../schemas/service.schema.js";
import { serviceIdParamsSchema } from "../schemas/common.schema.js";
const router = Router();
router.get("/", validate({ query: servicesQuerySchema }), getServices);
router.get("/:sid", validate({ params: serviceIdParamsSchema }), getServiceById);
router.post("/", validate({ body: serviceBodySchema }), createService);
router.put(
  "/:sid",
  validate({ params: serviceIdParamsSchema, body: serviceBodySchema }),
  updateService
);
router.delete("/:sid", validate({ params: serviceIdParamsSchema }), deleteService);
export default router;