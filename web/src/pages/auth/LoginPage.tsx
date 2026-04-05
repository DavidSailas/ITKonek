import { LoginForm } from "@/features/auth/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
    return (
        <div className="relative min-h-svh w-full bg-background text-foreground flex flex-col items-center justify-center p-6 transition-colors duration-300">
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-60 hidden dark:block" />

            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col items-center gap-2 mb-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center mb-2 rounded-2xl bg-foreground text-background shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="16" height="10" x="4" y="5" rx="2" /><path d="M12 15v5" /><path d="M9 20h6" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-semibold uppercase tracking-[0.3em] font-poppins">
                        ITKONEK
                    </h1>
                    <p className="text-muted-foreground text-xl font-medium tracking-tight font-poppins">
                        JMS ONE IT
                    </p>
                </div>

                <LoginForm />

                <p className="mt-8 text-center text-xs text-muted-foreground font-poppins">
                    &copy; 2026 ITKonek Ecosystem. All rights reserved.
                </p>
            </div>
        </div>
    )
}