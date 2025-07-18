
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserInitials } from "../utils";

interface UserAvatarProps {
  user: any;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg font-semibold'
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ''}`}>
      <AvatarFallback className={`bg-blue-100 text-blue-600 ${textSizeClasses[size]}`}>
        {getUserInitials(user)}
      </AvatarFallback>
    </Avatar>
  );
}
