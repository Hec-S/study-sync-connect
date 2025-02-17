import { cn } from "@/lib/utils";
import { useNotifications } from "@/contexts/NotificationsContext";

interface NotificationBadgeProps {
  className?: string;
  type?: 'all' | 'messages' | 'social';
}

export function NotificationBadge({ className, type = 'all' }: NotificationBadgeProps) {
  const { messageCount, requestCount } = useNotifications();
  
  // Ensure counts are valid numbers and greater than 0
  const validRequestCount = typeof requestCount === 'number' && requestCount > 0 ? requestCount : 0;
  const validMessageCount = typeof messageCount === 'number' && messageCount > 0 ? messageCount : 0;
  
  // Calculate count based on type
  let count = 0;
  let ariaLabel = '';
  
  switch (type) {
    case 'messages':
      count = validMessageCount;
      ariaLabel = `${validMessageCount} unread ${validMessageCount === 1 ? 'message' : 'messages'}`;
      break;
    case 'social':
      count = validRequestCount;
      ariaLabel = `${validRequestCount} connection ${validRequestCount === 1 ? 'request' : 'requests'}`;
      break;
    case 'all':
    default:
      count = validRequestCount + validMessageCount;
      ariaLabel = `${count} total notifications: ${validRequestCount} connection ${validRequestCount === 1 ? 'request' : 'requests'} and ${validMessageCount} unread ${validMessageCount === 1 ? 'message' : 'messages'}`;
  }

  if (count === 0) return null;

  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={cn(
        "absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-[20px] h-5 px-1",
        "flex items-center justify-center text-xs font-medium",
        className
      )}
    >
      {count}
    </span>
  );
}
