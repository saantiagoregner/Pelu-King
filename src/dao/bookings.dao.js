import fs from "fs/promises";
import crypto from "crypto";
import { BOOKINGS_PATH } from "../config/env.config.js";
export class BookingsDAO {
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
async create(data) {
    const bookings = await this.#readFile();
    const newBooking = { id: crypto.randomUUID(), ...data };
    bookings.push(newBooking);
    await this.#writeFile(bookings);
    return newBooking;
}
async getById(id) {
    const bookings = await this.#readFile();
    return bookings.find((b) => b.id === id) || null;
}
async update(id, data) {
    const bookings = await this.#readFile();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;
    bookings[index] = { ...bookings[index], ...data, id: bookings[index].id };
    await this.#writeFile(bookings);
    return bookings[index];
}
}
export default new BookingsDAO(BOOKINGS_PATH);