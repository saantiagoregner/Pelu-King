import bookingsRepository from "../repositories/bookings.repository.js";
import servicesService from "./services.service.js";
import { HttpError } from "../utils/httpError.js";
export class BookingsService {
constructor(repository, servicesService) {
    this.repository = repository;
    this.servicesService = servicesService;
}
async createBooking(data) {
    return await this.repository.create({ ...data, services: [] });
}
async getBookingById(id) {
    const booking = await this.repository.getByIdPopulated(id);
    if (!booking) throw new HttpError(404, `No existe la reserva con id ${id}`);
    return booking;
}
async addServiceToBooking(bid, sid, quantity = 1) {
    await this.servicesService.getServiceById(sid);
    const booking = await this.repository.getById(bid);
    if (!booking) throw new HttpError(404, `No existe la reserva con id ${bid}`);
    const services = booking.services.map((s) => ({
    service: String(s.service),
    quantity: s.quantity,
    }));
    const item = services.find((s) => s.service === sid);
    if (item) {
    item.quantity += quantity;
    } else {
    services.push({ service: sid, quantity });
    }
    return await this.repository.update(bid, { services });
}
}
export default new BookingsService(bookingsRepository, servicesService);