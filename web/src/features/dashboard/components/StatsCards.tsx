import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export function StatsCards() {
  const data = [
    { label: "Total Revenue", value: "₱62,500.00", trend: "+12.5%", desc: "Trending up this month" },
    { label: "New Customers", value: "1,234", trend: "-20%", desc: "Down 20% this period", negative: true },
    { label: "Active Pros", value: "45,678", trend: "+12.5%", desc: "Strong user retention" },
    { label: "Completion Rate", value: "94.5%", trend: "+4.5%", desc: "Steady performance increase" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {data.map((item) => (
        <Card key={item.label} className="p-4 bg-background border-lines">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-description">{item.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.negative ? 'border-destructive/20 text-destructive' : 'border-tint/20 text-tint'} font-bold`}>
              {item.trend}
            </span>
          </div>
          <div className="text-2xl font-bold mb-4 font-poppins">{item.value}</div>
          <div className="flex items-center gap-2 text-[11px] text-description/70">
            {item.negative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {item.desc}
          </div>
        </Card>
      ))}
    </div>
  )
}