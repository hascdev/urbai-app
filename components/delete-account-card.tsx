"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function DeleteAccountCard() {

    const router = useRouter()

    return (
        <Card className="bg-white border-red-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-red-600">Zona de peligro</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900">Eliminar cuenta</p>
                        <p className="text-sm text-gray-600">
                            Elimina permanentemente tu cuenta y todos los datos asociados
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => {
                            router.push("mailto:hola@urbai.cl?subject=Eliminar cuenta&body=Hola, me gustaría eliminar mi cuenta de Urbai.")
                        }}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar cuenta
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}