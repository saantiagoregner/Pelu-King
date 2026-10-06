import mongoose from "mongoose";
import Service from "../models/service.model.js";
export class ServicesDAO {
constructor(model) {
    this.model = model;
}
async find(filter = {}, { sort = { _id: 1 }, skip = 0, limit = 0 } = {}) {
    const services = await this.model
    .find(filter)
    .collation({ locale: "es", strength: 2 })
    .sort(sort)
    .skip(skip)
    .limit(limit);
    return services.map((s) => s.toJSON());
}
async count(filter = {}) {
    return await this.model.countDocuments(filter);
}
async getById(id) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const service = await this.model.findById(id);
    return service ? service.toJSON() : null;
}
async create(data) {
    const service = await this.model.create(data);
    return service.toJSON();
}
async update(id, data) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const service = await this.model.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
    });
    return service ? service.toJSON() : null;
}
async delete(id) {
    if (!mongoose.isObjectIdOrHexString(id)) return null;
    const service = await this.model.findByIdAndDelete(id);
    return service ? service.toJSON() : null;
}
}
export default new ServicesDAO(Service);