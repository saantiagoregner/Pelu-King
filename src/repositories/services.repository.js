import servicesDAO from "../dao/services.dao.js";
export class ServicesRepository {
constructor(dao) {
    this.dao = dao;
}
async getAll() {
    return await this.dao.getAll();
}
async getById(id) {
    return await this.dao.getById(id);
}
async create(data) {
    return await this.dao.create(data);
}
async update(id, data) {
    return await this.dao.update(id, data);
}
async delete(id) {
    return await this.dao.delete(id);
}
}

export default new ServicesRepository(servicesDAO);