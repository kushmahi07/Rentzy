
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { getKycStatusBadge } from "../utils";

interface KycStatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

export default function KycStatusBadge({ status, showIcon = false }: KycStatusBadgeProps) {
  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const displayStatus = (status || 'pending').charAt(0).toUpperCase() + (status || 'pending').slice(1);

  return (
    <div className="flex items-center gap-2">
      {showIcon && getKycStatusIcon(status)}
      <Badge className={getKycStatusBadge(status)}>
        {!showIcon && (
          <div className="flex items-center gap-1">
            {getKycStatusIcon(status)}
            {displayStatus}
          </div>
        )}
        {showIcon && displayStatus}
      </Badge>
    </div>
  );
}
