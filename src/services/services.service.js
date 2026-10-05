import servicesRepository from "../repositories/services.repository.js";
import { HttpError } from "../utils/httpError.js";
export class ServicesService {
constructor(repository) {
    this.repository = repository;
}
#validate(data) {
    const { name, description, duration, price, category, available } = data;
    if (typeof name !== "string" || !name.trim())
    throw new HttpError(400, "name es obligatorio y debe ser un string");
    if (typeof description !== "string" || !description.trim())
    throw new HttpError(400, "description es obligatorio y debe ser un string");
    if (typeof duration !== "number" || !(duration > 0))
    throw new HttpError(400, "duration debe ser un número mayor a 0 (minutos)");
    if (typeof price !== "number" || price < 0)
    throw new HttpError(400, "price debe ser un número mayor o igual a 0");
    if (typeof category !== "string" || !category.trim())
    throw new HttpError(400, "category es obligatorio y debe ser un string");
    if (typeof available !== "boolean")
    throw new HttpError(400, "available debe ser true o false");
    return {
    name: name.trim(),
    description: description.trim(),
    duration,
    price,
    category: category.trim(),
    available,
    };
}
async getServices({ category, available } = {}) {
    let services = await this.repository.getAll();
    if (category !== undefined) {
    if (typeof category !== "string" || !category.trim())
        throw new HttpError(400, "category debe ser un string no vacío");
    const wanted = category.trim().toLowerCase();
    services = services.filter((s) => s.category.toLowerCase() === wanted);
    }
    if (available !== undefined) {
    if (available !== "true" && available !== "false")
        throw new HttpError(400, "available debe ser true o false");
    const wanted = available === "true";
    services = services.filter((s) => s.available === wanted);
    }
    return services;
}
async getServiceById(id) {
    const service = await this.repository.getById(id);
    if (!service) throw new HttpError(404, `No existe el servicio con id ${id}`);
    return service;
}
async createService(data) {
    const validated = this.#validate(data);
    return await this.repository.create(validated);
}
async updateService(id, data) {
    const validated = this.#validate(data);
    const updated = await this.repository.update(id, validated);
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