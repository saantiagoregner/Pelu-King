import { Router } from "express";
export default function bookingsRouter(bookingManager) {
  const router = Router();
  router.post("/", async (req, res, next) => {
    try {
      const booking = await bookingManager.createBooking(req.body);
      res.status(201).json({ status: "success", payload: booking });
    } catch (error) {
      next(error);
    }
  });
  router.get("/:bid", async (req, res, next) => {
    try {
      const booking = await bookingManager.getBookingById(req.params.bid);
      res.json({ status: "success", payload: booking });
    } catch (error) {
      next(error);
    }
  });
  router.post("/:bid/services/:sid", async (req, res, next) => {
    try {
      const booking = await bookingManager.addServiceToBooking(
        req.params.bid,
        req.params.sid
      );
      res.json({ status: "success", payload: booking });
    } catch (error) {
      next(error);
    }
  });
  return router;
}