import fs from "fs/promises";
import crypto from "crypto";
import { HttpError } from "../utils/httpError.js";
const VALID_STATUS = ["pending", "confirmed", "cancelled"];
export default class BookingManager {
constructor(path) {
    this.path = path;
}
async #readFile() {
    try {
    const data = await fs.readFile(this.path, "utf-8");
    return data.trim() ? JSON.parse(data) : [];
    } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
    }
}
async #writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
}
#validate(data) {
    const { clientName, clientEmail, date, time, status = "pending" } = data;
    if (typeof clientName !== "string" || !clientName.trim())
    throw new HttpError(400, "clientName es obligatorio y debe ser un string");
    if (typeof clientEmail !== "string" || !/^\S+@\S+\.\S+$/.test(clientEmail))
    throw new HttpError(400, "clientEmail no es un email válido");
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new HttpError(400, "date debe tener formato YYYY-MM-DD");
    if (typeof time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
    throw new HttpError(400, "time debe tener formato HH:MM (24hs)");
    if (!VALID_STATUS.includes(status))
    throw new HttpError(400, `status debe ser uno de: ${VALID_STATUS.join(", ")}`);
    return {
    clientName: clientName.trim(),
    clientEmail: clientEmail.trim(),
    date,
    time,
    status,
    };
}
async createBooking(data) {
    const validated = this.#validate(data);
    const bookings = await this.#readFile();
    const newBooking = { id: crypto.randomUUID(), ...validated, services: [] };
    bookings.push(newBooking);
    await this.#writeFile(bookings);
    return newBooking;
}
async getBookingById(id) {
    const bookings = await this.#readFile();
    const booking = bookings.find((b) => b.id === id);
    if (!booking) throw new HttpError(404, `No existe la reserva con id ${id}`);
    return booking;
}
async addServiceToBooking(bid, sid) {
    const bookings = await this.#readFile();
    const booking = bookings.find((b) => b.id === bid);
    if (!booking) throw new HttpError(404, `No existe la reserva con id ${bid}`);
    const item = booking.services.find((s) => s.service === sid);
    if (item) {
    item.quantity += 1;
    } else {
    booking.services.push({ service: sid, quantity: 1 });
    }
    await this.#writeFile(bookings);
    return booking;
}
}