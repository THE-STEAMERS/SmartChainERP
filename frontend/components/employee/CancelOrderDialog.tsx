// components/employee/CancelOrderDialog.tsx (continued)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio_group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedReason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
}

export const CancelOrderDialog = ({
  open,
  onOpenChange,
  selectedReason,
  onReasonChange,
  onConfirm
}: CancelOrderDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Cancel Order</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup 
            value={selectedReason} 
            onValueChange={onReasonChange}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
              <RadioGroupItem value="customer_choice" id="customer_choice" className="border-white">
                {selectedReason === "customer_choice" && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </RadioGroupItem>
              <Label htmlFor="customer_choice" className="text-white cursor-pointer">Customer Choice</Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
              <RadioGroupItem value="other_incident" id="other_incident" className="border-white">
                {selectedReason === "other_incident" && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </RadioGroupItem>
              <Label htmlFor="other_incident" className="text-white cursor-pointer">Other Incident</Label>
            </div>
          </RadioGroup>
          <div className="mt-6">
            <Button 
              onClick={onConfirm}
              disabled={!selectedReason}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};