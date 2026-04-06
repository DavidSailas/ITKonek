import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useNavigate } from "react-router-dom"

export function LoginForm({ className }: { className?: string }) {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/dashboard");
    };

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Card className="border-lines bg-card/50 backdrop-blur-xl shadow-2xl">
                <CardContent className="p-8">
                    <form className="grid gap-6" onSubmit={handleSubmit}>
                        <FieldGroup className="grid gap-5">
                            <Field>
                                <FieldLabel className="text-description text-[12px] tracking-widest font-bold font-poppins">
                                    Email
                                </FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    className="h-12 bg-background/50 border-lines text-foreground focus-visible:ring-tint"
                                />
                            </Field>

                            <Field>
                                <FieldLabel className="text-description text-[12px] tracking-widest font-bold font-poppins">
                                    Password
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    className="h-12 bg-background/50 border-lines text-foreground focus-visible:ring-tint"
                                />
                            </Field>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" className="border-lines data-[state=checked]:bg-tint data-[state=checked]:border-tint" />
                                    <label htmlFor="remember" className="text-xs text-description cursor-pointer font-poppins">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="h-12 bg-btn text-btn-text hover:opacity-90 font-bold transition-all active:scale-95 shadow-md shadow-black/10 dark:shadow-white/5"
                            >
                                Log in
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}