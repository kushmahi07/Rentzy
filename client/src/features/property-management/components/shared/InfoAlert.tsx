
import { Info, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

interface InfoAlertProps {
  type?: 'info' | 'warning' | 'success' | 'help';
  message: string;
  className?: string;
}

export const InfoAlert: React.FC<InfoAlertProps> = ({ 
  type = 'info', 
  message, 
  className = "" 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'help':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'help':
        return 'bg-gray-50 border-gray-200 text-gray-600';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <div className={`mt-8 p-4 rounded-lg border ${getStyles()} ${className}`}>
      <div className="flex items-center justify-center gap-2">
        {getIcon()}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default InfoAlert;
