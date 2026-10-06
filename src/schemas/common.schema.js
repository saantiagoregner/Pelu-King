import { z } from "zod";
export const objectIdSchema = (field) =>
z
.string({ error: `${field} es obligatorio` })
.regex(/^[0-9a-fA-F]{24}$/, `${field} no es un id válido de MongoDB`);