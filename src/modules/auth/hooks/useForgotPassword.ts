import { z } from "zod";
import { useForm } from "react-hook-form";
import type { ForgotPasswordCredentials } from "@/modules/auth/types/auth.types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordMutation } from "../services/auth-queries.ts";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const useForgotPassword = () => {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordCredentials>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = (data: ForgotPasswordCredentials) => {
    forgotPasswordMutation.mutate(data);
  };

  return {
    form,
    handleForgotPassword,
    isLoading: forgotPasswordMutation.isPending,
    error: forgotPasswordMutation.error,
  };
};
