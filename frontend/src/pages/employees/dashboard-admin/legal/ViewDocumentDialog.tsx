import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  
  interface ViewDocumentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    document: {
      id: string;
      name: string;
      content: string;
      type: string;
    } | null;
  }
  
  export default function ViewDocumentDialog({
    isOpen,
    onClose,
    document,
  }: ViewDocumentDialogProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{document?.name || "Documento"}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600">{document?.content}</p>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  