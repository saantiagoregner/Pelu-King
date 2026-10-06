import bookingsDAO from "../dao/bookings.dao.js";
export class BookingsRepository {
constructor(dao) {
    this.dao = dao;
}
async create(data) {
    return await this.dao.create(data);
}
async getById(id) {
    return await this.dao.getById(id);
}
async getByIdPopulated(id) {
    return await this.dao.getByIdPopulated(id);
}
async update(id, data) {
    return await this.dao.update(id, data);
}
}
export default new BookingsRepository(bookingsDAO);