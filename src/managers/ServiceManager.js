import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const servicesPath = path.join(__dirname, "..", "data", "services.json");
const REQUIRED_FIELDS = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

export class ServiceManager {
  constructor() {
    this.path = servicesPath;
  }
  async #readServices() {
    try {
      const data = await readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer el archivo de servicios:", error.message);
      return [];
    }
  }
  async #writeServices(services) {
    await writeFile(this.path, JSON.stringify(services, null, 2), "utf-8");
  }
  #generateId(services) {
    if (services.length === 0) return 1;
    const maxId = Math.max(...services.map((service) => service.id));
    return maxId + 1;
  }
  async getServices({ category, available } = {}) {
    let services = await this.#readServices();
    if (category !== undefined) {
      const wanted = String(category).toLowerCase();
      services = services.filter(
        (service) => String(service.category).toLowerCase() === wanted
      );
    }
    if (available !== undefined) {
      services = services.filter((service) => service.available === available);
    }
    return services;
  }
  async getServiceById(id) {
    const services = await this.#readServices();
    const service = services.find((service) => service.id === Number(id));
    if (!service) {
      return { error: `No se encontró ningún servicio con id ${id}` };
    }
    return service;
  }
  async addService(serviceData) {
    const missingFields = REQUIRED_FIELDS.filter(
      (field) => serviceData?.[field] === undefined || serviceData[field] === ""
    );
    if (missingFields.length > 0) {
      return {
        error: `Servicio incompleto. Faltan los campos: ${missingFields.join(
          ", "
        )}`,
      };
    }
    const services = await this.#readServices();
    const newService = {
      id: this.#generateId(services),
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available,
    };
    services.push(newService);
    await this.#writeServices(services);
    return newService;
  }
  async updateService(id, updatedData = {}) {
    const services = await this.#readServices();
    const index = services.findIndex((service) => service.id === Number(id));
    if (index === -1) {
      return { error: `No se encontró ningún servicio con id ${id}` };
    }
    const safeData = {};
    for (const field of REQUIRED_FIELDS) {
      if (updatedData[field] !== undefined) {
        safeData[field] = updatedData[field];
      }
    }
    services[index] = {
      ...services[index],
      ...safeData,
    };
    await this.#writeServices(services);
    return services[index];
  }
  async deleteService(id) {
    const services = await this.#readServices();
    const index = services.findIndex((service) => service.id === Number(id));
    if (index === -1) {
      return { error: `No se encontró ningún servicio con id ${id}` };
    }
    const [deletedService] = services.splice(index, 1);
    await this.#writeServices(services);
    return {
      message: `Servicio "${deletedService.name}" eliminado correctamente`,
      deletedService,
    };
  }
}