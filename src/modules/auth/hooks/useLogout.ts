import { useLogoutMutation, useLogoutAllMutation } from "../services/authQueries.ts";

export const useLogout = () => {
    const logoutMutation = useLogoutMutation();

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return {
        handleLogout,
        isLoading: logoutMutation.isPending,
        error: logoutMutation.error,
    };
};

export const useLogoutAll = () => {
    const logoutAllMutation = useLogoutAllMutation();

    const handleLogoutAll = () => {
        logoutAllMutation.mutate();
    };

    return {
        handleLogoutAll,
        isLoading: logoutAllMutation.isPending,
        error: logoutAllMutation.error,
    };
};
