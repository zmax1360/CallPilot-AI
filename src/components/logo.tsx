import { PhoneCall } from 'lucide-react';
import type React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, iconOnly = false }) => {
  return (
    <div className={`flex items-center gap-2 text-sidebar-primary-foreground ${className}`}>
      <PhoneCall className="h-7 w-7 text-sidebar-primary" />
      {!iconOnly && (
        <span className="text-xl font-semibold">
          CallPilot AI
        </span>
      )}
    </div>
  );
};

export default Logo;
