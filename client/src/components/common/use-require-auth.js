import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/toast";

/**
 * Prompts an unauthenticated user to sign in.
 * Shows a toast with a "Sign in" action that routes to the login page.
 */
export function useRequireAuth() {
  const navigate = useNavigate();

  return useCallback(
    ({
      title = "Sign in required",
      description = "Please sign in to continue.",
    } = {}) => {
      toast.add({
        type: "info",
        title,
        description,
        duration: 5000,
        actionProps: {
          children: "Sign in",
          onClick: () => navigate("/auth/login"),
        },
      });
    },
    [navigate],
  );
}
