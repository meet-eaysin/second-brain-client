import { z } from "zod";
import { useForm } from "react-hook-form";
import type { ResetPasswordCredentials } from "@/modules/auth/types/auth.types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "../services/auth-queries.ts";

const resetPasswordSchema = z
  .object({
    resetToken: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const useResetPassword = () => {
  const resetPasswordMutation = useResetPasswordMutation();

  const form = useForm<ResetPasswordCredentials & { confirmPassword: string }>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      resetToken: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = (
    data: ResetPasswordCredentials & { confirmPassword: string }
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...credentials } = data;
    resetPasswordMutation.mutate(credentials);
  };

  return {
    form,
    handleResetPassword,
    isLoading: resetPasswordMutation.isPending,
    error: resetPasswordMutation.error,
  };
};
