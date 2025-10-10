import z from "zod";

export const userSchema = z.object({
    uid: z.string(),
    name: z.string().min(2, { message: "Nombre completo es requerido" }),
    phone: z.string().min(11, { message: "Número de whatsapp es requerido" }),
    active: z.boolean().default(false)
});

export const subscriptionSchema = z.object({
    user_id: z.string(),
    plan_id: z.string(),
    status: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    payment_due_date: z.string()
});

export const preferenceSchema = z.object({
    new_plan_id: z.string(),
    subscription_id: z.string()
});

export const feedbackSchema = z.object({
    user_id: z.string(),
    comment: z.string()
});