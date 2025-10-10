'use client';

import { MailIcon, Phone } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/login-schema";
import z from "zod";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/definitions";
import { updateUser } from "@/lib/user-action";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { existsUserByPhone } from "@/lib/user-data";

type InputValues = {
    name: string;
    phone: string;
}

export default function UserForm({ user }: { user: User }) {

    const [values, setValues] = useState({ name: "", phone: "" });
    const [errors, setErrors] = useState({ name: [], phone: [] });
    const { execute, isPending } = useAction(updateUser);

    useEffect(() => {
        console.log("user", user);
        setValues({ name: user.name, phone: user.phone });
    }, [user]);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        const updatedValues = { ...values, [name]: value };
        setValues(updatedValues);

        const newErrors = validateForm(updatedValues, name);
        if (value.length <= 0 && newErrors) newErrors[name] = [];
        setErrors({ ...errors, ...newErrors });
    }

    function validateForm(values: InputValues, field: string) {

        try {

            loginSchema.parse(values);
            return field ? { [field]: [] } : {};

        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = error.flatten().fieldErrors;
                return field ? { [field]: newErrors[field] || [] } : newErrors;
            }
        }
    }

    async function handleUpdateUser(formData: FormData) {

        if (values.name === "" || values.phone === "") return;

        const name = values.name;
        const phone = values.phone;

        const existingUser = await existsUserByPhone(user.uid, phone);
        console.log("existingUser", existingUser);
        if (existingUser) {
            toast.error("Información no fue actualizada. El número de whatsapp ya se encuentra registrado en otro usuario");
        } else {
            console.log("handleUpdateUser", name, phone);
            execute({ uid: user.uid, name, phone, active: user.active });
            toast.success(user.active ? "Información actualizada correctamente" : "Cuenta activada correctamente, te enviaremos un mensaje de bienvenida");
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nombre completo
                </Label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        value={values.name || ""}
                        onChange={handleChange}
                        placeholder="Ingresa tu nombre completo"
                        className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                    />
                </div>
                {
                    errors?.name && (<p className="mt-2 text-red-500 text-sm">{errors.name}</p>)
                }
            </div>

            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Correo electrónico
                </Label>
                <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        disabled
                        defaultValue={user.email}
                        placeholder="Ingresa tu correo electrónico"
                        className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Número de whatsapp
                </Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        disabled={user.active}
                        value={values.phone || ""}
                        onChange={handleChange}
                        placeholder="Ingresa tu número de whatsapp (ej., 56912345678)"
                        maxLength={11}
                        className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                    />
                </div>
                {
                    errors?.phone && (<p className="mt-2 text-red-500 text-sm">{errors.phone}</p>)
                }
            </div>

            <form className="flex justify-end mt-8">
                <Button formAction={handleUpdateUser}
                    className="bg-primary hover:bg-primary/90 text-white" disabled={isPending || !values.name || !values.phone || errors.name.length > 0 || errors.phone.length > 0}>
                    {user.active ? "Actualizar" : "Activar cuenta"}
                </Button>
            </form>

        </div>
    )
}