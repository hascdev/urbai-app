"use client"

import dynamic from 'next/dynamic';
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { MapPin } from "lucide-react"

const AddressAutofillComponent = dynamic(
    () => import('@mapbox/search-js-react').then((mod) => {
        const Component = mod.AddressAutofill as any;
        return { default: Component };
    }),
    { ssr: false }
) as any;

const AddressMinimapComponent = dynamic(
    () => import('@mapbox/search-js-react').then((mod) => {
        const Component = mod.AddressMinimap as any;
        return { default: Component };
    }),
    { ssr: false }
) as any;

interface AddAddressDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddressSelect: (address: AddressData) => void
    isAddressSelected: boolean
}

interface AddressData {
    address: string
    latitude: number
    longitude: number
    formatted_address: string
}

interface GeocodeResult {
    formatted_address: string
    geometry: {
        location: {
            lat: number
            lng: number
        }
    }
}

export function AddAddressDialog({ open, onOpenChange, onAddressSelect, isAddressSelected }: AddAddressDialogProps) {
    const [address, setAddress] = useState("")
    const [addressError, setAddressError] = useState("")
    const [minimapFeature, setMinimapFeature] = useState<any>(null)
    const [isReady, setIsReady] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState<boolean>(false)

    useEffect(() => {
        setSelectedAddress(isAddressSelected)
    }, [isAddressSelected])

    useEffect(() => {
        if (open) {
            setIsReady(false)
            const timer = setTimeout(() => setIsReady(true), 150)
            return () => clearTimeout(timer)
        } else {
            setIsReady(false)
            // Limpiar el estado después de que el diálogo se haya cerrado
            const cleanupTimer = setTimeout(() => {
                console.log("isAddressSelected", isAddressSelected)
                if (!selectedAddress) {
                    setAddress("")
                    setAddressError("")
                    setMinimapFeature(null)
                }
            }, 300)
            return () => clearTimeout(cleanupTimer)
        }
    }, [open, selectedAddress])

    const handleSelectAddress = () => {
        if (!address || !minimapFeature) {
            setAddressError("Por favor, ingresa una dirección")
            return
        }
        setAddressError("")
        onAddressSelect({
            address: address,
            latitude: minimapFeature?.geometry.coordinates[1],
            longitude: minimapFeature?.geometry.coordinates[0],
            formatted_address: minimapFeature?.properties?.full_address
        });
        onOpenChange(false)
    }

    const handleClose = () => {
        onOpenChange(false)
    }

    const handleAutofillRetrieve = (response: any) => {
        const feature = response?.features?.[0]
        if (!feature) return

        console.log("feature", feature)
        setMinimapFeature(feature)

        const address = feature.properties?.address_line1;

        if (address) {
            setAddressError("")
            setAddress(address)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[500px] overflow-visible"
                onPointerDownOutside={(e) => {
                    // Evitar que el diálogo se cierre al interactuar con el dropdown de Mapbox
                    const target = e.target as HTMLElement
                    if (target.closest('[class*="mapbox"], [class*="mbx"]')) {
                        e.preventDefault()
                    }
                }}
            >
                <DialogHeader className="space-y-4">
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Seleccionar ubicación
                    </DialogTitle>
                    <DialogDescription>Esta dirección permitará que tus respuestas sean más precisas y relevantes.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="space-y-2">
                        <label htmlFor="address-input" className="text-sm font-medium">
                            Dirección
                        </label>
                        <div className="mt-2">
                            {isReady ? (
                                <AddressAutofillComponent
                                    accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""}
                                    onRetrieve={handleAutofillRetrieve}
                                    options={{ country: "CL", language: "es", streets: false }}
                                >
                                    <Input
                                        id="address-input"
                                        autoComplete="full-address"
                                        value={address}
                                        onChange={(e) => {
                                            setAddress(e.target.value)
                                            setAddressError("")
                                        }}
                                        placeholder="Ej. Avenida Arturo Prat 20, Valdivia"
                                        className="w-full"
                                        autoFocus
                                        required
                                    />
                                </AddressAutofillComponent>
                            ) : (
                                <Input
                                    id="address-input"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Ej. Avenida Arturo Prat 20, Valdivia"
                                    className="w-full"
                                    disabled
                                    required
                                />
                            )}
                        </div>
                        {
                            addressError && (<p className="mt-2 text-destructive text-sm">{addressError}</p>)
                        }
                    </div>

                    {minimapFeature && isReady && (
                        <div className="w-full h-60">
                            <AddressMinimapComponent
                                feature={minimapFeature}
                                show={!!minimapFeature}
                                defaultMapStyle={['mapbox', 'light-v11']}
                                theme={{ variables: { colorPrimary: '#625bf6' } }}
                                accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSelectAddress} 
                        disabled={!isReady || !minimapFeature || !address}
                        className="text-white bg-primary hover:bg-primary/90" >
                        Seleccionar ubicación
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
