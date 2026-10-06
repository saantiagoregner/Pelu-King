import { z } from "zod";
import { objectIdSchema } from "./common.schema.js";
const STATUS = ["pending", "confirmed", "cancelled"];
const isRealDate = (value) => {
const date = new Date(`${value}T00:00:00Z`);
return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
export const createBookingBodySchema = z.object({
clientName: z
    .string({ error: "clientName es obligatorio y debe ser un string" })
    .trim()
    .min(1, "clientName no puede estar vacío"),
clientEmail: z
    .string({ error: "clientEmail es obligatorio y debe ser un string" })
    .trim()
    .regex(/^\S+@\S+\.\S+$/, "clientEmail no es un email válido"),
date: z
    .string({ error: "date es obligatorio y debe tener formato YYYY-MM-DD" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date debe tener formato YYYY-MM-DD")
    .refine(isRealDate, "date no es una fecha válida"),
time: z
    .string({ error: "time es obligatorio y debe tener formato HH:MM (24hs)" })
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "time debe tener formato HH:MM (24hs)"),
status: z
    .enum(STATUS, { error: `status debe ser uno de: ${STATUS.join(", ")}` })
    .default("pending"),
});
export const addServiceParamsSchema = z.object({
  bid: objectIdSchema("bid"),
  sid: objectIdSchema("sid"),
});
export const addServiceBodySchema = z.object({
quantity: z
    .number({ error: "quantity debe ser un número entero mayor o igual a 1" })
    .int("quantity debe ser un número entero mayor o igual a 1")
    .min(1, "quantity debe ser un número entero mayor o igual a 1")
    .default(1),
});