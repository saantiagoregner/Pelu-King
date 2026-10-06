import mongoose from "mongoose";
import Service from "../models/service.model.js";
export class ServicesDAO {
constructor(model) {
    this.model = model;
}
async getAll() {
    const services = await this.model.find().sort({ _id: 1 });
    return services.map((s) => s.toJSON());
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