import { z } from "zod";
const SORT_FIELDS = ["name", "price", "duration", "category"];
const requiredString = (field) =>
z
    .string({ error: `${field} es obligatorio y debe ser un string` })
    .trim()
    .min(1, `${field} no puede estar vacío`);
export const serviceBodySchema = z.object({
name: requiredString("name"),
description: requiredString("description"),
duration: z
    .number({ error: "duration debe ser un número (minutos)" })
    .positive("duration debe ser un número mayor a 0 (minutos)"),
price: z
    .number({ error: "price debe ser un número" })
    .min(0, "price debe ser un número mayor o igual a 0"),
category: requiredString("category"),
available: z.boolean({ error: "available debe ser true o false" }),
});
export const servicesQuerySchema = z.object({
category: z.string().trim().min(1, "category debe ser un string no vacío").optional(),
available: z
    .enum(["true", "false"], { error: "available debe ser true o false" })
    .transform((value) => value === "true")
    .optional(),
page: z.coerce
    .number({ error: "page debe ser un número entero mayor o igual a 1" })
    .int("page debe ser un número entero mayor o igual a 1")
    .min(1, "page debe ser un número entero mayor o igual a 1")
    .default(1),
limit: z.coerce
    .number({ error: "limit debe ser un número entero entre 1 y 50" })
    .int("limit debe ser un número entero entre 1 y 50")
    .min(1, "limit debe ser un número entero entre 1 y 50")
    .max(50, "limit debe ser un número entero entre 1 y 50")
    .default(10),
sortBy: z
    .enum(SORT_FIELDS, { error: `sortBy debe ser uno de: ${SORT_FIELDS.join(", ")}` })
    .optional(),
order: z.enum(["asc", "desc"], { error: "order debe ser asc o desc" }).default("asc"),
});