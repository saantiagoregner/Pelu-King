import servicesService from "../services/services.service.js";
import { sendError } from "../utils/httpError.js";
export const renderServices = async (req, res) => {
try {
    const services = await servicesService.getServices();
    res.status(200).render("services", { title: "Servicios", services });
} catch (error) {
    sendError(res, error);
}
};
export const renderAvailability = async (req, res) => {
try {
    const available = await servicesService.getServices({ available: "true" });
    const unavailable = await servicesService.getServices({ available: "false" });
    res.status(200).render("availability", {
    title: "Disponibilidad",
    available,
    unavailable,
    });
} catch (error) {
    sendError(res, error);
}
};