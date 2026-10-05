import fs from "fs/promises";
import crypto from "crypto";
import { SERVICES_PATH } from "../config/env.config.js";
export class ServicesDAO {
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
async getAll() {
    return await this.#readFile();
}
async getById(id) {
    const services = await this.#readFile();
    return services.find((s) => s.id === id) || null;
}
async create(data) {
    const services = await this.#readFile();
    const newService = { id: crypto.randomUUID(), ...data };
    services.push(newService);
    await this.#writeFile(services);
    return newService;
}
async update(id, data) {
    const services = await this.#readFile();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    services[index] = { ...services[index], ...data, id: services[index].id };
    await this.#writeFile(services);
    return services[index];
}
async delete(id) {
    const services = await this.#readFile();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const [deleted] = services.splice(index, 1);
    await this.#writeFile(services);
    return deleted;
}
}
export default new ServicesDAO(SERVICES_PATH);