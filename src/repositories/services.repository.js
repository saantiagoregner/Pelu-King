import servicesDAO from "../dao/services.dao.js";
export class ServicesRepository {
constructor(dao) {
    this.dao = dao;
}
async getAll(filter, options) {
    return await this.dao.find(filter, options);
}
async count(filter) {
    return await this.dao.count(filter);
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