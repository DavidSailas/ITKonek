import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

export function LoginForm({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl">
                <CardContent className="p-8">
                    <form className="grid gap-6">
                        <FieldGroup className="grid gap-5">
                            <Field>
                                <FieldLabel className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold font-poppins">
                                    Email
                                </FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    className="h-12 bg-input/50 border-border text-foreground"
                                />
                            </Field>

                            <Field>
                                <FieldLabel className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold font-poppins">
                                    Password
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    className="h-12 bg-input/50 border-border text-foreground"
                                />
                            </Field>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" className="border-border" />
                                    <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer font-poppins">
                                        Remember me
                                    </label>
                                </div>
                                <a href="#" className="text-xs font-semibold text-foreground hover:underline font-poppins">
                                    Forgot Password?
                                </a>
                            </div>

                            <Button type="submit" className="h-12 bg-primary text-primary-foreground hover:opacity-90 font-bold transition-transform active:scale-95">
                                Log in
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}