import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PlatformGrowthChart() {
  return (
    <Card className="bg-background border-lines h-full">
      <CardHeader>
        <CardTitle className="text-lg font-poppins">Platform Growth</CardTitle>
        <CardDescription className="text-xs">Revenue and user acquisition (Last 30 days)</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] flex items-center justify-center border-t border-lines/30 border-dashed m-6 rounded-xl bg-tint/[0.02]">
         <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full border-2 border-tint/20 border-t-tint animate-spin mx-auto" />
            <p className="text-[10px] text-description font-mono uppercase tracking-widest">Initialising Analytics...</p>
         </div>
      </CardContent>
    </Card>
  )
}