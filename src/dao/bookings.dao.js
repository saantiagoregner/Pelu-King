import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
export class BookingsDAO {
constructor(model) {
    this.model = model;
}
async create(data) {
    const booking = await this.model.create(data);
    return booking.toJSON();
}
async getById(id) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const booking = await this.model.findById(id);
    return booking ? booking.toJSON() : null;
}
async getByIdPopulated(id) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const booking = await this.model.findById(id).populate("services.service");
    return booking ? booking.toJSON() : null;
}
async update(id, data) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const booking = await this.model.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
    });
    return booking ? booking.toJSON() : null;
}
}
export default new BookingsDAO(Booking);