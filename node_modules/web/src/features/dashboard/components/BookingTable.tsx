import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, GripVertical, Columns, Plus } from "lucide-react"

// To do: Make this as a JSON File

export function BookingTable() {
    const bookings = [
        { id: 1, service: "Vessel Management System", type: "Software", status: "Done", target: "12", pro: "cj_dev" },
        { id: 2, service: "MTI Seafarer Portal", type: "Web App", status: "In Progress", target: "08", pro: "Eddie Lake" },
        { id: 3, service: "Network Infrastructure", type: "IT Support", status: "In Progress", target: "24", pro: "Jamik T." },
        { id: 4, service: "Marine Training Database", type: "Database", status: "Done", target: "05", pro: "cj_dev" }
        
        ,
    ]

    return (
        <div className="w-full space-y-4">
            {/* Header Section:
        
          // THIS NEEDS TO BE FIXED, CONFLICTING COMPONENT STYLING //

        */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-lines">
                <Tabs defaultValue="outline" className="w-auto">
                    <TabsList className="bg-transparent h-auto p-0 gap-6">
                        <TabsTrigger
                            value="outline"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-tint data-[state=active]:bg-transparent px-2 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-description data-[state=active]:text-foreground transition-all"
                        >
                            Outline
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-tint data-[state=active]:bg-transparent px-2 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-description data-[state=active]:text-foreground transition-all flex items-center gap-2"
                        >
                            Past Performance <span className="bg-lines/30 px-1.5 py-0.5 rounded text-[9px]">3</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2 pb-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-lines rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-tint/5 transition-colors text-description hover:text-foreground">
                        <Columns size={14} />
                        Columns
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-tint text-background rounded-lg text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-tint/10">
                        <Plus size={14} strokeWidth={3} />
                        Add Section
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-xl border border-lines bg-background overflow-hidden">
                <Table>
                    <TableHeader className="bg-tint/[0.02]">
                        <TableRow className="border-lines hover:bg-transparent">
                            <TableHead className="w-12 px-4"></TableHead>
                            <TableHead className="px-4 h-12 text-[10px] uppercase font-bold text-description tracking-widest">Header</TableHead>
                            <TableHead className="px-4 h-12 text-[10px] uppercase font-bold text-description tracking-widest">Section Type</TableHead>
                            <TableHead className="px-4 h-12 text-[10px] uppercase font-bold text-description tracking-widest">Status</TableHead>
                            <TableHead className="px-4 h-12 text-[10px] uppercase font-bold text-description tracking-widest">Target</TableHead>
                            <TableHead className="px-4 h-12 text-[10px] uppercase font-bold text-description tracking-widest">Reviewer</TableHead>
                            <TableHead className="w-12 px-4"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((row) => (
                            <TableRow key={row.id} className="border-lines hover:bg-tint/[0.01] transition-colors group">
                                <TableCell className="px-4 py-3 text-center">
                                    <GripVertical size={14} className="text-description/30 group-hover:text-description cursor-grab inline-block" />
                                </TableCell>

                                <TableCell className="px-4 py-3 text-sm font-semibold text-foreground">
                                    {row.service}
                                </TableCell>

                                <TableCell className="px-4 py-3">
                                    <span className="text-[10px] px-2.5 py-1 rounded-full border border-lines text-description font-medium">
                                        {row.type}
                                    </span>
                                </TableCell>

                                <TableCell className="px-4 py-3">
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border ${row.status === 'Done' ? 'border-tint/20 text-tint' : 'border-description/20 text-description opacity-60'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Done' ? 'bg-tint' : 'bg-description'}`} />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">{row.status}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 text-xs font-mono text-description">
                                    {row.target}
                                </TableCell>

                                <TableCell className="px-4 py-3 text-xs font-medium">
                                    {row.pro}
                                </TableCell>

                                <TableCell className="px-4 py-3">
                                    <button className="p-1 hover:bg-tint/10 rounded transition-colors">
                                        <MoreHorizontal size={14} className="text-description" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Footer Section */}
            <div className="flex items-center justify-between px-2 pt-2">
                <span className="text-[11px] text-description font-medium">0 of {bookings.length} row(s) selected.</span>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-description">Rows per page</span>
                        <div className="px-2 py-1 border border-lines rounded text-[11px] font-mono">10</div>
                    </div>
                    <span className="text-[11px] text-description">Page 1 of 1</span>
                </div>
            </div>
        </div>
    )
}