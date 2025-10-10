import { z } from "zod";

export const loginSchema = z.object({
    name: z.string().min(2, { message: "Nombre completo es requerido" }),
    phone: z.string()
        .regex(/^[1-9]\d{10}$/, {
            message: "Ingrese un número de whatsapp válido (ej., 56912345678)"
        })
        .min(1, { message: "Número de whatsapp es requerido" })
});