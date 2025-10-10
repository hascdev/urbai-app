'use client'

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { sendFeedback } from "@/lib/user-action";
import { Loader2 } from "lucide-react";
import { useUser } from '../../stimar-webapp/hooks/use-user';

export function FeedbackPopover() {

    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [comment, setComment] = useState("");

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    }

    async function handleSend() {
        
        setIsPending(true);
        await sendFeedback({
            user_id: user?.id as string,
            comment: comment
        });
        setComment("");
        setIsPending(false);
        setIsOpen(false);
    }

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" aria-label="Feedback" className="rounded-full font-normal">
                    Feedback
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end" side="bottom">
                <div className="grid">
                    <div className="p-4">
                        <Textarea id="comment" name="comment" placeholder="Sería genial si..." className="resize-none" onChange={(e) => setComment(e.target.value)} value={comment} />
                    </div>
                    <Separator />
                    <div className="flex justify-between px-4 py-2">
                        <div className="flex items-center gap-1">
                            <p className="text-xs text-muted-foreground">Contactar</p>
                            <Link href="mailto:hola@urbai.cl" target="_blank" className="text-xs text-urbai hover:underline">
                                soporte
                            </Link>
                        </div>
                        <Button 
                            size="sm" 
                            className="bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
                            disabled={isPending || comment.length === 0} 
                            onClick={handleSend}>
                                {isPending ? "Enviando" : "Enviar"}
                                {isPending && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover >
    )
}