import { useState, useEffect } from "react";
import { getUnreadCount } from "../services/messageService";
import { isLoggedIn } from "../services/authService";

export function useUnreadCount(intervalMs = 30000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) return;

    let cancelled = false;
    const fetchCount = async () => {
      try {
        const result = await getUnreadCount();
        if (!cancelled) setCount(result.count || 0);
      } catch {
        // Tyst fail
      }
    };

    fetchCount();
    const id = setInterval(fetchCount, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return count;
}
