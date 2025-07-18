
import { ChevronRight, ArrowLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onBack }) => {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      {onBack && (
        <button 
          onClick={onBack}
          className="hover:text-blue-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Property Management
        </button>
      )}
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {(index > 0 || onBack) && <ChevronRight className="h-4 w-4" />}
          {item.onClick ? (
            <button 
              onClick={item.onClick}
              className={`transition-colors ${
                item.isActive 
                  ? "text-gray-900 font-medium" 
                  : "hover:text-blue-600"
              }`}
            >
              {item.label}
            </button>
          ) : (
            <span className={item.isActive ? "text-gray-900 font-medium" : ""}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
