import { createContext, useContext, useEffect, useState } from "react";
import { settingsApi } from "@/modules/settings/services/settings-api.ts";
import { useAuth } from "@/modules/auth/hooks/useAuth";

type Theme = "dark" | "light" | "system";
type FontSize = "small" | "medium" | "large";

type AppearanceSettings = {
  theme: Theme;
  fontSize: FontSize;
  compactMode: boolean;
  animationsEnabled: boolean;
  highContrast: boolean;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  appearance: AppearanceSettings;
  setAppearance: (settings: Partial<AppearanceSettings>) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  appearance: {
    theme: "system",
    fontSize: "medium",
    compactMode: false,
    animationsEnabled: true,
    highContrast: false,
  },
  setAppearance: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const { isAuthenticated } = useAuth();
  const [theme, _setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [appearance, _setAppearance] = useState<AppearanceSettings>(() => {
    const stored = localStorage.getItem("appearance-settings");
    if (stored) {
      try {
        return { ...initialState.appearance, ...JSON.parse(stored) };
      } catch {
        return initialState.appearance;
      }
    }
    return initialState.appearance;
  });

  // Load appearance settings from backend only when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadAppearanceSettings = async () => {
      try {
        const response = await settingsApi.getAppearance();
        const settings = response.data;
        if (settings) {
          _setAppearance(settings);
          // Also update theme if it's different
          if (settings.theme !== theme) {
            _setTheme(settings.theme);
          }
        }
      } catch (error) {
        console.error("Failed to load appearance settings:", error);
        // Fall back to localStorage or defaults - don't fail the app
      }
    };

    loadAppearanceSettings();
  }, [isAuthenticated]);

  // Apply theme and appearance settings to DOM
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (theme: Theme) => {
      root.classList.remove("light", "dark"); // Remove existing theme classes
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      const effectiveTheme = theme === "system" ? systemTheme : theme;
      root.classList.add(effectiveTheme); // Add the new theme class
    };

    const applyAppearance = (appearance: AppearanceSettings) => {
      // Remove existing appearance classes
      root.classList.remove("font-small", "font-medium", "font-large");
      root.classList.remove("compact-mode", "high-contrast");
      root.classList.remove("animations-disabled");

      // Add new appearance classes
      root.classList.add(`font-${appearance.fontSize}`);

      if (appearance.compactMode) {
        root.classList.add("compact-mode");
      }

      if (appearance.highContrast) {
        root.classList.add("high-contrast");
      }

      if (!appearance.animationsEnabled) {
        root.classList.add("animations-disabled");
      }
    };

    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    applyTheme(theme);
    applyAppearance(appearance);

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, appearance]);

  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    _setTheme(theme);
    _setAppearance((prev) => ({ ...prev, theme }));
  };

  const setAppearance = (settings: Partial<AppearanceSettings>) => {
    const newAppearance = { ...appearance, ...settings };
    localStorage.setItem("appearance-settings", JSON.stringify(newAppearance));
    _setAppearance(newAppearance);
  };

  const value = {
    theme,
    setTheme,
    appearance,
    setAppearance,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
