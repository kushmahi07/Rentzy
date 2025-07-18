
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, Save } from "lucide-react";

interface ActionButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  nextLabel?: string;
  nextIcon?: React.ReactNode;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  showSave?: boolean;
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPrevious,
  onNext,
  onSave,
  nextLabel = "Next",
  nextIcon = <ChevronRight className="h-4 w-4" />,
  isNextDisabled = false,
  isLoading = false,
  showSave = false,
  className = ""
}) => {
  return (
    <div className={`flex justify-between pt-8 ${className}`}>
      {onPrevious ? (
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
      ) : (
        <div />
      )}
      
      <div className="flex gap-4">
        {showSave && onSave && (
          <Button
            variant="outline"
            onClick={onSave}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        )}
        
        {onNext && (
          <Button
            className="bg-[#004182] hover:bg-[#003366] text-white flex items-center gap-2"
            onClick={onNext}
            disabled={isNextDisabled || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                {nextLabel}
                {nextIcon}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
