"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, ArrowUp, StickyNote, Copy, Pencil, X } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { MessageLocation, ProjectMessage, SUBSCRIPTION_PLANS_IDS } from "@/lib/definitions"
import { useMessageStore } from "@/stores/message-store"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useNoteStore } from "@/stores/note-store"
import { AddAddressDialog } from "@/components/add-address-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getAnswer } from "@/lib/urbai-api"
import { MessageWithCitations } from "@/components/message-with-citations"
import { useProjectStore } from "@/stores/project-store"
import { useLibraryStore } from "@/stores/library-store"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { fetchCurrentSubscription } from "@/lib/user-data"
import { LIBRARY_TYPE_PRC } from "@/lib/constants"

interface ChatPanelProps {
    isMobile?: boolean
    project_id: string
}

export function ChatPanel({ isMobile = false, project_id }: ChatPanelProps) {

    const { user, updateUserSubscription } = useAuth();
    const { messages, fetchMessages, addMessage } = useMessageStore();
    const { projectLibraries, getProjectLibraries } = useLibraryStore();
    const { project, activeLibraries } = useProjectStore();
    const { notes, addNote } = useNoteStore();
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
    const [isAddressSelected, setIsAddressSelected] = useState(false)
    const [addressData, setAddressData] = useState<MessageLocation | null>(null);
    const [refreshSubscription, setRefreshSubscription] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const lineHeight = 24; // Altura aproximada de una línea en px
            const maxHeight = lineHeight * 4; // 4 filas máximo
            const newHeight = Math.min(textarea.scrollHeight, maxHeight);
            textarea.style.height = `${newHeight}px`;
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchMessages(project_id);
            await getProjectLibraries(project_id);
        }
        fetchInitialData();
    }, [project_id])

    useEffect(() => {
        const refreshCurrentSubscription = async () => {
            const subscription = await fetchCurrentSubscription();
            if (subscription) {
                updateUserSubscription(subscription);
            }
        }
        if (refreshSubscription) {
            refreshCurrentSubscription();
            setRefreshSubscription(false);
        }
    }, [refreshSubscription, updateUserSubscription])

    const removeCitations = (text: string) => {
        // Remove all citation markers like {{S1}}, {{S2}}, etc. and {{citations}}
        return text.replace(/\{\{S\d+\}\}/g, "").replace("{{citations}}", "").trim();
    }

    const copyToClipboard = async (text: string) => {
        try {
            const cleanedText = removeCitations(text);
            await navigator.clipboard.writeText(cleanedText)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const handleSendMessage = async () => {

        if (!message.trim()) return

        // Check if user is authenticated
        if (!user) {
            toast.error("!Ups! Debes iniciar sesión para usar esta función")
            return
        }

        // Check if user has a subscription
        if (!user?.subscription) {
            toast.error("No tienes una suscripción activa")
            return
        }

        // Check if user has remaining queries
        if (user.subscription.remaining <= 0) {
            toast.error("!Ups! Ya no tienes consultas disponibles")
            return
        }

        // Check if user has libraries
        if (activeLibraries.length === 0) {
            toast.error("!Ups! Debes seleccionar al menos un documento para realizar una consulta")
            return
        }

        // Check if user has multiple libraries
        if ((user.subscription.plan_id === SUBSCRIPTION_PLANS_IDS.starter || user.subscription.plan_id === SUBSCRIPTION_PLANS_IDS.basic) &&
            activeLibraries.length > 1) {
            toast.error("!Ups! La sección de múltiples documentos solo está disponible en el plan Pro o Custom")
            return
        }

        // Check if user has a PRC library and no address selected
        const prcLibrary = activeLibraries.find((lid) => projectLibraries.find((pl) => pl.library.id === lid)?.library.type_id === LIBRARY_TYPE_PRC);
        if (prcLibrary) {

            if (!addressData) {
                toast.error("!Ups! No es posible realizar una consulta a un Plan Regulador Comunal (PRC) sin seleccionar una ubicación");
                return
            }

            if (!addressData.formatted_address.includes(project?.commune?.name || "")) {
                toast.error("!Ups! La ubicación seleccionada no corresponde a la comuna de " + project?.commune?.name);
                return
            }
        }

        const userMessage: ProjectMessage = {
            id: crypto.randomUUID(),
            project_id: project_id,
            role: "user",
            content: message,
            location: addressData
        }

        await addMessage(userMessage);
        setMessage("");

        // Resetear la altura del textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        const projectLibrariesFiltered = projectLibraries.filter((pl) => activeLibraries.includes(pl.library.id));
        const vs_ids = projectLibrariesFiltered.map((pl) => pl.library.vector_store_id);
        //console.log('vs_ids', vs_ids);
        setIsLoading(true);
        const result = await getAnswer({
            project_id,
            commune_id: String(project?.commune_id) || "",
            message,
            vs_ids,
            subscription: user.subscription,
            location: addressData
        });

        if (!result.message) {
            console.error('Error getting answer:', result.error)
            setIsLoading(false)
            return;
        }

        const { message: urbaiMessage } = result;
        await addMessage(urbaiMessage);
        setIsLoading(false);
        setRefreshSubscription(true);
    }

    const handleSaveNote = async (content: string) => {
        let name = "Nueva Nota";
        if (notes.find((note) => note.name === name)) {
            name = "Nueva Nota (" + (notes.findIndex((note) => note.name === name) + 1) + ")";
        }
        const cleanedContent = removeCitations(content);
        addNote(project_id, name, cleanedContent)
    }

    const handleAddressSelect = (addressData: any) => {
        // Agregar la dirección al mensaje actual
        if (addressData.formatted_address && addressData.latitude && addressData.longitude) {
            setIsAddressSelected(true);
        } else {
            setIsAddressSelected(false);
        }
        console.log('Address selected:', addressData)
        setAddressData(addressData)
    }

    return (
        <div className="h-full flex flex-col bg-background rounded-lg border border-border">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Chat</h2>
                {user?.subscription && (
                    <div className="flex flex-col justify-center h-full text-sm space-y-2">
                        <div className="flex justify-between text-xs space-x-2">
                            <span className="text-gray-600">Consultas disponibles</span>
                            <span className="text-gray-900">{user?.subscription?.remaining} / {Number(user?.subscription?.plan.queries)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-primary h-1 rounded-full" style={{ width: `${(Number(user?.subscription?.remaining) / Number(user?.subscription?.plan.queries)) * 100}%` }}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Content */}
            <ScrollArea className="flex-1 p-4">
                {
                    messages.length > 0 ? (
                        <div className="space-y-6">
                            {/* Project Message Card */}
                            {
                                messages.map((message) => (
                                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                        {
                                            message.role === "user" ? (
                                                <div className="group">
                                                    <Card key={message.id} className="bg-primary max-w-4xl rounded-br-none">
                                                        <CardContent className="p-4">
                                                            <div className="prose prose-sm max-w-none">
                                                                <p className="text-white leading-relaxed">
                                                                    {message.content}
                                                                </p>
                                                            </div>
                                                            {
                                                                message.location && (
                                                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                                                                        <MapPin className="size-3 text-white" />
                                                                        <p className="text-white text-xs leading-relaxed">
                                                                            {message.location?.formatted_address}
                                                                        </p>
                                                                    </div>
                                                                )
                                                            }
                                                        </CardContent>
                                                    </Card>
                                                    <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => copyToClipboard(message.content)}
                                                                    className="text-gray-600 hover:text-primary hover:bg-primary/5 h-8 w-8 p-0"
                                                                >
                                                                    <Copy className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="bottom" align="end" className="border-primary/50 text-primary">
                                                                <p className="text-xs">Copiar</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Card key={message.id} className="max-w-4xl rounded-bl-none">
                                                    <CardContent className="p-4">
                                                        <div className="prose prose-sm max-w-none">
                                                            <MessageWithCitations
                                                                content={message.content}
                                                                citations={message.citations || []}
                                                                projectLibraries={projectLibraries}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-gray-600 hover:text-primary hover:bg-primary/5 text-xs h-auto p-2"
                                                                onClick={() => handleSaveNote(message.content)}
                                                            >
                                                                <StickyNote className="h-4 w-4" />
                                                                Guardar como nota
                                                            </Button>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => copyToClipboard(message.content)}
                                                                        className="text-gray-600 hover:text-primary hover:bg-primary/5 text-xs h-auto p-2"
                                                                    >
                                                                        <Copy className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="bottom" className="border-primary/50 text-primary">
                                                                    <p className="text-xs">Copiar</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                    </div>
                                ))
                            }
                            {/* Loading message */}
                            {
                                isLoading && (
                                    <div className="flex justify-start">
                                        <Card className="max-w-4xl rounded-bl-none">
                                            <CardContent className="p-4">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} ></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} ></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )
                            }
                            {/* End of messages */}
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            No hay mensajes en este proyecto
                        </div>
                    )}
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
                <div className="relative">
                    <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center">
                            {
                                isAddressSelected ? (
                                    <DropdownMenu>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setIsAddressDialogOpen(true)}
                                                        className={`hover:bg-primary/10 hover:text-primary hover:border hover:border-primary/20 h-8 w-8 p-0 ${isAddressSelected ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-500"}`}>
                                                        <MapPin className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" align="start" className="border-primary/50 text-primary">
                                                <p className="text-xs truncate line-clamp-1 max-w-56">{addressData?.formatted_address}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <DropdownMenuContent side="top" align="start">
                                            <DropdownMenuItem onClick={() => setIsAddressDialogOpen(true)} className="focus:text-primary text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-pen-icon lucide-map-pin-pen">
                                                    <path d="M17.97 9.304A8 8 0 0 0 2 10c0 4.69 4.887 9.562 7.022 11.468" />
                                                    <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                                                    <circle cx="10" cy="10" r="3" />
                                                </svg>
                                                Cambiar ubicación
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setIsAddressSelected(false)} className="focus:text-primary text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-x-icon lucide-map-pin-x">
                                                    <path d="M19.752 11.901A7.78 7.78 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 19 19 0 0 0 .09-.077" />
                                                    <circle cx="12" cy="10" r="3" />
                                                    <path d="m21.5 15.5-5 5" />
                                                    <path d="m21.5 20.5-5-5" />
                                                </svg>
                                                Quitar ubicación
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    if (isAddressSelected) {
                                                        setIsAddressSelected(false)
                                                    } else {
                                                        setIsAddressDialogOpen(true)
                                                    }
                                                }}
                                                className={`hover:bg-primary/10 hover:text-primary hover:border hover:border-primary/20 h-8 w-8 p-0 ${isAddressSelected ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-500"}`}>
                                                <MapPin className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="start" className="border-primary/50 text-primary">
                                            <p className="text-xs">{isAddressSelected ? "Quitar ubicación" : "Seleccionar ubicación"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            }
                            {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {}}
                                className="text-gray-500 hover:bg-gray-200 h-8 w-8 p-0"
                                title="Adjuntar imagen"
                            >
                                <ImageIcon className="h-4 w-4" />
                            </Button>                             */}
                        </div>

                        <div className="flex-1 flex items-center min-h-8">
                            <Textarea
                                ref={textareaRef}
                                placeholder={isAddressSelected ? "Escribe tu pregunta asociada a la ubicación..." : "Escribe tu pregunta..."}
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    adjustTextareaHeight();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                className="w-full min-h-8 max-h-24 resize-none px-0 py-1.5 border-none bg-transparent text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-y-auto"
                                rows={1}
                            />
                        </div>

                        <Button
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isLoading}
                            className="bg-primary hover:bg-primary/90 text-white h-8 w-8 p-0"
                        >
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        console.log("Image uploaded:", e.target.files?.[0])
                    }}
                />
                <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                        {
                            activeLibraries.length > 0 && (
                                activeLibraries.length > 1 ?
                                    `Tus respuestas citarán los ${activeLibraries.length} documentos seleccionados si es necesario. ` :
                                    "Tus respuestas citarán el documento seleccionado. "
                            )
                        }
                        Urbai puede cometer errores. Verifica siempre la fuente referenciada.
                    </p>
                </div>
            </div>

            {/* Address Dialog */}
            <AddAddressDialog
                open={isAddressDialogOpen}
                onOpenChange={setIsAddressDialogOpen}
                onAddressSelect={handleAddressSelect}
                isAddressSelected={isAddressSelected}
            />
        </div>
    )
}
