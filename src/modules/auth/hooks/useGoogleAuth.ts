import { useGoogleLoginMutation } from "../services/auth-queries";

export const useGoogleAuth = () => {
  const googleLoginMutation = useGoogleLoginMutation();

  const handleGoogleCallback = (code: string) => {
    googleLoginMutation.mutate(code);
  };

  return {
    handleGoogleCallback,
    isLoading: googleLoginMutation.isPending,
    error: googleLoginMutation.error,
  };
};
