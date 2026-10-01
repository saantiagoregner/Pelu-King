import { Router } from "express";
import { ServiceManager } from "../managers/ServiceManager.js";

const router = Router();
const serviceManager = new ServiceManager();

const serverError = (res, error) => {
console.error(error);
return res
    .status(500)
    .json({ status: "error", message: "Error interno del servidor" });
};
router.get("/", async (req, res) => {
try {
    const { category, available } = req.query;

    if (available !== undefined && available !== "true" && available !== "false") {
    return res.status(400).json({
        status: "error",
        message: 'El filtro "available" debe ser "true" o "false"',
    });
    }

    const services = await serviceManager.getServices({
    category,
    available: available === undefined ? undefined : available === "true",
    });

    return res.status(200).json({ status: "success", payload: services });
} catch (error) {
    return serverError(res, error);
}
});
router.get("/:sid", async (req, res) => {
try {
    const { sid } = req.params;
    const result = await serviceManager.getServiceById(sid);

    if (result.error) {
    return res.status(404).json({ status: "error", message: result.error });
    }

    return res.status(200).json({ status: "success", payload: result });
} catch (error) {
    return serverError(res, error);
}
});


router.post("/", async (req, res) => {
try {
    const result = await serviceManager.addService(req.body ?? {});

    if (result.error) {
    return res.status(400).json({ status: "error", message: result.error });
    }

    return res.status(201).json({ status: "success", payload: result });
} catch (error) {
    return serverError(res, error);
}
});
router.put("/:sid", async (req, res) => {
try {
    const { sid } = req.params;
    const body = req.body ?? {};

    if (Object.keys(body).length === 0) {
    return res.status(400).json({
        status: "error",
        message: "Tenés que enviar al menos un campo para actualizar",
    });
    }

    const result = await serviceManager.updateService(sid, body);

    if (result.error) {
    return res.status(404).json({ status: "error", message: result.error });
    }

    return res.status(200).json({ status: "success", payload: result });
} catch (error) {
    return serverError(res, error);
}
});


router.delete("/:sid", async (req, res) => {
try {
    const { sid } = req.params;
    const result = await serviceManager.deleteService(sid);

    if (result.error) {
    return res.status(404).json({ status: "error", message: result.error });
    }

    return res.status(200).json({ status: "success", payload: result });
} catch (error) {
    return serverError(res, error);
}
});

export default router;