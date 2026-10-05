import fs from "fs/promises";
import crypto from "crypto";
import { HttpError } from "../utils/httpError.js";
export default class ServiceManager {
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
    let services = await this.#readFile();
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
    const services = await this.#readFile();
    const service = services.find((s) => s.id === id);
    if (!service) throw new HttpError(404, `No existe el servicio con id ${id}`);
    return service;
  }
  async addService(data) {
    const validated = this.#validate(data);
    const services = await this.#readFile();
    const newService = { id: crypto.randomUUID(), ...validated };
    services.push(newService);
    await this.#writeFile(services);
    return newService;
  }
  async updateService(id, data) {
    const validated = this.#validate(data);
    const services = await this.#readFile();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) throw new HttpError(404, `No existe el servicio con id ${id}`);
    services[index] = { id: services[index].id, ...validated };
    await this.#writeFile(services);
    return services[index];
  }
  async deleteService(id) {
    const services = await this.#readFile();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) throw new HttpError(404, `No existe el servicio con id ${id}`);
    const [deleted] = services.splice(index, 1);
    await this.#writeFile(services);
    return deleted;
  }
}