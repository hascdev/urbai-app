import {
    Dialog,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip"; // Import the arrow

export function HelpDialog({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <DialogTrigger asChild>
                        <TooltipTrigger asChild>
                            <button>Open Dialog with Tooltip</button>
                        </TooltipTrigger>
                    </DialogTrigger>
                    <TooltipContent>
                        <p>This is a tooltip with an arrow!</p>
                        <TooltipArrow /> {/* Customize arrow color */}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent>
                <p>This is the content of the dialog.</p>
            </DialogContent>
        </Dialog>
    );
}