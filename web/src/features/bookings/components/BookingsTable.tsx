import { 
    Table, TableBody, TableCell, TableHead, 
    TableHeader, TableRow 
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { cn } from "@/lib/utils";
  
  const bookings = [
    { id: "BK-101", customer: "Capt. Hook", service: "Radar Repair", status: "pending" },
    { id: "BK-102", customer: "MTI Training", service: "System Update", status: "completed" },
  ];
  
  export const BookingsTable = () => {
    return (
      <div className="rounded-xl border border-lines bg-background overflow-hidden">
        <Table>
          <TableHeader className="bg-tint/5">
            <TableRow className="border-lines hover:bg-transparent">
              <TableHead className="font-bold text-foreground">ID</TableHead>
              <TableHead className="font-bold text-foreground">Customer</TableHead>
              <TableHead className="font-bold text-foreground">Service</TableHead>
              <TableHead className="font-bold text-foreground">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id} className="border-lines hover:bg-tint/5">
                <TableCell className="font-medium text-tint">{b.id}</TableCell>
                <TableCell>{b.customer}</TableCell>
                <TableCell className="text-description">{b.service}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "capitalize font-semibold",
                    b.status === "completed" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                  )}>
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-tint/10 rounded-lg">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-lines">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2"><Eye size={14} /> View</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive gap-2"><Trash2 size={14} /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };