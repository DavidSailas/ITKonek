import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Booking {
    id: string;
    customer: string;
    service: string;
    status: string;
    date: string;
    amount: string;
}

export const columns: ColumnDef<Booking>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="font-medium text-tint font-poppins">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "customer",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="hover:bg-tint/5 p-0 px-2 -ml-2 font-bold"
            >
                Customer
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("customer")}</div>,
    },
    {
        accessorKey: "service",
        header: "Service Type",
        cell: ({ row }) => <div className="text-description text-sm">{row.getValue("service")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = (row.getValue("status") as string).toLowerCase();
            const styles: Record<string, string> = {
                completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                cancelled: "bg-destructive/10 text-destructive border-destructive/20",
            };
            return (
                <Badge variant="outline" className={cn("capitalize font-semibold", styles[status] || "bg-slate-500/10")}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => <div className="text-right font-bold font-poppins">{row.getValue("amount")}</div>,
    },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-tint/10 rounded-lg">
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl w-auto border-lines bg-background shadow-xl">
                    <DropdownMenuLabel className="font-poppins">Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-tint/5">
                        <Eye size={14} /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive gap-2 cursor-pointer focus:bg-destructive/10">
                        <Trash2 size={14} /> Delete Booking
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];