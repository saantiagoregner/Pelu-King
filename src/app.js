import { env } from "./config/env.config.js";
import { ServiceManager } from "./managers/ServiceManager.js";

const serviceManager = new ServiceManager();

async function main() {
  console.log(`🚀 Peluking API iniciando en modo "${env.nodeEnv}" - puerto ${env.port}`);
  console.log("----------------------------------------------------");

  // 1. Obtener todos los servicios
  const services = await serviceManager.getServices();
  console.log("📋 Servicios actuales:", services);

  // 2. Buscar un servicio por id
  const service = await serviceManager.getServiceById(1);
  console.log("🔍 Servicio con id 1:", service);

  // 3. Agregar un nuevo servicio
  const newService = await serviceManager.addService({
    name: "Alisado con keratina",
    description: "Tratamiento de alisado progresivo con keratina",
    duration: 120,
    price: 15000,
    category: "tratamiento",
    available: true,
  });
  console.log("➕ Servicio agregado:", newService);

  // 4. Actualizar un servicio existente
  const updatedService = await serviceManager.updateService(2, {
    price: 13000,
    available: false,
  });
  console.log("✏️ Servicio actualizado:", updatedService);

  // 5. Eliminar un servicio
  const deletedResult = await serviceManager.deleteService(5);
  console.log("🗑️ Resultado de eliminar:", deletedResult);

  console.log("----------------------------------------------------");
  console.log("✅ Demo finalizada. Revisá src/data/services.json para ver los cambios persistidos.");
}

main();
