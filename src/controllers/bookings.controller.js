import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";
import { BOOKINGS_PATH, SERVICES_PATH } from "../config/env.config.js";
import { sendError } from "../utils/httpError.js";
const bookingManager = new BookingManager(BOOKINGS_PATH);
const serviceManager = new ServiceManager(SERVICES_PATH);
export const createBooking = async (req, res) => {
try {
    const booking = await bookingManager.createBooking(req.body);
    res.status(201).json({ status: "success", payload: booking });
} catch (error) {
    sendError(res, error);
}
};
export const getBookingById = async (req, res) => {
try {
    const { bid } = req.params;
    const booking = await bookingManager.getBookingById(bid);
    res.status(200).json({ status: "success", payload: booking });
} catch (error) {
    sendError(res, error);
}
};
export const addServiceToBooking = async (req, res) => {
try {
    const { bid, sid } = req.params;
    await serviceManager.getServiceById(sid);
    const booking = await bookingManager.addServiceToBooking(bid, sid);
    res.status(200).json({ status: "success", payload: booking });
} catch (error) {
    sendError(res, error);
}
};