
import { Header } from "@/features/professionals/components/Header";
import type { Professional } from "@/features/professionals/components/columns";

import professionalsData from "@/features/professionals/data/professionals.json";
import { ProfessionalsTable } from "@/features/professionals/components/ProfessionalsTable";

export default function ProfessionalsPage() {

    const data = professionalsData as Professional[];

    return (
        <div className="space-y-6">
            <Header />
            <ProfessionalsTable data={data} />
        </div>

    );
}