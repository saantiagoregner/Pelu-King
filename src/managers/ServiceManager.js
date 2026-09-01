import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const servicesPath = path.join(__dirname, "..", "data", "services.json");

// Campos obligatorios para poder crear un servicio
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

  /**
   * Lee y parsea el archivo services.json.
   * @returns {Promise<Array>}
   */
  async #readServices() {
    try {
      const data = await readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer el archivo de servicios:", error.message);
      return [];
    }
  }

  /**
   * Persiste el array de servicios en el archivo services.json.
   * @param {Array} services
   */
  async #writeServices(services) {
    await writeFile(this.path, JSON.stringify(services, null, 2), "utf-8");
  }

  /**
   * Genera un id autoincremental en base al mayor id existente.
   * @param {Array} services
   * @returns {number}
   */
  #generateId(services) {
    if (services.length === 0) return 1;
    const maxId = Math.max(...services.map((service) => service.id));
    return maxId + 1;
  }

  /**
   * Devuelve todos los servicios.
   * @returns {Promise<Array>}
   */
  async getServices() {
    return await this.#readServices();
  }

  /**
   * Busca un servicio por id.
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async getServiceById(id) {
    const services = await this.#readServices();
    const service = services.find(
      (service) => service.id === Number(id)
    );
    if (!service) {
      return { error: `No se encontró ningún servicio con id ${id}` };
    }
    return service;
  }

  /**
   * Agrega un nuevo servicio. El id se genera automáticamente.
   * @param {Object} serviceData
   * @returns {Promise<Object>}
   */
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

  /**
   * Actualiza un servicio existente. No permite modificar el id.
   * @param {number} id
   * @param {Object} updatedData
   * @returns {Promise<Object>}
   */
  async updateService(id, updatedData) {
    const services = await this.#readServices();
    const index = services.findIndex((service) => service.id === Number(id));

    if (index === -1) {
      return { error: `No se encontró ningún servicio con id ${id}` };
    }

    // Se ignora cualquier intento de modificar el id
    const { id: _ignoredId, ...safeData } = updatedData;

    services[index] = {
      ...services[index],
      ...safeData,
    };

    await this.#writeServices(services);

    return services[index];
  }

  /**
   * Elimina un servicio por id.
   * @param {number} id
   * @returns {Promise<Object>}
   */
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
