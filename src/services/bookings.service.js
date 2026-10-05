import bookingsRepository from "../repositories/bookings.repository.js";
import servicesService from "./services.service.js";
import { HttpError } from "../utils/httpError.js";
const VALID_STATUS = ["pending", "confirmed", "cancelled"];
export class BookingsService {
constructor(repository, servicesService) {
    this.repository = repository;
    this.servicesService = servicesService;
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
    return { clientName: clientName.trim(), clientEmail: clientEmail.trim(), date, time, status };
} 
async createBooking(data) {
    const validated = this.#validate(data);
    return await this.repository.create({ ...validated, services: [] });
}
async getBookingById(id) {
    const booking = await this.repository.getById(id);
    if (!booking) throw new HttpError(404, `No existe la reserva con id ${id}`);
    return booking;
}
async addServiceToBooking(bid, sid) {
    await this.servicesService.getServiceById(sid);
    const booking = await this.getBookingById(bid);
    const services = booking.services.map((s) => ({ ...s }));
    const item = services.find((s) => s.service === sid);
    if (item) {
    item.quantity += 1;
    } else {
    services.push({ service: sid, quantity: 1 });
    }
    return await this.repository.update(bid, { services });
}
}
export default new BookingsService(bookingsRepository, servicesService);