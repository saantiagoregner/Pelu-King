import { Router } from "express";
export default function servicesRouter(serviceManager) {
const router = Router();
router.get("/", async (req, res, next) => {
    try {
    const services = await serviceManager.getServices();
    res.json({ status: "success", payload: services });
    } catch (error) {
    next(error);
    }
});
router.get("/:sid", async (req, res, next) => {
    try {
    const service = await serviceManager.getServiceById(req.params.sid);
    res.json({ status: "success", payload: service });
    } catch (error) {
    next(error);
    }
});
router.post("/", async (req, res, next) => {
    try {
    const service = await serviceManager.addService(req.body);
    res.status(201).json({ status: "success", payload: service });
    } catch (error) {
    next(error);
    }
});
router.put("/:sid", async (req, res, next) => {
    try {
    const service = await serviceManager.updateService(req.params.sid, req.body);
    res.json({ status: "success", payload: service });
    } catch (error) {
    next(error);
    }
});

router.delete("/:sid", async (req, res, next) => {
    try {
    const service = await serviceManager.deleteService(req.params.sid);
    res.json({ status: "success", payload: service });
    } catch (error) {
    next(error);
    }
});
return router;
}