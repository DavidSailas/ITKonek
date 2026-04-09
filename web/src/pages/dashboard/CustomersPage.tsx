
import { Header } from "@/features/customers/components/Header";
import type { Customer } from "@/features/customers/components/columns";

import customerData from "@/features/customers/data/customers.json";
import { CustomersTable } from "@/features/customers/components/ProfessionalsTable";

export default function CustomersPage() {

    const data = customerData as Customer[];

    return (
        <div className="space-y-6">
            <Header />
            <CustomersTable data={data} />
        </div>

    );
}