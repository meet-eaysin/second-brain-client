import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "../services/auth-queries";
import { useAuthStore } from "../store/auth-store.ts";
import type { LoginCredentials } from "@/modules/auth/types/auth.types.ts";
import { useNavigate } from "react-router-dom";
import { getDashboardLink } from "@/app/router/router-link.ts";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const useLogin = () => {
  const navigate = useNavigate();
  const { intendedPath, setIntendedPath } = useAuthStore();

  const loginMutation = useLoginMutation({
    onSuccess: () => {
      // Navigate to intended path or dashboard
      const targetPath = intendedPath || getDashboardLink();
      setIntendedPath(null); // Clear intended path
      navigate(targetPath, { replace: true });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (data: LoginCredentials, rememberMe: boolean = true) => {
    loginMutation.mutate({ ...data, rememberMe });
  };

  return {
    form,
    handleLogin,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    mutate: loginMutation.mutate,
  };
};
