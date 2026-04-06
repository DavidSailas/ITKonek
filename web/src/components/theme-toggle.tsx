import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [isDark])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsDark(!isDark)}
      className="rounded-xl w-10 h-10 border border-lines text-description hover:bg-tint/5 hover:text-foreground transition-all active:scale-95"
    >
      {isDark ? (
        <Moon className="h-5 w-5 transition-transform rotate-0 scale-100" />
      ) : (
        <Sun className="h-5 w-5 transition-transform rotate-0 scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}