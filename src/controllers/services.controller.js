import servicesService from "../services/services.service.js";
import { sendError } from "../utils/httpError.js";
export const getServices = async (req, res) => {
try {
    const { category, available } = req.query;
    const services = await servicesService.getServices({ category, available });
    res.status(200).json({ status: "success", payload: services });
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
    res.status(201).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};
export const updateService = async (req, res) => {
try {
    const { sid } = req.params;
    const service = await servicesService.updateService(sid, req.body);
    res.status(200).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};
export const deleteService = async (req, res) => {
try {
    const { sid } = req.params;
    const service = await servicesService.deleteService(sid);
    res.status(200).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};