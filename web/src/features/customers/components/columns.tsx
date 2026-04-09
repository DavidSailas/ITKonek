import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Trash2, Mail, Phone } from "lucide-react";
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

export interface Customer {
    id: string;
    photo: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    status: string;
}

export const columns: ColumnDef<Customer>[] = [
    {
        id: "select",
        size: 40,
        header: ({ table }) => (
            <div className="px-2">
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="px-2">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
    },
    {
        accessorKey: "id",
        header: "ID",
        size: 80,
        cell: ({ row }) => <div className="font-medium text-tint font-poppins">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="hover:bg-tint/5 p-0 px-2 -ml-2 font-bold"
            >
                Full Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const photo = row.original.photo;
            const name = row.getValue("fullName") as string;
            return (
                <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-slate-100 border border-lines">
                        <img src={photo} alt={name} className="h-full w-full object-cover" />
                    </div>
                    <div className="font-semibold text-sm truncate">{name}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email Address",
        cell: ({ row }) => <div className="flex gap-3 text-description text-sm line-clamp-1 min-w-[150px]">
            <Mail size={19} />
            {row.getValue("email")} 
        </div>,
    },
    {
        accessorKey: "mobileNumber",
        header: "Mobile Number",
        cell: ({ row }) => <div className="flex gap-3 text-description text-sm line-clamp-1 min-w-[150px]">
            <Phone size={19} />
            {row.getValue("mobileNumber")} 
        </div>,
    },

    {
        accessorKey: "status",
        header: () => <div className="w-[50px]">Status</div>,
        cell: ({ row }) => {
            const status = (row.getValue("status") as string).toLowerCase();
            const styles: Record<string, string> = {
                active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                banned: "bg-destructive/10 text-destructive border-destructive/20",
            };
            return (
                <div>
                    <Badge variant="outline" className={cn("capitalize font-semibold", styles[status] || "bg-slate-500/10")}>
                        {status}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: "actions",
        size: 50,
        cell: () => (
            <div className="flex justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-tint/10 rounded-lg">
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl w-40 border-lines bg-background shadow-xl">
                        <DropdownMenuLabel className="font-poppins">Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-tint/5">
                            <Eye size={14} /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive gap-2 cursor-pointer focus:bg-destructive/10">
                            <Trash2 size={14} /> Remove User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];