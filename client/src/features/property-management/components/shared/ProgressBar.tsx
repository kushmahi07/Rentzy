
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, className = "" }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Progress</h3>
        <span className="text-sm text-gray-500">{value}%</span>
      </div>
      <Progress value={value} className="w-full" />
    </div>
  );
};

export default ProgressBar;
