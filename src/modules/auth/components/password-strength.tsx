import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthRequirement {
  label: string;
  met: boolean;
  regex: RegExp;
}

export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps) {
  const requirements: StrengthRequirement[] = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
      regex: /.{8,}/,
    },
    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
      regex: /[A-Z]/,
    },
    {
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
      regex: /[a-z]/,
    },
    {
      label: "One number",
      met: /\d/.test(password),
      regex: /\d/,
    },
    {
      label: "One special character",
      met: /[@$!%*?&]/.test(password),
      regex: /[@$!%*?&]/,
    },
  ];

  const strength = useMemo(() => {
    const metRequirements = requirements.filter((req) => req.met).length;
    return (metRequirements / requirements.length) * 100;
  }, [password]);

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return "bg-red-500";
    if (strength < 60) return "bg-orange-500";
    if (strength < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 40) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Password strength:</span>
        <span
          className={cn(
            "font-medium",
            strength < 40
              ? "text-red-600"
              : strength < 60
              ? "text-orange-600"
              : strength < 80
              ? "text-yellow-600"
              : "text-green-600"
          )}
        >
          {getStrengthText(strength)}
        </span>
      </div>

      <Progress
        value={strength}
        className="h-2"
        // Custom styling for the progress bar
        style={
          {
            "--progress-background": getStrengthColor(strength),
          } as React.CSSProperties
        }
      />

      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            {req.met ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <X className="h-3 w-3 text-red-500" />
            )}
            <span
              className={req.met ? "text-green-700" : "text-muted-foreground"}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
