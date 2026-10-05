import ServiceManager from "../managers/ServiceManager.js";
import { SERVICES_PATH } from "../config/env.config.js";
import { sendError } from "../utils/httpError.js";
const serviceManager = new ServiceManager(SERVICES_PATH);
export const getServices = async (req, res) => {
try {
    const { category, available } = req.query;
    const services = await serviceManager.getServices({ category, available });
    res.status(200).json({ status: "success", payload: services });
} catch (error) {
    sendError(res, error);
}
};
export const getServiceById = async (req, res) => {
try {
    const { sid } = req.params;
    const service = await serviceManager.getServiceById(sid);
    res.status(200).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};
export const createService = async (req, res) => {
try {
    const service = await serviceManager.addService(req.body);
    res.status(201).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};
export const updateService = async (req, res) => {
try {
    const { sid } = req.params;
    const service = await serviceManager.updateService(sid, req.body);
    res.status(200).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};
export const deleteService = async (req, res) => {
try {
    const { sid } = req.params;
    const service = await serviceManager.deleteService(sid);
    res.status(200).json({ status: "success", payload: service });
} catch (error) {
    sendError(res, error);
}
};