import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Loader2 } from "lucide-react"
import { useLogin } from "../hooks/use-login"

export function LoginForm({ className }: { className?: string }) {
    const { login, isLoading, error } = useLogin();

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Card className="border-lines bg-card/50 backdrop-blur-xl shadow-2xl">
                <CardContent className="p-8">
                    <form className="grid gap-6" onSubmit={login}>
                        <FieldGroup className="grid gap-5">
                            {error && (
                                <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg font-medium animate-in fade-in zoom-in-95">
                                    {error}
                                </div>
                            )}

                            <Field>
                                <FieldLabel className="text-description text-[12px] tracking-widest font-bold font-poppins">
                                    Email
                                </FieldLabel>
                                <Input
                                    name="email"
                                    type="email"
                                    required
                                    disabled={isLoading}
                                    className="h-12 bg-background/50 border-lines text-foreground focus-visible:ring-tint"
                                />
                            </Field>

                            <Field>
                                <FieldLabel className="text-description text-[12px] tracking-widest font-bold font-poppins">
                                    Password
                                </FieldLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    required
                                    disabled={isLoading}
                                    className="h-12 bg-background/50 border-lines text-foreground focus-visible:ring-tint"
                                />
                            </Field>

                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" disabled={isLoading} />
                                    <label htmlFor="remember" className="text-xs text-description cursor-pointer">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-12 bg-btn text-btn-text hover:opacity-90 font-bold transition-all active:scale-95"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}