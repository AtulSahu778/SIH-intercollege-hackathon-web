import { useEffect, useState } from "react";
import { PORTAL_CLOSED, REGISTRATION_DEADLINE } from "@/lib/constants";

/**
 * Returns whether registrations are currently open.
 * If PORTAL_CLOSED is true, always returns false.
 * Safely initialises on the client side only (returns `true` during SSR
 * so the form always renders — the actual state is set after hydration).
 */
export function useRegistrationOpen(): boolean {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (PORTAL_CLOSED) {
      setIsOpen(false);
      return;
    }
    const check = () => setIsOpen(Date.now() < REGISTRATION_DEADLINE.getTime());
    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, []);

  return isOpen;
}
