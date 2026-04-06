import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  { id: 1, user: "JD", title: "John Doe", action: "requested PC Repair", loc: "Minglanilla, Cebu", time: "2m ago", price: "$45.00" },
  { id: 2, user: "AS", title: "Anna Smith", action: "booked Home Network setup", loc: "Talisay, Cebu", time: "15m ago", price: "$60.00" },
  { id: 3, user: "BK", title: "Bobby K.", action: "completed OS Install", loc: "Cebu City", time: "1h ago", price: "$30.00" },
]

export function RecentBookingsList() {
  return (
    <Card className="bg-background border-lines">
      <CardHeader>
        <CardTitle className="text-lg font-poppins">Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((item) => (
            <div key={item.id} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-tint/10 flex items-center justify-center text-tint font-bold text-xs group-hover:scale-110 transition-transform">
                {item.user}
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium leading-none">
                    <span className="font-bold">{item.title}</span> <span className="text-description font-normal">{item.action}</span>
                </p>
                <p className="text-[10px] text-description/70 uppercase tracking-tighter">
                    {item.time} • {item.loc}
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-tint">{item.price}</div>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 py-2 text-[10px] font-bold uppercase tracking-widest text-description hover:text-tint border border-dashed border-lines rounded-lg transition-colors">
            View All Transactions
        </button>
      </CardContent>
    </Card>
  )
}