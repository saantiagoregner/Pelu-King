import { z } from "zod";
export const objectIdSchema = (field) =>
z
    .string({ error: `${field} es obligatorio` })
    .regex(/^[0-9a-fA-F]{24}$/, `${field} no es un id válido de MongoDB`);
export const serviceIdParamsSchema = z.object({
sid: objectIdSchema("sid"),
});
export const bookingIdParamsSchema = z.object({
bid: objectIdSchema("bid"),
});
export const strictBody = (shape) =>
z.strictObject(shape, {
    error: (issue) =>
    issue.code === "unrecognized_keys"
        ? `Campos no permitidos: ${issue.keys.join(", ")}`
        : undefined,
});