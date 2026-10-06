import servicesService from "../services/services.service.js";
import { sendError } from "../utils/httpError.js";
import { emitEvent } from "../utils/emitEvent.js";
export const getServices = async (req, res) => {
try {
    const { docs, ...pagination } = await servicesService.getServicesPaginated(req.validatedQuery);
    res.status(200).json({ status: "success", payload: docs, ...pagination });
} catch (error) {
    sendError(res, error);
}
};
export const getServiceById = async (req, res) => {
try {
    const { sid } = req.params;
    const service = await servicesService.getServiceById(sid);
    res.status(200).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};
export const createService = async (req, res) => {
try {
    const service = await servicesService.createService(req.body);
    emitEvent(req, "service:created", service);
    res.status(201).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};
export const updateService = async (req, res) => {
try {
    const { sid } = req.params;
    const service = await servicesService.updateService(sid, req.body);
    emitEvent(req, "service:updated", service);
    res.status(200).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};
export const deleteService = async (req, res) => {
try {
    const { sid } = req.params;
    const service = await servicesService.deleteService(sid);
    emitEvent(req, "service:deleted", { id: service.id });
    res.status(200).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};