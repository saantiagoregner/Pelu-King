import { Router } from "express";
import {
  createBooking,
  getBookingById,
  addServiceToBooking,
} from "../controllers/bookings.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createBookingBodySchema,
  addServiceParamsSchema,
  addServiceBodySchema,
} from "../schemas/booking.schema.js";
import { bookingIdParamsSchema } from "../schemas/common.schema.js";
const router = Router();
router.post("/", validate({ body: createBookingBodySchema }), createBooking);
router.get("/:bid", validate({ params: bookingIdParamsSchema }), getBookingById);
router.post(
  "/:bid/services/:sid",
  validate({ params: addServiceParamsSchema, body: addServiceBodySchema }),
  addServiceToBooking
);
export default router;