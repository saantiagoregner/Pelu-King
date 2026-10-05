import bookingsService from "../services/bookings.service.js";
import { sendError } from "../utils/httpError.js";
export const createBooking = async (req, res) => {
try {
    const booking = await bookingsService.createBooking(req.body);
    res.status(201).json({ status: "success", payload: booking });
} catch (error) {
    sendError(res, error);
}
};
export const getBookingById = async (req, res) => {
try {
    const { bid } = req.params;
    const booking = await bookingsService.getBookingById(bid);
    res.status(200).json({ status: "success", payload: booking });
} catch (error) {
    sendError(res, error);
}
};
export const addServiceToBooking = async (req, res) => {
try {
    const { bid, sid } = req.params;
    const booking = await bookingsService.addServiceToBooking(bid, sid);
    res.status(200).json({ status: "success", payload: booking });
} catch (error) {
    sendError(res, error);
}
};