import { Brain } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-background container grid h-svh max-w-none items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Second Brain
              </h1>
              <p className="text-sm text-muted-foreground">
                Knowledge Management Platform
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
