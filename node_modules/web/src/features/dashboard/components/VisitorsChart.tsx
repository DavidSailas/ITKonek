import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function VisitorsChart() {
  return (
    <Card className="bg-background border-lines">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-base font-bold font-poppins uppercase tracking-wider">Total Visitors</CardTitle>
          <p className="text-xs text-description">Total for the last 3 months</p>
        </div>
        <div className="flex border border-lines rounded-lg overflow-hidden">
          {["Last 3 months", "Last 30 days", "Last 7 days"].map((range, i) => (
            <Button key={range} variant="ghost" className={`text-[11px] h-8 rounded-none border-l first:border-0 border-lines ${i === 0 ? 'bg-tint/5 text-tint' : 'text-description'}`}>
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="h-[400px] flex items-end justify-center pb-8">
        {/* Placeholder for AreaChart */}
        <div className="w-full h-full bg-gradient-to-t from-tint/10 to-transparent rounded-t-3xl border-t border-tint/20 flex items-center justify-center">
            <p className="text-xs font-mono text-tint uppercase tracking-[0.3em] animate-pulse">Visualizing Data Layers...</p>
        </div>
      </CardContent>
    </Card>
  )
}