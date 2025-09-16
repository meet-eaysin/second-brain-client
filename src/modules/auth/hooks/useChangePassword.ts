import { z } from "zod";
import { useForm } from "react-hook-form";
import type { ChangePasswordCredentials } from "@/modules/auth/types/auth.types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "../services/auth-queries";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
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

export const useChangePassword = () => {
  const changePasswordMutation = useChangePasswordMutation();

  const form = useForm<ChangePasswordCredentials & { confirmPassword: string }>(
    {
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    }
  );

  const handleChangePassword = (
    data: ChangePasswordCredentials & { confirmPassword: string }
  ) => {
    const { ...credentials } = data;
    changePasswordMutation.mutate(credentials);
  };

  return {
    form,
    handleChangePassword,
    isLoading: changePasswordMutation.isPending,
    error: changePasswordMutation.error,
  };
};
