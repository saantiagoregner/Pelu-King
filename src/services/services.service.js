import servicesRepository from "../repositories/services.repository.js";
import { HttpError } from "../utils/httpError.js";
import { escapeRegex } from "../utils/escapeRegex.js";
export class ServicesService {
constructor(repository) {
    this.repository = repository;
}
#buildFilter({ category, available } = {}) {
    const filter = {};
    if (category !== undefined) {
    filter.category = { $regex: `^${escapeRegex(category.trim())}$`, $options: "i" };
    }
    if (available !== undefined) {
    filter.available = available === true || available === "true";
    }
    return filter;
}
async getServices(filters = {}) {
    return await this.repository.getAll(this.#buildFilter(filters));
}
async getServicesPaginated({ category, available, page = 1, limit = 10, sortBy, order = "asc" } = {}) {
    const filter = this.#buildFilter({ category, available });
    const direction = order === "desc" ? -1 : 1;
    const sort = sortBy ? { [sortBy]: direction, _id: 1 } : { _id: direction };
    const total = await this.repository.count(filter);
    const totalPages = Math.ceil(total / limit);
    const docs = await this.repository.getAll(filter, {
    sort,
      skip: (page - 1) * limit,
    limit,
    });
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    return {
    docs,
    total,
    page,
    limit,
    totalPages,
    hasPrevPage,
    hasNextPage,
    prevPage: hasPrevPage ? page - 1 : null,
    nextPage: hasNextPage ? page + 1 : null,
    };
}
async getServiceById(id) {
    const service = await this.repository.getById(id);
    if (!service) throw new HttpError(404, `No existe el servicio con id ${id}`);
    return service;
}
async createService(data) {
    return await this.repository.create(data);
}
async updateService(id, data) {
    const updated = await this.repository.update(id, data);
    if (!updated) throw new HttpError(404, `No existe el servicio con id ${id}`);
    return updated;
}
async deleteService(id) {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new HttpError(404, `No existe el servicio con id ${id}`);
    return deleted;
}
}
export default new ServicesService(servicesRepository);