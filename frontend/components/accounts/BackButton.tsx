import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface BackButtonProps {
  onBack: () => void;
}

export const BackButton = ({ onBack }: BackButtonProps) => (
  <Button 
    variant="ghost" 
    onClick={onBack} 
    className="mb-6 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
  >
    <FileText className="w-4 h-4 mr-2" />
    Back
  </Button>
);